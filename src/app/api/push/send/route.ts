import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, title, body, url } = await request.json();

    if (!userId || !title) {
      return NextResponse.json({ error: 'userId et title requis' }, { status: 400 });
    }

    // Fetch user's push subscription from Supabase
    // const supabase = createAdminClient();
    // const { data: subscriptions } = await supabase
    //   .from('push_subscriptions')
    //   .select('*')
    //   .eq('user_id', userId);

    // Send push notification using web-push library
    // for (const sub of subscriptions) {
    //   await webpush.sendNotification(
    //     { endpoint: sub.endpoint, keys: sub.keys },
    //     JSON.stringify({ title, body, url })
    //   );
    // }

    // Also store in notifications table
    // await supabase.from('notifications').insert({
    //   user_id: userId,
    //   type: 'push',
    //   title,
    //   body,
    //   metadata: { url },
    // });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
