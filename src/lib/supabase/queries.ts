import { SupabaseClient } from '@supabase/supabase-js';
import type {
  Client,
  Site,
  Collaborator,
  Service,
  ServiceSession,
  MainCouranteEvent,
  GpsLog,
  Notification,
  LeaveRequest,
  AgencySettings,
  MonthlyClosureLine,
} from '@/types';

// ============================================================
// Clients
// ============================================================

export async function getClients(supabase: SupabaseClient): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw new Error(`Erreur lors du chargement des clients : ${error.message}`);
  return data ?? [];
}

export async function getClient(supabase: SupabaseClient, id: string): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Erreur lors du chargement du client : ${error.message}`);
  return data;
}

export async function createClient(
  supabase: SupabaseClient,
  clientData: Partial<Client>
): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert(clientData)
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la création du client : ${error.message}`);
  return data;
}

export async function updateClient(
  supabase: SupabaseClient,
  id: string,
  clientData: Partial<Client>
): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .update(clientData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la mise à jour du client : ${error.message}`);
  return data;
}

export async function deleteClient(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Erreur lors de la suppression du client : ${error.message}`);
}

// ============================================================
// Sites
// ============================================================

export async function getSites(supabase: SupabaseClient): Promise<Site[]> {
  const { data, error } = await supabase
    .from('sites')
    .select('*, client:clients(id, name)')
    .order('name', { ascending: true });

  if (error) throw new Error(`Erreur lors du chargement des sites : ${error.message}`);
  return data ?? [];
}

export async function getSite(supabase: SupabaseClient, id: string): Promise<Site> {
  const { data, error } = await supabase
    .from('sites')
    .select('*, client:clients(id, name, email, phone)')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Erreur lors du chargement du site : ${error.message}`);
  return data;
}

export async function createSite(
  supabase: SupabaseClient,
  siteData: Partial<Site>
): Promise<Site> {
  const { data, error } = await supabase
    .from('sites')
    .insert(siteData)
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la création du site : ${error.message}`);
  return data;
}

export async function updateSite(
  supabase: SupabaseClient,
  id: string,
  siteData: Partial<Site>
): Promise<Site> {
  const { data, error } = await supabase
    .from('sites')
    .update(siteData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la mise à jour du site : ${error.message}`);
  return data;
}

// ============================================================
// Collaborateurs
// ============================================================

export async function getCollaborators(supabase: SupabaseClient): Promise<Collaborator[]> {
  const { data, error } = await supabase
    .from('collaborators')
    .select('*')
    .order('last_name', { ascending: true });

  if (error) throw new Error(`Erreur lors du chargement des collaborateurs : ${error.message}`);
  return data ?? [];
}

export async function getCollaborator(supabase: SupabaseClient, id: string): Promise<Collaborator> {
  const { data, error } = await supabase
    .from('collaborators')
    .select('*, profile:profiles(*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Erreur lors du chargement du collaborateur : ${error.message}`);
  return data;
}

export async function createCollaborator(
  supabase: SupabaseClient,
  collabData: Partial<Collaborator>
): Promise<Collaborator> {
  const { data, error } = await supabase
    .from('collaborators')
    .insert(collabData)
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la création du collaborateur : ${error.message}`);
  return data;
}

export async function updateCollaborator(
  supabase: SupabaseClient,
  id: string,
  collabData: Partial<Collaborator>
): Promise<Collaborator> {
  const { data, error } = await supabase
    .from('collaborators')
    .update(collabData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la mise à jour du collaborateur : ${error.message}`);
  return data;
}

// ============================================================
// Services / Planning
// ============================================================

export interface ServiceFilters {
  date?: string;
  siteId?: string;
  collaboratorId?: string;
}

export async function getServices(
  supabase: SupabaseClient,
  filters: ServiceFilters = {}
): Promise<Service[]> {
  let query = supabase
    .from('services')
    .select(`
      *,
      site:sites(id, name, address, city, color),
      presta_type:presta_types(id, name, category, color),
      assignments:service_assignments(
        id,
        collaborator_id,
        is_confirmed,
        collaborator:collaborators(id, first_name, last_name, matricule)
      )
    `)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });

  if (filters.date) {
    query = query.eq('date', filters.date);
  }
  if (filters.siteId) {
    query = query.eq('site_id', filters.siteId);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Erreur lors du chargement des services : ${error.message}`);

  let results = data ?? [];

  // Filter by collaborator via assignments (post-query)
  if (filters.collaboratorId) {
    results = results.filter((s: Service) =>
      s.assignments?.some((a) => a.collaborator_id === filters.collaboratorId)
    );
  }

  return results;
}

export async function getService(supabase: SupabaseClient, id: string): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      site:sites(*, client:clients(id, name)),
      presta_type:presta_types(*),
      assignments:service_assignments(
        *,
        collaborator:collaborators(id, first_name, last_name, matricule, phone, avatar_url)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw new Error(`Erreur lors du chargement du service : ${error.message}`);
  return data;
}

export async function createService(
  supabase: SupabaseClient,
  serviceData: Partial<Service>
): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .insert(serviceData)
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la création du service : ${error.message}`);
  return data;
}

