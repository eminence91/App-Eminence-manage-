const PENNYLANE_API_BASE = 'https://app.pennylane.com/api/external/v1';

interface PennyLaneCustomer {
  source_id: string;
  name: string;
  emails: string[];
  billing_address?: {
    address: string;
    city: string;
    postal_code: string;
    country_alpha2: string;
  };
  phone?: string;
  billing_iban?: string;
  customer_type?: 'company' | 'individual';
  [key: string]: unknown;
}

interface PennyLaneInvoiceLine {
  label: string;
  quantity: number;
  unit: string;
  unit_price_without_tax: number;
  vat_rate: number;
  description?: string;
}

interface PennyLaneInvoiceData {
  date: string; // YYYY-MM-DD
  deadline: string; // YYYY-MM-DD
  customer_source_id: string;
  line_items: PennyLaneInvoiceLine[];
  currency?: string;
  draft?: boolean;
  [key: string]: unknown;
}

interface PennyLaneResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

/**
 * PennyLane API client for invoicing and customer management.
 */
export class PennyLaneClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${PENNYLANE_API_BASE}${path}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
    };

    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `PennyLane API error ${response.status}: ${errorBody}`
      );
    }

    return response.json() as Promise<T>;
  }

  /**
   * Test the API connection by fetching the current company info.
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.request('GET', '/company');
      return true;
    } catch {
      return false;
    }
  }

  // ---- Customers ----

  /**
   * List all customers.
   */
  async getCustomers(
    page: number = 1,
    perPage: number = 50
  ): Promise<PennyLaneResponse<PennyLaneCustomer[]>> {
    return this.request(
      'GET',
      `/customers?page=${page}&per_page=${perPage}`
    );
  }

  /**
   * Create a new customer.
   */
  async createCustomer(
    customer: PennyLaneCustomer
  ): Promise<PennyLaneResponse<PennyLaneCustomer>> {
    return this.request('POST', '/customers', { customer });
  }

  /**
   * Update an existing customer.
   */
  async updateCustomer(
    sourceId: string,
    updates: Partial<PennyLaneCustomer>
  ): Promise<PennyLaneResponse<PennyLaneCustomer>> {
    return this.request('PUT', `/customers/${sourceId}`, {
      customer: updates,
    });
  }

  // ---- Invoices ----

  /**
   * Create a draft invoice.
   */
  async createDraftInvoice(
    data: PennyLaneInvoiceData
  ): Promise<PennyLaneResponse<{ id: string; [key: string]: unknown }>> {
    return this.request('POST', '/customer_invoices', {
      invoice: { ...data, draft: true, currency: data.currency ?? 'EUR' },
    });
  }

  /**
   * Get an invoice by its PennyLane ID.
   */
  async getInvoice(
    id: string
  ): Promise<PennyLaneResponse<{ id: string; [key: string]: unknown }>> {
    return this.request('GET', `/customer_invoices/${id}`);
  }

  /**
   * List invoices with optional filters.
   */
  async getInvoices(
    page: number = 1,
    perPage: number = 50
  ): Promise<
    PennyLaneResponse<Array<{ id: string; [key: string]: unknown }>>
  > {
    return this.request(
      'GET',
      `/customer_invoices?page=${page}&per_page=${perPage}`
    );
  }
}
