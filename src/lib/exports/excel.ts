import * as XLSX from 'xlsx';
import type { Collaborator } from '@/types';
import { formatDate } from '@/lib/utils/dates';

// ---- Types ----

interface PayrollRow {
  matricule: string;
  lastName: string;
  firstName: string;
  totalHours: number;
  overtimeHours: number;
  nightHours: number;
  sundayHolidayHours: number;
  leaveDays: number;
  sickDays: number;
  grossAmount: number;
  overtimeAmount: number;
  nightBonus: number;
  sundayHolidayBonus: number;
}

interface HoursDetailRow {
  date: string;
  collaboratorName: string;
  siteName: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  plannedHours: number;
  actualHours: number;
  overtimeHours: number;
  nightHours: number;
  status: string;
}

// ---- Helpers ----

function createWorkbook(): XLSX.WorkBook {
  return XLSX.utils.book_new();
}

function downloadWorkbook(wb: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(wb, filename);
}

function autoFitColumns(ws: XLSX.WorkSheet, data: Record<string, unknown>[]) {
  if (data.length === 0) return;

  const colWidths: number[] = [];
  const keys = Object.keys(data[0]);

  keys.forEach((key, i) => {
    let maxLen = key.length;
    data.forEach((row) => {
      const val = String(row[key] ?? '');
      if (val.length > maxLen) maxLen = val.length;
    });
    colWidths[i] = Math.min(maxLen + 2, 40);
  });

  ws['!cols'] = colWidths.map((w) => ({ wch: w }));
}

// ---- Generators ----

/**
 * Generate and download a payroll summary Excel file.
 */
export function generatePayrollExcel(
  data: PayrollRow[],
  month: string,
  filename?: string
) {
  const wb = createWorkbook();

  const rows = data.map((row) => ({
    Matricule: row.matricule,
    Nom: row.lastName,
    Prénom: row.firstName,
    'Heures totales': row.totalHours,
    'Heures sup.': row.overtimeHours,
    'Heures nuit': row.nightHours,
    'Dim./Fériés': row.sundayHolidayHours,
    'Jours congé': row.leaveDays,
    'Jours maladie': row.sickDays,
    'Brut (€)': row.grossAmount,
    'Prime HS (€)': row.overtimeAmount,
    'Prime nuit (€)': row.nightBonus,
    'Prime dim./fériés (€)': row.sundayHolidayBonus,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  autoFitColumns(ws, rows);

  XLSX.utils.book_append_sheet(wb, ws, `Paie ${month}`);

  downloadWorkbook(wb, filename ?? `paie_${month}.xlsx`);
  return wb;
}

/**
 * Generate and download a personnel register Excel file (Registre du personnel).
 */
export function generatePersonnelRegisterExcel(
  collaborators: Collaborator[],
  filename?: string
) {
  const wb = createWorkbook();

  const rows = collaborators.map((c) => ({
    Matricule: c.matricule,
    Nom: c.last_name,
    Prénom: c.first_name,
    'Date de naissance': c.date_of_birth ? formatDate(c.date_of_birth) : '',
    'Lieu de naissance': c.place_of_birth ?? '',
    Nationalité: c.nationality ?? '',
    'N° Sécurité sociale': c.social_security_number ?? '',
    'N° CNAPS': c.cnaps_number ?? '',
    'Expiration CNAPS': c.cnaps_expiry ? formatDate(c.cnaps_expiry) : '',
    'Type de contrat': c.contract_type ?? '',
    'Début contrat': c.contract_start ? formatDate(c.contract_start) : '',
    'Fin contrat': c.contract_end ? formatDate(c.contract_end) : '',
    Qualification: c.qualification ?? '',
    Coefficient: c.coefficient ?? '',
    'Taux horaire (€)': c.hourly_rate ?? '',
    Statut: c.status,
    Email: c.email,
    Téléphone: c.phone ?? '',
    Adresse: c.address ?? '',
    Ville: c.city ?? '',
    'Code postal': c.postal_code ?? '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  autoFitColumns(ws, rows);

  XLSX.utils.book_append_sheet(wb, ws, 'Registre du personnel');

  downloadWorkbook(wb, filename ?? 'registre_personnel.xlsx');
  return wb;
}

/**
 * Generate and download a detailed hours Excel file.
 */
export function generateHoursDetailExcel(
  data: HoursDetailRow[],
  month: string,
  filename?: string
) {
  const wb = createWorkbook();

  const rows = data.map((row) => ({
    Date: row.date,
    Collaborateur: row.collaboratorName,
    Site: row.siteName,
    'Début prévu': row.plannedStart,
    'Fin prévue': row.plannedEnd,
    'Début réel': row.actualStart ?? '',
    'Fin réelle': row.actualEnd ?? '',
    'Heures prévues': row.plannedHours,
    'Heures réelles': row.actualHours,
    'Heures sup.': row.overtimeHours,
    'Heures nuit': row.nightHours,
    Statut: row.status,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  autoFitColumns(ws, rows);

  XLSX.utils.book_append_sheet(wb, ws, `Détail heures ${month}`);

  downloadWorkbook(wb, filename ?? `detail_heures_${month}.xlsx`);
  return wb;
}
