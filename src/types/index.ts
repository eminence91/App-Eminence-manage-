// ============================================================
// Éminence Manager - Type Definitions
// ============================================================

// ---- Enums ----

export type UserRole = 'super_admin' | 'manager' | 'agent' | 'client';

export type ServiceStatus =
  | 'planned'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'incident';

export type CollaboratorStatus =
  | 'active'
  | 'inactive'
  | 'on_leave'
  | 'suspended'
  | 'terminated';

export type PlanningView = 'day' | 'week' | 'month' | 'timeline';

export type UnavailabilityType =
  | 'leave'
  | 'sick'
  | 'training'
  | 'personal'
  | 'other';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type StockActionType = 'in' | 'out' | 'adjustment' | 'transfer';

export type NotificationType =
  | 'assignment'
  | 'schedule_change'
  | 'clock_reminder'
  | 'incident'
  | 'leave_request'
  | 'leave_response'
  | 'announcement'
  | 'message'
  | 'system';

export type DocumentCategory =
  | 'contract'
  | 'id'
  | 'diploma'
  | 'medical'
  | 'insurance'
  | 'other';

export type PrestaCategory =
  | 'security_guard'
  | 'bodyguard'
  | 'event_security'
  | 'patrol'
  | 'video_surveillance'
  | 'access_control'
  | 'fire_safety'
  | 'k9'
  | 'other';

export type QuoteStatus =
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'rejected'
  | 'expired';

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'credited';

export type MainCouranteEventType =
  | 'arrival'
  | 'departure'
  | 'patrol'
  | 'incident'
  | 'visitor'
  | 'delivery'
  | 'alarm'
  | 'observation'
  | 'other';

export type InterventionPriority = 'low' | 'medium' | 'high' | 'critical';

// ---- Core Models ----

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  agency_id: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgencySettings {
  id: string;
  name: string;
  legal_name: string | null;
  siret: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  timezone: string;
  default_overtime_threshold: number;
  night_hours_start: string;
  night_hours_end: string;
  sunday_holiday_multiplier: number;
  night_multiplier: number;
  overtime_multiplier: number;
  pennylane_api_key: string | null;
  pennylane_company_id: string | null;
  google_maps_api_key: string | null;
  vapid_public_key: string | null;
  vapid_private_key: string | null;
  created_at: string;
  updated_at: string;
}

// ---- Clients ----

