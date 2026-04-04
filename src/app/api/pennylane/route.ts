import { NextRequest, NextResponse } from 'next/server';

const PENNYLANE_API_URL = process.env.PENNYLANE_API_URL || 'https://app.pennylane.com/api/external/v1';
const PENNYLANE_API_KEY = process.env.PENNYLANE_API_KEY;

async function pennylaneFetch(endpoint: string, options: RequestInit = {}) {
  if (!PENNYLANE_API_KEY) {
    throw new Error('PENNYLANE_API_KEY non configurée');
  }

  const response = await fetch(`${PENNYLANE_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${PENNYLANE_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`PennyLane API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Test connection
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (action === 'test') {
      if (!PENNYLANE_API_KEY) {
        return NextResponse.json({ connected: false, error: 'Clé API non configurée' });
      }
      // Test the connection
      const result = await pennylaneFetch('/company');
      return NextResponse.json({ connected: true, company: result });
    }

    if (action === 'customers') {
      const customers = await pennylaneFetch('/customers');
      return NextResponse.json(customers);
    }

    if (action === 'invoices') {
      const invoices = await pennylaneFetch('/customer_invoices');
      return NextResponse.json(invoices);
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur PennyLane' },
      { status: 500 }
    );
  }
}

// Create invoice / sync customers
export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    if (action === 'create_draft_invoice') {
      // Create a draft invoice in PennyLane
      const invoice = await pennylaneFetch('/customer_invoices', {
        method: 'POST',
        body: JSON.stringify({
          create_customer: false,
          create_products: false,
          invoice: {
            date: data.date,
            deadline: data.deadline,
            customer_id: data.pennylane_customer_id,
            draft: true,
            currency: 'EUR',
            line_items: data.lines.map((line: { description: string; quantity: number; unit_price: number }) => ({
              label: line.description,
              quantity: line.quantity,
              unit: 'hour',
              vat_rate: 'FR_200',
              unit_price: line.unit_price,
              currency_amount: line.quantity * line.unit_price,
            })),
          },
        }),
      });

      return NextResponse.json({ success: true, invoice });
    }

    if (action === 'sync_customer') {
      // Create or update customer in PennyLane
      const customer = await pennylaneFetch('/customers', {
        method: 'POST',
        body: JSON.stringify({
          customer: {
            name: data.name,
            reg_no: data.siret,
            emails: data.email ? [data.email] : [],
            address: data.address,
            postal_code: data.postal_code,
            city: data.city,
            country_alpha2: 'FR',
          },
        }),
      });

      return NextResponse.json({ success: true, customer });
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur PennyLane' },
      { status: 500 }
    );
  }
}
