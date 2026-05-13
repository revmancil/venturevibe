export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const { secret } = await request.json().catch(() => ({ secret: '' }));
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all ideas with market signals data
    const reports = await prisma.validationReport.findMany({
      where: { NOT: { marketSignalsData: { equals: undefined } } },
      include: { idea: { include: { user: true } } },
    }) as Array<any>;

    if (reports.length === 0) {
      return NextResponse.json({ message: 'No ideas with market signals', sent: 0 });
    }

    // Group by user
    const userIdeas: Record<string, { email: string; name: string; ideas: Array<{ title: string; trendScore: number; overallTrend: string; summary: string }> }> = {};

    for (const report of reports) {
      const user = report.idea.user;
      if (!user?.email) continue;
      const signals = report.marketSignalsData as any;
      if (!signals) continue;

      if (!userIdeas[user.id]) {
        userIdeas[user.id] = { email: user.email, name: user.name || 'Founder', ideas: [] };
      }
      userIdeas[user.id].ideas.push({
        title: report.idea.title,
        trendScore: signals.trendScore || 0,
        overallTrend: signals.overallTrend || 'steady',
        summary: signals.summary || '',
      });
    }

    let sent = 0;
    const appUrl = process.env.NEXTAUTH_URL || '';
    const appName = appUrl ? new URL(appUrl).hostname.split('.')[0] : 'VentureVibe';

    for (const [userId, userData] of Object.entries(userIdeas)) {
      const ideaRows = userData.ideas.map(idea => {
        const trendEmoji = idea.overallTrend === 'heating-up' ? '\u{1F525}' : idea.overallTrend === 'cooling-down' ? '\u2744\uFE0F' : '\u27A1\uFE0F';
        const scoreColor = idea.trendScore >= 70 ? '#059669' : idea.trendScore >= 40 ? '#d97706' : '#dc2626';
        return `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
              <strong>${idea.title}</strong>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
              <span style="font-size: 20px;">${trendEmoji}</span>
              <span style="color: #6b7280; font-size: 12px; display: block;">${idea.overallTrend.replace('-', ' ')}</span>
            </td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
              <span style="font-weight: 700; color: ${scoreColor}; font-size: 18px;">${idea.trendScore}</span>
              <span style="color: #9ca3af; font-size: 11px;">/100</span>
            </td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 8px 12px 16px; color: #6b7280; font-size: 13px;">
              ${idea.summary}
            </td>
          </tr>`;
      }).join('');

      const htmlBody = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">\u{1F4CA} Weekly Market Signals</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Your weekly market intelligence digest</p>
          </div>
          <div style="padding: 24px;">
            <p style="color: #374151; font-size: 15px;">Hi ${userData.name},</p>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">Here's your weekly market signals summary for your ideas. Click "Refresh Signals" on any idea to get the latest deep analysis.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f9fafb;">
                  <th style="padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #6b7280;">Idea</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 12px; text-transform: uppercase; color: #6b7280;">Trend</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 12px; text-transform: uppercase; color: #6b7280;">Score</th>
                </tr>
              </thead>
              <tbody>${ideaRows}</tbody>
            </table>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${appUrl}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">View Dashboard \u2192</a>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">Tip: Refresh signals regularly to track how your markets evolve over time.</p>
          </div>
        </div>`;

      try {
        const emailRes = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deployment_token: process.env.ABACUSAI_API_KEY,
            app_id: process.env.WEB_APP_ID,
            notification_id: process.env.NOTIF_ID_WEEKLY_MARKET_SIGNALS_DIGEST,
            subject: `\u{1F4CA} Weekly Market Signals Digest \u2014 ${userData.ideas.length} idea${userData.ideas.length > 1 ? 's' : ''} tracked`,
            body: htmlBody,
            is_html: true,
            recipient_email: userData.email,
            sender_email: `noreply@${appUrl ? new URL(appUrl).hostname : 'ideavalidator.app'}`,
            sender_alias: appName,
          }),
        });
        const result = await emailRes.json();
        if (result.success || result.notification_disabled) sent++;
      } catch (e) {
        console.error(`Failed to send digest to ${userData.email}:`, e);
      }
    }

    return NextResponse.json({ message: 'Digest sent', sent, total: Object.keys(userIdeas).length });
  } catch (error) {
    console.error('Cron digest error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