export interface Client {
  id: string;
  agency_id: string;
  name: string;
  legal_name: string | null;
  siret: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string;
  phone: string | null;
  email: string | null;
  billing_email: string | null;
  logo_url: string | null;
  notes: string | null;
  is_active: boolean;
  pennylane_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientContact {
  id: string;
  client_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

// ---- Sites ----

export interface Site {
  id: string;
  client_id: string;
  agency_id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  lat: number | null;
  lng: number | null;
  perimeter_radius: number;
  color: string;
  instructions: string | null;
  access_info: string | null;
  emergency_contacts: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  client?: Client;
}

// ---- Collaborators ----

export interface Collaborator {
  id: string;
  profile_id: string;
  agency_id: string;
  matricule: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  date_of_birth: string | null;
  place_of_birth: string | null;
  nationality: string | null;
  social_security_number: string | null;
  cnaps_number: string | null;
  cnaps_expiry: string | null;
  has_license: boolean;
  license_type: string | null;
  contract_type: string | null;
  contract_start: string | null;
  contract_end: string | null;
  hourly_rate: number | null;
  monthly_salary: number | null;
  coefficient: number | null;
  qualification: string | null;
  rating: number;
  avatar_url: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  notes: string | null;
  status: CollaboratorStatus;
  created_at: string;
  updated_at: string;
  // Joined fields
  profile?: Profile;
}

// ---- Services / Prestations ----

export interface PrestaType {
  id: string;
  agency_id: string;
  name: string;
  category: PrestaCategory;
  description: string | null;
  default_hourly_rate: number | null;
  color: string;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  agency_id: string;
  site_id: string;
  presta_type_id: string | null;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string;
  recurrence_rule: string | null;
  recurrence_end: string | null;
  parent_service_id: string | null;
  status: ServiceStatus;
  min_agents: number;
  max_agents: number;
  notes: string | null;
  color: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  site?: Site;
  presta_type?: PrestaType;
  assignments?: ServiceAssignment[];
}

export interface ServiceAssignment {
  id: string;
  service_id: string;
  collaborator_id: string;
  assigned_by: string;
  assigned_at: string;
  confirmed_at: string | null;
  is_confirmed: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  service?: Service;
  collaborator?: Collaborator;
}

// ---- Time Tracking ----

export interface ServiceSession {
  id: string;
  service_id: string;
  collaborator_id: string;
  clock_in: string | null;
  clock_in_lat: number | null;
  clock_in_lng: number | null;
  clock_in_accuracy: number | null;
  clock_in_within_perimeter: boolean | null;
  clock_out: string | null;
  clock_out_lat: number | null;
  clock_out_lng: number | null;
  clock_out_accuracy: number | null;
  clock_out_within_perimeter: boolean | null;
  break_duration_minutes: number;
  total_hours: number | null;
  overtime_hours: number | null;
  night_hours: number | null;
  sunday_holiday_hours: number | null;
  manual_adjustment: number | null;
  adjustment_reason: string | null;
  adjusted_by: string | null;
  validated: boolean;
  validated_by: string | null;
  validated_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  service?: Service;
  collaborator?: Collaborator;
}

// ---- Main Courante ----

export interface MainCouranteEvent {
  id: string;
  service_id: string;
  collaborator_id: string;
  event_type: MainCouranteEventType;
  timestamp: string;
  title: string;
  description: string | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  photos: string[];
  persons_involved: string | null;
  actions_taken: string | null;
  follow_up_required: boolean;
  follow_up_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  service?: Service;
  collaborator?: Collaborator;
}

// ---- Intervention Form ----

export interface InterventionForm {
  id: string;
  service_id: string;
  collaborator_id: string;
  site_id: string;
  intervention_date: string;
  intervention_time: string;
  priority: InterventionPriority;
  category: string;
  title: string;
  description: string;
  location_detail: string | null;
  persons_involved: string | null;
  witnesses: string | null;
  actions_taken: string;
  equipment_used: string | null;
  authorities_notified: boolean;
  authority_details: string | null;
  injuries: boolean;
  injury_details: string | null;
  property_damage: boolean;
  damage_details: string | null;
  photos: string[];
  signature_agent: string | null;
  signature_client: string | null;
  follow_up_required: boolean;
  follow_up_notes: string | null;
  status: 'draft' | 'submitted' | 'reviewed' | 'closed';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  service?: Service;
  collaborator?: Collaborator;
  site?: Site;
}

// ---- GPS Logs ----

export interface GpsLog {
  id: string;
  collaborator_id: string;
  service_id: string | null;
  lat: number;
  lng: number;
  accuracy: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  timestamp: string;
  created_at: string;
}

// ---- Notifications ----

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  url: string | null;
  read: boolean;
  read_at: string | null;
  created_at: string;
}

// ---- Unavailability & Leave ----

export interface Unavailability {
  id: string;
  collaborator_id: string;
  type: UnavailabilityType;
  start_date: string;
  end_date: string;
  start_time: string | null;
  end_time: string | null;
  all_day: boolean;
  reason: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  collaborator?: Collaborator;
}

export interface LeaveRequest {
  id: string;
  collaborator_id: string;
  type: UnavailabilityType;
  start_date: string;
  end_date: string;
  reason: string | null;
  attachment_url: string | null;
  status: LeaveStatus;
  requested_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  collaborator?: Collaborator;
}

// ---- Stock ----

export interface StockReference {
  id: string;
  agency_id: string;
  name: string;
  description: string | null;
  category: string | null;
  sku: string | null;
  unit: string;
  quantity: number;
  min_quantity: number;
  location: string | null;
  supplier: string | null;
  unit_price: number | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockAction {
  id: string;
  stock_reference_id: string;
  action_type: StockActionType;
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reason: string | null;
  collaborator_id: string | null;
  site_id: string | null;
  performed_by: string;
  created_at: string;
  // Joined fields
  stock_reference?: StockReference;
  collaborator?: Collaborator;
  site?: Site;
}

// ---- Documents ----

export interface Document {
  id: string;
  agency_id: string;
  entity_type: 'collaborator' | 'client' | 'site' | 'agency';
  entity_id: string;
  category: DocumentCategory;
  name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  expiry_date: string | null;
  uploaded_by: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ---- Monthly Closure ----

export interface MonthlyClosureLine {
  id: string;
  agency_id: string;
  collaborator_id: string;
  month: string; // YYYY-MM
  total_planned_hours: number;
  total_actual_hours: number;
  total_overtime_hours: number;
  total_night_hours: number;
  total_sunday_holiday_hours: number;
  total_leave_days: number;
  total_sick_days: number;
  gross_amount: number | null;
  overtime_amount: number | null;
  night_bonus: number | null;
  sunday_holiday_bonus: number | null;
  validated: boolean;
  validated_by: string | null;
  validated_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  collaborator?: Collaborator;
}

// ---- Messages ----

export interface Message {
  id: string;
  agency_id: string;
  sender_id: string;
  recipient_id: string | null;
  channel: string | null;
  subject: string | null;
  body: string;
  attachments: string[];
  read: boolean;
  read_at: string | null;
  parent_message_id: string | null;
  created_at: string;
  // Joined fields
  sender?: Profile;
  recipient?: Profile;
}

// ---- Announcements ----

export interface Announcement {
  id: string;
  agency_id: string;
  author_id: string;
  title: string;
  body: string;
  target_roles: UserRole[];
  target_collaborator_ids: string[] | null;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  published_at: string | null;
  expires_at: string | null;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: Profile;
}

// ---- Quotes & Invoices ----

export interface QuoteLine {
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  vat_rate: number;
  total: number;
}

export interface Quote {
  id: string;
  agency_id: string;
  client_id: string;
  reference: string;
  title: string;
  description: string | null;
  lines: QuoteLine[];
  subtotal: number;
  vat_amount: number;
  total: number;
  discount: number | null;
  discount_type: 'percent' | 'amount' | null;
  validity_days: number;
  status: QuoteStatus;
  sent_at: string | null;
  accepted_at: string | null;
  notes: string | null;
  terms: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  client?: Client;
}

export interface InvoiceLine {
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  vat_rate: number;
  total: number;
}

export interface Invoice {
  id: string;
  agency_id: string;
  client_id: string;
  quote_id: string | null;
  reference: string;
  title: string;
  description: string | null;
  lines: InvoiceLine[];
  subtotal: number;
  vat_amount: number;
  total: number;
  discount: number | null;
  discount_type: 'percent' | 'amount' | null;
  due_date: string;
  status: InvoiceStatus;
  sent_at: string | null;
  paid_at: string | null;
  payment_method: string | null;
  pennylane_invoice_id: string | null;
  notes: string | null;
  terms: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  client?: Client;
  quote?: Quote;
}

// ---- Utility Types ----

export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface SelectOption {
  value: string;
  label: string;
}
