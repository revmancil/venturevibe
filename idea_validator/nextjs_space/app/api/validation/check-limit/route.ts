export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canUserValidate } from '@/lib/subscription';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await canUserValidate(session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Check limit error:', error);
    return NextResponse.json({ error: 'Failed to check limits' }, { status: 500 });
  }
}
