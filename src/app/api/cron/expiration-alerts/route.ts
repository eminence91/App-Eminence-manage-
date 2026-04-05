import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * CRON : Alertes d'expiration de documents / réglementaire
 * Vérifie les expirations à 90, 60, 30 et 0 jours
 * pour les collaborateurs et les clients.
 * Crée des notifications et marque les drapeaux d'alerte.
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
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Seuils d'alerte en jours
    const thresholds = [
      { days: 90, flag: 'alert_90' },
      { days: 60, flag: 'alert_60' },
      { days: 30, flag: 'alert_30' },
      { days: 0, flag: 'alert_0' },
    ] as const;

    let totalAlerts = 0;

    // Récupérer les admins/managers pour les notifications
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .in('role', ['super_admin', 'manager'])
      .eq('is_active', true);

    const adminIds = (admins ?? []).map((a) => a.id);

    // --- Expirations collaborateurs ---
    const { data: collabExpirations, error: collabError } = await supabase
      .from('collaborator_expirations')
      .select('id, collaborator_id, label, expires_at, alert_90, alert_60, alert_30, alert_0, collaborators(first_name, last_name)')
      .gte('expires_at', todayStr);

    if (collabError) {
      throw new Error(`Erreur expirations collaborateurs : ${collabError.message}`);
    }

    for (const exp of collabExpirations ?? []) {
      const expiresAt = new Date(exp.expires_at);
      const diffDays = Math.ceil((expiresAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      for (const threshold of thresholds) {
        const flagKey = threshold.flag as keyof typeof exp;
        if (diffDays <= threshold.days && !exp[flagKey]) {
          const collab = exp.collaborators as any;
          const collabName = collab ? `${collab.first_name} ${collab.last_name}` : 'Collaborateur inconnu';

          // Créer une notification pour chaque admin
          for (const adminId of adminIds) {
            await supabase.from('notifications').insert({
              user_id: adminId,
              type: 'expiration_collaborateur',
              title: `Expiration dans ${threshold.days} jour(s) — ${collabName}`,
              body: `Le document « ${exp.label} » de ${collabName} expire le ${exp.expires_at}.`,
              metadata: {
                collaborator_id: exp.collaborator_id,
                expiration_id: exp.id,
                threshold_days: threshold.days,
              },
            });
          }

          // Marquer le drapeau d'alerte
          await supabase
            .from('collaborator_expirations')
            .update({ [threshold.flag]: true })
            .eq('id', exp.id);

          // Log e-mail à envoyer
          console.log(`[CRON Expiration] Alerte ${threshold.days}j — Collaborateur ${collabName}, document « ${exp.label} », expire le ${exp.expires_at}`);
          totalAlerts++;

          break; // Ne traiter que le seuil le plus proche
        }
      }
    }

    // --- Expirations clients ---
    const { data: clientExpirations, error: clientError } = await supabase
      .from('client_expirations')
      .select('id, client_id, label, expires_at, alert_90, alert_60, alert_30, alert_0, clients(name)')
      .gte('expires_at', todayStr);

    if (clientError) {
      throw new Error(`Erreur expirations clients : ${clientError.message}`);
    }

    for (const exp of clientExpirations ?? []) {
      const expiresAt = new Date(exp.expires_at);
      const diffDays = Math.ceil((expiresAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      for (const threshold of thresholds) {
        const flagKey = threshold.flag as keyof typeof exp;
        if (diffDays <= threshold.days && !exp[flagKey]) {
          const client = exp.clients as any;
          const clientName = client?.name ?? 'Client inconnu';

          // Créer une notification pour chaque admin
          for (const adminId of adminIds) {
            await supabase.from('notifications').insert({
              user_id: adminId,
              type: 'expiration_client',
              title: `Expiration dans ${threshold.days} jour(s) — ${clientName}`,
              body: `Le document « ${exp.label} » de ${clientName} expire le ${exp.expires_at}.`,
              metadata: {
                client_id: exp.client_id,
                expiration_id: exp.id,
                threshold_days: threshold.days,
              },
            });
          }

          // Marquer le drapeau d'alerte
          await supabase
            .from('client_expirations')
            .update({ [threshold.flag]: true })
            .eq('id', exp.id);

          console.log(`[CRON Expiration] Alerte ${threshold.days}j — Client ${clientName}, document « ${exp.label} », expire le ${exp.expires_at}`);
          totalAlerts++;

          break;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${totalAlerts} alerte(s) d'expiration générée(s).`,
      total_alerts: totalAlerts,
    });
  } catch (error: any) {
    console.error('[CRON Expiration] Erreur :', error);
    return NextResponse.json(
      { error: error.message ?? 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