export async function assignCollaborator(
  supabase: SupabaseClient,
  serviceId: string,
  collaboratorId: string,
  positionTitle?: string
): Promise<void> {
  const { error } = await supabase
    .from('service_assignments')
    .insert({
      service_id: serviceId,
      collaborator_id: collaboratorId,
      notes: positionTitle ?? null,
    });

  if (error) throw new Error(`Erreur lors de l'affectation du collaborateur : ${error.message}`);
}

export async function unassignCollaborator(
  supabase: SupabaseClient,
  serviceId: string,
  collaboratorId: string
): Promise<void> {
  const { error } = await supabase
    .from('service_assignments')
    .delete()
    .eq('service_id', serviceId)
    .eq('collaborator_id', collaboratorId);

  if (error) throw new Error(`Erreur lors de la désaffectation du collaborateur : ${error.message}`);
}

// ============================================================
// Terrain (Sessions, Main Courante, GPS)
// ============================================================

export async function createServiceSession(
  supabase: SupabaseClient,
  sessionData: Partial<ServiceSession>
): Promise<ServiceSession> {
  const { data, error } = await supabase
    .from('service_sessions')
    .insert(sessionData)
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la création de la session : ${error.message}`);
  return data;
}

export async function updateServiceSession(
  supabase: SupabaseClient,
  id: string,
  sessionData: Partial<ServiceSession>
): Promise<ServiceSession> {
  const { data, error } = await supabase
    .from('service_sessions')
    .update(sessionData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la mise à jour de la session : ${error.message}`);
  return data;
}

export async function createMCEEvent(
  supabase: SupabaseClient,
  eventData: Partial<MainCouranteEvent>
): Promise<MainCouranteEvent> {
  const { data, error } = await supabase
    .from('main_courante_events')
    .insert(eventData)
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la création de l'événement main courante : ${error.message}`);
  return data;
}

export interface MCEFilters {
  serviceId?: string;
  collaboratorId?: string;
  eventType?: string;
}

export async function getMCEEvents(
  supabase: SupabaseClient,
  filters: MCEFilters = {}
): Promise<MainCouranteEvent[]> {
  let query = supabase
    .from('main_courante_events')
    .select(`
      *,
      collaborator:collaborators(id, first_name, last_name),
      service:services(id, title, site:sites(id, name))
    `)
    .order('timestamp', { ascending: false });

  if (filters.serviceId) query = query.eq('service_id', filters.serviceId);
  if (filters.collaboratorId) query = query.eq('collaborator_id', filters.collaboratorId);
  if (filters.eventType) query = query.eq('event_type', filters.eventType);

  const { data, error } = await query;
  if (error) throw new Error(`Erreur lors du chargement des événements main courante : ${error.message}`);
  return data ?? [];
}

export async function createGPSLog(
  supabase: SupabaseClient,
  logData: Partial<GpsLog>
): Promise<GpsLog> {
  const { data, error } = await supabase
    .from('gps_logs')
    .insert(logData)
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de l'enregistrement de la position GPS : ${error.message}`);
  return data;
}

// ============================================================
// Notifications
// ============================================================

export async function getNotifications(
  supabase: SupabaseClient,
  userId: string
): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Erreur lors du chargement des notifications : ${error.message}`);
  return data ?? [];
}

export async function markNotificationRead(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(`Erreur lors du marquage de la notification : ${error.message}`);
}

export async function createNotification(
  supabase: SupabaseClient,
  notifData: Partial<Notification>
): Promise<Notification> {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notifData)
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la création de la notification : ${error.message}`);
  return data;
}

// ============================================================
// Demandes de congés
// ============================================================

export interface LeaveRequestFilters {
  collaboratorId?: string;
  status?: string;
}

export async function getLeaveRequests(
  supabase: SupabaseClient,
  filters: LeaveRequestFilters = {}
): Promise<LeaveRequest[]> {
  let query = supabase
    .from('leave_requests')
    .select(`
      *,
      collaborator:collaborators(id, first_name, last_name, matricule)
    `)
    .order('created_at', { ascending: false });

  if (filters.collaboratorId) query = query.eq('collaborator_id', filters.collaboratorId);
  if (filters.status) query = query.eq('status', filters.status);

  const { data, error } = await query;
  if (error) throw new Error(`Erreur lors du chargement des demandes de congés : ${error.message}`);
  return data ?? [];
}

