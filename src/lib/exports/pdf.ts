import jsPDF from 'jspdf';
import type { MainCouranteEvent, InterventionForm, Service, Collaborator } from '@/types';
import { formatDate, formatDateTime, formatTime } from '@/lib/utils/dates';
import { formatDuration } from '@/lib/utils/format';

// ---- Branding Constants ----

const BRAND_COLOR: [number, number, number] = [30, 41, 59]; // slate-800
const ACCENT_COLOR: [number, number, number] = [168, 85, 247]; // purple-500
const HEADER_HEIGHT = 35;
const FOOTER_HEIGHT = 20;
const MARGIN = 15;

// ---- Common Helpers ----

function addHeader(doc: jsPDF, title: string) {
  doc.setFillColor(...ACCENT_COLOR);
  doc.rect(0, 0, doc.internal.pageSize.width, HEADER_HEIGHT, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('ÉMINENCE SÉCURITÉ', MARGIN, 12);

  doc.setFontSize(14);
  doc.text(title, MARGIN, 26);

  doc.setTextColor(...BRAND_COLOR);
}

function addFooter(doc: jsPDF, pageNumber?: number) {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  doc.setDrawColor(200, 200, 200);
  doc.line(MARGIN, pageHeight - FOOTER_HEIGHT, pageWidth - MARGIN, pageHeight - FOOTER_HEIGHT);

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);

  const now = new Date();
  doc.text(`Généré le ${formatDateTime(now)}`, MARGIN, pageHeight - 10);

  if (pageNumber !== undefined) {
    doc.text(`Page ${pageNumber}`, pageWidth - MARGIN - 20, pageHeight - 10);
  }

  doc.text('Éminence Manager', pageWidth / 2 - 15, pageHeight - 10);
  doc.setTextColor(...BRAND_COLOR);
}

function checkPageBreak(doc: jsPDF, currentY: number, requiredSpace: number): number {
  if (currentY + requiredSpace > doc.internal.pageSize.height - FOOTER_HEIGHT - 10) {
    addFooter(doc);
    doc.addPage();
    addHeader(doc, '');
    return HEADER_HEIGHT + 10;
  }
  return currentY;
}

// ---- PDF Generators ----

/**
 * Generate a PDF for Main Courante events.
 */
export function generateMainCourantePDF(
  events: MainCouranteEvent[],
  siteName: string = 'Site'
): jsPDF {
  const doc = new jsPDF();
  addHeader(doc, `Main Courante — ${siteName}`);

  let y = HEADER_HEIGHT + 15;

  doc.setFontSize(10);
  doc.setTextColor(...BRAND_COLOR);

  if (events.length === 0) {
    doc.text('Aucun événement enregistré.', MARGIN, y);
    addFooter(doc, 1);
    return doc;
  }

  // Summary
  doc.setFontSize(9);
  doc.text(`Nombre d'événements : ${events.length}`, MARGIN, y);
  y += 10;

  events.forEach((event, index) => {
    y = checkPageBreak(doc, y, 40);

    // Event header bar
    doc.setFillColor(240, 240, 245);
    doc.rect(MARGIN, y - 4, doc.internal.pageSize.width - 2 * MARGIN, 8, 'F');

    doc.setFontSize(9);
    doc.setFont(undefined!, 'bold');
    doc.text(
      `#${index + 1} — ${event.event_type.toUpperCase()} — ${formatDateTime(event.timestamp)}`,
      MARGIN + 2,
      y + 1
    );
    y += 10;

    doc.setFont(undefined!, 'normal');
    doc.setFontSize(8);

    doc.text(`Titre : ${event.title}`, MARGIN + 4, y);
    y += 5;

    if (event.description) {
      const lines = doc.splitTextToSize(event.description, doc.internal.pageSize.width - 2 * MARGIN - 8);
      doc.text(lines, MARGIN + 4, y);
      y += lines.length * 4 + 2;
    }

    if (event.actions_taken) {
      doc.text(`Actions : ${event.actions_taken}`, MARGIN + 4, y);
      y += 5;
    }

    if (event.follow_up_required) {
      doc.setTextColor(220, 38, 38);
      doc.text('⚠ Suivi requis', MARGIN + 4, y);
      doc.setTextColor(...BRAND_COLOR);
      y += 5;
    }

    y += 5;
  });

  addFooter(doc, 1);
  return doc;
}

/**
 * Generate a PDF for an Intervention Form.
 */
