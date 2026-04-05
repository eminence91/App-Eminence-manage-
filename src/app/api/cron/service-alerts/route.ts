import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * CRON : Alertes services non démarrés
 * Vérifie si des agents n'ont pas pointé (pas de service_session)
 * 15 minutes après l'heure de début de leur service.
 * Crée une notification d'alerte pour les administrateurs.
 */
export async function GET(request: NextRequest) {
  // --- Vérification d'authentification CRON ---
  const cronSecret = request.headers.get('x-cron-secret');
  if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: 'Non autorisé. Clé CRON_SECRET invalide.' },
      { status: 401 }
    );
  }

  const supabase = createAdminClient();

  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Heure actuelle moins 15 minutes (seuil de retard)
    const thresholdDate = new Date(now.getTime() - 15 * 60 * 1000);
    const thresholdTime = thresholdDate.toTimeString().slice(0, 8); // HH:MM:SS

    // 1. Récupérer les services d'aujourd'hui dont l'heure de début + 15 min est dépassée
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select(`
        id,
        start_time,
        end_time,
        is_published,
        sites ( id, name, address, city ),
        service_assignments (
          collaborator_id,
          collaborators ( first_name, last_name )
        )
      `)
      .eq('date', todayStr)
      .eq('is_published', true)
      .eq('is_draft', false)
      .lt('start_time', thresholdTime);

    if (servicesError) {
      throw new Error(`Erreur requête services : ${servicesError.message}`);
    }

    // Récupérer les admins/managers pour les notifications
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .in('role', ['super_admin', 'manager'])
      .eq('is_active', true);

    const adminIds = (admins ?? []).map((a) => a.id);

    let alertCount = 0;

    for (const service of services ?? []) {
      const assignments = (service.service_assignments as any[]) ?? [];

      for (const assignment of assignments) {
        const collaboratorId = assignment.collaborator_id;

        // 2. Vérifier s'il existe une session de pointage pour ce service et ce collaborateur
        const { data: sessions, error: sessionError } = await supabase
          .from('service_sessions')
          .select('id')
          .eq('service_id', service.id)
          .eq('collaborator_id', collaboratorId)
          .limit(1);

        if (sessionError) {
          console.error(`Erreur vérification session pour service ${service.id} / collaborateur ${collaboratorId} : ${sessionError.message}`);
          continue;
        }

        // 3. Si aucune session, créer une alerte
        if (!sessions || sessions.length === 0) {
          const collab = assignment.collaborators as any;
          const collabName = collab ? `${collab.first_name} ${collab.last_name}` : 'Agent inconnu';
          const site = service.sites as any;
          const siteName = site?.name ?? 'Site inconnu';

          for (const adminId of adminIds) {
            await supabase.from('notifications').insert({
              user_id: adminId,
              type: 'service_non_demarre',
              title: `Service non démarré — ${collabName}`,
              body: `${collabName} n'a pas pointé pour le service de ${service.start_time} à ${service.end_time} sur le site « ${siteName} » (${site?.city ?? ''}). Retard de plus de 15 minutes.`,
              metadata: {
                service_id: service.id,
                collaborator_id: collaboratorId,
                site_id: site?.id,
                scheduled_start: service.start_time,
              },
            });
          }

          console.log(`[CRON Service] Alerte — ${collabName} n'a pas pointé pour le service ${service.id} (${service.start_time}) sur ${siteName}`);
          alertCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${alertCount} alerte(s) de service non démarré.`,
      alert_count: alertCount,
      checked_at: now.toISOString(),
      threshold_time: thresholdTime,
    });
  } catch (error: any) {
    console.error('[CRON Service] Erreur :', error);
    return NextResponse.json(
      { error: error.message ?? 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