export async function createLeaveRequest(
  supabase: SupabaseClient,
  requestData: Partial<LeaveRequest>
): Promise<LeaveRequest> {
  const { data, error } = await supabase
    .from('leave_requests')
    .insert(requestData)
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la création de la demande de congé : ${error.message}`);
  return data;
}

export async function updateLeaveRequestStatus(
  supabase: SupabaseClient,
  id: string,
  status: string,
  comment?: string
): Promise<void> {
  const updateData: Record<string, unknown> = {
    status,
    reviewed_at: new Date().toISOString(),
  };
  if (comment) updateData.review_notes = comment;

  const { error } = await supabase
    .from('leave_requests')
    .update(updateData)
    .eq('id', id);

  if (error) throw new Error(`Erreur lors de la mise à jour de la demande de congé : ${error.message}`);
}

// ============================================================
// Dashboard Stats
// ============================================================

export interface DashboardStats {
  servicesCount: number;
  agentsOnDuty: number;
  agentsAbsent: number;
  unplannedServices: number;
  overtimeHours: string;
  pendingRequests: number;
}

export async function getDashboardStats(supabase: SupabaseClient): Promise<DashboardStats> {
  const today = new Date().toISOString().split('T')[0];

  // Run queries in parallel
  const [servicesRes, sessionsRes, leaveRes] = await Promise.all([
    supabase
      .from('services')
      .select('id, status, min_agents, assignments:service_assignments(id)', { count: 'exact' })
      .eq('date', today),
    supabase
      .from('service_sessions')
      .select('id, collaborator_id, clock_in, clock_out, overtime_hours')
      .gte('clock_in', `${today}T00:00:00`)
      .is('clock_out', null),
    supabase
      .from('leave_requests')
      .select('id', { count: 'exact' })
      .eq('status', 'pending'),
  ]);

  const services = servicesRes.data ?? [];
  const activeSessions = sessionsRes.data ?? [];
  const pendingRequests = leaveRes.count ?? 0;

  // Count services with fewer assignments than min_agents
  const unplannedServices = services.filter(
    (s) => (s.assignments?.length ?? 0) < s.min_agents
  ).length;

  // Sum overtime hours from today's sessions
  const { data: todaySessions } = await supabase
    .from('service_sessions')
    .select('overtime_hours')
    .gte('clock_in', `${today}T00:00:00`);

  const totalOvertime = (todaySessions ?? []).reduce(
    (sum, s) => sum + (s.overtime_hours ?? 0),
    0
  );

  return {
    servicesCount: servicesRes.count ?? services.length,
    agentsOnDuty: activeSessions.length,
    agentsAbsent: 0, // Would need absence tracking logic
    unplannedServices,
    overtimeHours: `${Math.round(totalOvertime)}h`,
    pendingRequests,
  };
}

// ============================================================
// Paramètres agence
// ============================================================

export async function getAgencySettings(supabase: SupabaseClient): Promise<AgencySettings> {
  const { data, error } = await supabase
    .from('agency_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) throw new Error(`Erreur lors du chargement des paramètres de l'agence : ${error.message}`);
  return data;
}

export async function updateAgencySettings(
  supabase: SupabaseClient,
  settingsData: Partial<AgencySettings>
): Promise<AgencySettings> {
  const { id, ...updateFields } = settingsData as AgencySettings;
  const { data, error } = await supabase
    .from('agency_settings')
    .update(updateFields)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Erreur lors de la mise à jour des paramètres : ${error.message}`);
  return data;
}

// ============================================================
// Clôture mensuelle
// ============================================================

export async function getClosureData(
  supabase: SupabaseClient,
  year: number,
  month: number
): Promise<MonthlyClosureLine[]> {
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('monthly_closure_lines')
    .select(`
      *,
      collaborator:collaborators(id, first_name, last_name, matricule, hourly_rate)
    `)
    .eq('month', monthStr)
    .order('collaborator_id', { ascending: true });

  if (error) throw new Error(`Erreur lors du chargement des données de clôture : ${error.message}`);
  return data ?? [];
}

export async function validateClosureLine(
  supabase: SupabaseClient,
  id: string,
  adjustedHours: number
): Promise<void> {
  const { error } = await supabase
    .from('monthly_closure_lines')
    .update({
      total_actual_hours: adjustedHours,
      validated: true,
      validated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(`Erreur lors de la validation de la ligne de clôture : ${error.message}`);
}

export async function sendToPennylane(
  supabase: SupabaseClient,
  closureId: string
): Promise<void> {
  // This would typically call an edge function / API route
  const { error } = await supabase.functions.invoke('send-to-pennylane', {
    body: { closureId },
  });

  if (error) throw new Error(`Erreur lors de l'envoi vers Pennylane : ${error.message}`);
}
