import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { subscription, userId } = await request.json();

    if (!subscription || !userId) {
      return NextResponse.json({ error: 'Subscription et userId requis' }, { status: 400 });
    }

    // Store subscription in Supabase
    // const supabase = createAdminClient();
    // await supabase.from('push_subscriptions').upsert({
    //   user_id: userId,
    //   endpoint: subscription.endpoint,
    //   keys: subscription.keys,
    // });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
