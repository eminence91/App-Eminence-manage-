import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * CRON : Envoi du planning hebdomadaire
 * Déclenché chaque lundi à 7h via un cron externe (Vercel Cron, etc.)
 * Récupère tous les collaborateurs actifs avec permis,
 * génère un résumé de leurs services pour les X prochains jours
 * (amplitude depuis les paramètres agence), et envoie un e-mail.
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
    // 1. Récupérer l'amplitude du planning depuis les paramètres agence
    const { data: settings, error: settingsError } = await supabase
      .from('agency_settings')
      .select('planning_email_amplitude')
      .single();

    if (settingsError) {
      throw new Error(`Erreur lors de la récupération des paramètres agence : ${settingsError.message}`);
    }

    const amplitude = settings?.planning_email_amplitude ?? 7; // Par défaut 7 jours

    // 2. Récupérer tous les collaborateurs actifs avec permis
    const { data: collaborators, error: collabError } = await supabase
      .from('collaborators')
      .select('id, first_name, last_name, email')
      .eq('status', 'active')
      .eq('has_license', true);

    if (collabError) {
      throw new Error(`Erreur lors de la récupération des collaborateurs : ${collabError.message}`);
    }

    if (!collaborators || collaborators.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucun collaborateur actif avec permis trouvé.',
        emails_sent: 0,
      });
    }

    // 3. Calculer la plage de dates
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + amplitude);

    const startDateStr = today.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const emailsSent: { collaborator: string; email: string | null; services_count: number }[] = [];

    // 4. Pour chaque collaborateur, récupérer ses services
    for (const collab of collaborators) {
      const { data: assignments, error: assignError } = await supabase
        .from('service_assignments')
        .select(`
          service_id,
          services (
            id,
            date,
            start_time,
            end_time,
            is_published,
            sites ( name, address, city )
          )
        `)
        .eq('collaborator_id', collab.id);

      if (assignError) {
        console.error(`Erreur pour le collaborateur ${collab.id} : ${assignError.message}`);
        continue;
      }

      // Filtrer les services dans la plage de dates et publiés
      const upcomingServices = (assignments ?? []).filter((a: any) => {
        const service = a.services;
        return (
          service &&
          service.is_published &&
          service.date >= startDateStr &&
          service.date <= endDateStr
        );
      });

      if (upcomingServices.length === 0) continue;

      // 5. Générer le résumé du planning
      const planningLines = upcomingServices.map((a: any) => {
        const s = a.services;
        const site = s.sites;
        return `${s.date} | ${s.start_time}-${s.end_time} | ${site?.name ?? 'Site inconnu'} (${site?.city ?? ''})`;
      });

      const summary = [
        `Bonjour ${collab.first_name} ${collab.last_name},`,
        '',
        `Voici votre planning pour les ${amplitude} prochains jours :`,
        '',
        ...planningLines,
        '',
        'Bonne semaine !',
        "L'équipe Éminence Services",
      ].join('\n');

      // 6. Enregistrer dans les logs e-mail (envoi réel à implémenter)
      if (collab.email) {
        await supabase.from('email_logs').insert({
          recipient_email: collab.email,
          type: 'planning_hebdomadaire',
          subject: `Votre planning du ${startDateStr} au ${endDateStr}`,
          status: 'pending',
        });
      }

      console.log(`[CRON Planning] E-mail préparé pour ${collab.first_name} ${collab.last_name} (${collab.email}) — ${upcomingServices.length} service(s)`);
      console.log(summary);

      emailsSent.push({
        collaborator: `${collab.first_name} ${collab.last_name}`,
        email: collab.email,
        services_count: upcomingServices.length,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Planning envoyé à ${emailsSent.length} collaborateur(s).`,
      amplitude,
      period: { start: startDateStr, end: endDateStr },
      emails_sent: emailsSent.length,
      details: emailsSent,
    });
  } catch (error: any) {
    console.error('[CRON Planning] Erreur :', error);
    return NextResponse.json(
      { error: error.message ?? 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