export function generateInterventionPDF(form: InterventionForm): jsPDF {
  const doc = new jsPDF();
  addHeader(doc, "Rapport d'Intervention");

  let y = HEADER_HEIGHT + 15;

  doc.setFontSize(10);
  doc.setTextColor(...BRAND_COLOR);

  const addField = (label: string, value: string | null | undefined) => {
    if (!value) return;
    y = checkPageBreak(doc, y, 8);
    doc.setFont(undefined!, 'bold');
    doc.text(`${label} :`, MARGIN, y);
    doc.setFont(undefined!, 'normal');
    doc.text(value, MARGIN + 45, y);
    y += 6;
  };

  addField('Référence', form.id.slice(0, 8).toUpperCase());
  addField('Date', formatDate(form.intervention_date));
  addField('Heure', form.intervention_time);
  addField('Priorité', form.priority.toUpperCase());
  addField('Catégorie', form.category);

  y += 5;
  doc.setFont(undefined!, 'bold');
  doc.text('Description :', MARGIN, y);
  y += 6;
  doc.setFont(undefined!, 'normal');
  const descLines = doc.splitTextToSize(form.description, doc.internal.pageSize.width - 2 * MARGIN);
  doc.text(descLines, MARGIN, y);
  y += descLines.length * 5 + 5;

  addField('Personnes impliquées', form.persons_involved);
  addField('Témoins', form.witnesses);

  y += 5;
  doc.setFont(undefined!, 'bold');
  doc.text('Actions entreprises :', MARGIN, y);
  y += 6;
  doc.setFont(undefined!, 'normal');
  const actionLines = doc.splitTextToSize(form.actions_taken, doc.internal.pageSize.width - 2 * MARGIN);
  doc.text(actionLines, MARGIN, y);
  y += actionLines.length * 5 + 5;

  if (form.authorities_notified) {
    addField('Autorités notifiées', form.authority_details ?? 'Oui');
  }
  if (form.injuries) {
    addField('Blessures', form.injury_details ?? 'Oui');
  }
  if (form.property_damage) {
    addField('Dégâts matériels', form.damage_details ?? 'Oui');
  }

  addFooter(doc, 1);
  return doc;
}

/**
 * Generate a PDF planning for a list of services.
 */
export function generatePlanningPDF(
  services: Service[],
  title: string = 'Planning'
): jsPDF {
  const doc = new jsPDF('landscape');
  addHeader(doc, title);

  let y = HEADER_HEIGHT + 15;

  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLOR);

  // Table headers
  const cols = ['Date', 'Horaires', 'Site', 'Prestation', 'Agents', 'Statut'];
  const colWidths = [30, 25, 60, 50, 55, 30];
  let x = MARGIN;

  doc.setFillColor(240, 240, 245);
  doc.rect(MARGIN, y - 4, doc.internal.pageSize.width - 2 * MARGIN, 8, 'F');
  doc.setFont(undefined!, 'bold');
  cols.forEach((col, i) => {
    doc.text(col, x, y + 1);
    x += colWidths[i];
  });
  y += 10;

  doc.setFont(undefined!, 'normal');

  services.forEach((service) => {
    y = checkPageBreak(doc, y, 8);
    x = MARGIN;

    const row = [
      formatDate(service.date),
      `${formatTime(service.start_time)} - ${formatTime(service.end_time)}`,
      service.site?.name ?? '',
      service.presta_type?.name ?? service.title,
      service.assignments?.map((a) => `${a.collaborator?.first_name ?? ''} ${a.collaborator?.last_name ?? ''}`).join(', ') ?? '',
      service.status,
    ];

    row.forEach((cell, i) => {
      const truncated = cell.length > colWidths[i] / 2.5
        ? cell.slice(0, Math.floor(colWidths[i] / 2.5)) + '...'
        : cell;
      doc.text(truncated, x, y);
      x += colWidths[i];
    });

    y += 6;
  });

  addFooter(doc, 1);
  return doc;
}

interface PayrollLineData {
  collaborator: Collaborator;
  month: string;
  totalHours: number;
  overtimeHours: number;
  nightHours: number;
  sundayHolidayHours: number;
  grossAmount: number;
}

/**
 * Generate a payroll summary PDF.
 */
export function generatePayrollPDF(
  data: PayrollLineData[],
  month: string
): jsPDF {
  const doc = new jsPDF('landscape');
  addHeader(doc, `Récapitulatif de paie — ${month}`);

  let y = HEADER_HEIGHT + 15;

  doc.setFontSize(8);
  doc.setTextColor(...BRAND_COLOR);

  const cols = ['Matricule', 'Nom', 'Heures totales', 'Heures sup.', 'Heures nuit', 'Dim./Fériés', 'Brut'];
  const colWidths = [25, 55, 30, 30, 30, 30, 30];
  let x = MARGIN;

  doc.setFillColor(240, 240, 245);
  doc.rect(MARGIN, y - 4, doc.internal.pageSize.width - 2 * MARGIN, 8, 'F');
  doc.setFont(undefined!, 'bold');
  cols.forEach((col, i) => {
    doc.text(col, x, y + 1);
    x += colWidths[i];
  });
  y += 10;

  doc.setFont(undefined!, 'normal');

  data.forEach((line) => {
    y = checkPageBreak(doc, y, 8);
    x = MARGIN;

    const row = [
      line.collaborator.matricule,
      `${line.collaborator.last_name} ${line.collaborator.first_name}`,
      `${line.totalHours.toFixed(2)}h`,
      `${line.overtimeHours.toFixed(2)}h`,
      `${line.nightHours.toFixed(2)}h`,
      `${line.sundayHolidayHours.toFixed(2)}h`,
      `${line.grossAmount.toFixed(2)} €`,
    ];

    row.forEach((cell, i) => {
      doc.text(cell, x, y);
      x += colWidths[i];
    });

    y += 6;
  });

  addFooter(doc, 1);
  return doc;
}
