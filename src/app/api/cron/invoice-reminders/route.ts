import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * CRON : Relances factures impayées et devis sans réponse
 * - Factures envoyées dont la date d'échéance est dépassée
 * - Devis envoyés dont la validité arrive à expiration
 * Crée des notifications et enregistre les e-mails à envoyer.
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

    // Seuils pour les devis : alerte 7 jours et 3 jours avant expiration
    const quoteWarningDays = 7;
    const quoteWarningDate = new Date(today);
    quoteWarningDate.setDate(quoteWarningDate.getDate() + quoteWarningDays);
    const quoteWarningStr = quoteWarningDate.toISOString().split('T')[0];

    // Récupérer les admins/managers pour les notifications
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .in('role', ['super_admin', 'manager'])
      .eq('is_active', true);

    const adminIds = (admins ?? []).map((a) => a.id);

    let invoiceAlerts = 0;
    let quoteAlerts = 0;

    // --- 1. Factures en retard ---
    const { data: overdueInvoices, error: invoiceError } = await supabase
      .from('invoices')
      .select('id, reference, client_id, total_ttc, due_date, clients(name, email)')
      .eq('status', 'sent')
      .lt('due_date', todayStr);

    if (invoiceError) {
      throw new Error(`Erreur requête factures : ${invoiceError.message}`);
    }

    for (const invoice of overdueInvoices ?? []) {
      const client = invoice.clients as any;
      const clientName = client?.name ?? 'Client inconnu';
      const dueDate = new Date(invoice.due_date!);
      const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

      // Créer notification pour les admins
      for (const adminId of adminIds) {
        await supabase.from('notifications').insert({
          user_id: adminId,
          type: 'facture_impayee',
          title: `Facture impayée — ${clientName}`,
          body: `La facture ${invoice.reference ?? invoice.id} de ${invoice.total_ttc} € TTC est en retard de ${daysOverdue} jour(s). Échéance : ${invoice.due_date}.`,
          metadata: {
            invoice_id: invoice.id,
            client_id: invoice.client_id,
            days_overdue: daysOverdue,
          },
        });
      }

      // Log e-mail de relance
      if (client?.email) {
        await supabase.from('email_logs').insert({
          recipient_email: client.email,
          type: 'relance_facture',
          subject: `Relance : facture ${invoice.reference ?? ''} en attente de paiement`,
          status: 'pending',
        });
      }

      console.log(`[CRON Factures] Relance — ${clientName}, facture ${invoice.reference ?? invoice.id}, retard ${daysOverdue}j`);
      invoiceAlerts++;
    }

    // --- 2. Devis sans réponse (validité approche) ---
    const { data: expiringQuotes, error: quoteError } = await supabase
      .from('quotes')
      .select('id, reference, client_id, total_ttc, valid_until, clients(name, email)')
      .eq('status', 'sent')
      .lte('valid_until', quoteWarningStr)
      .gte('valid_until', todayStr);

    if (quoteError) {
      throw new Error(`Erreur requête devis : ${quoteError.message}`);
    }

    for (const quote of expiringQuotes ?? []) {
      const client = quote.clients as any;
      const clientName = client?.name ?? 'Client inconnu';
      const validUntil = new Date(quote.valid_until!);
      const daysLeft = Math.ceil((validUntil.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Créer notification pour les admins
      for (const adminId of adminIds) {
        await supabase.from('notifications').insert({
          user_id: adminId,
          type: 'devis_sans_reponse',
          title: `Devis bientôt expiré — ${clientName}`,
          body: `Le devis ${quote.reference ?? quote.id} de ${quote.total_ttc} € TTC expire dans ${daysLeft} jour(s) (${quote.valid_until}).`,
          metadata: {
            quote_id: quote.id,
            client_id: quote.client_id,
            days_left: daysLeft,
          },
        });
      }

      // Log e-mail de relance
      if (client?.email) {
        await supabase.from('email_logs').insert({
          recipient_email: client.email,
          type: 'relance_devis',
          subject: `Rappel : votre devis ${quote.reference ?? ''} expire bientôt`,
          status: 'pending',
        });
      }

      console.log(`[CRON Devis] Relance — ${clientName}, devis ${quote.reference ?? quote.id}, expire dans ${daysLeft}j`);
      quoteAlerts++;
    }

    return NextResponse.json({
      success: true,
      message: `${invoiceAlerts} relance(s) facture, ${quoteAlerts} relance(s) devis.`,
      invoice_alerts: invoiceAlerts,
      quote_alerts: quoteAlerts,
      total: invoiceAlerts + quoteAlerts,
    });
  } catch (error: any) {
    console.error('[CRON Factures/Devis] Erreur :', error);
    return NextResponse.json(
      { error: error.message ?? 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
