import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function esc(s: string | undefined | null): string {
  if (!s) return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildReportHTML(idea: any, report: any): string {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const created = new Date(idea.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let sections = '';

  // --- VALIDATION SCORE ---
  if (report.validationScoreData) {
    const d = report.validationScoreData;
    const score = d.score ?? 0;
    const gradeColor = score >= 80 ? '#059669' : score >= 60 ? '#2563EB' : score >= 40 ? '#D97706' : '#DC2626';
    sections += `
    <div class="section">
      <h2>Validation Score</h2>
      <div style="display:flex;align-items:center;gap:32px;margin-bottom:16px;">
        <div style="text-align:center;">
          <div style="font-size:56px;font-weight:800;color:${gradeColor};">${score}</div>
          <div style="font-size:12px;color:#6B7280;">out of 100</div>
          ${d.grade ? `<div style="display:inline-block;padding:4px 12px;background:${gradeColor};color:#fff;border-radius:8px;font-weight:700;margin-top:8px;">${esc(d.grade)}</div>` : ''}
        </div>
        <div style="flex:1;">
          ${d.summary ? `<p style="font-size:14px;color:#374151;margin-bottom:8px;">${esc(d.summary)}</p>` : ''}
          ${d.verdict ? `<div class="callout" style="border-left:4px solid ${gradeColor};"><strong>Verdict:</strong> ${esc(d.verdict)}</div>` : ''}
        </div>
      </div>
      ${d.dimensions?.length ? `
      <h3>Score Breakdown</h3>
      <table class="data-table">
        <tr><th>Dimension</th><th>Score</th><th>Reasoning</th></tr>
        ${d.dimensions.map((dim: any) => `<tr><td style="font-weight:600;">${esc(dim.name)}</td><td style="text-align:center;font-weight:700;">${dim.score}/100</td><td style="font-size:12px;color:#6B7280;">${esc(dim.reasoning)}</td></tr>`).join('')}
      </table>` : ''}
      <div style="display:flex;gap:16px;margin-top:16px;">
        ${d.topStrengths?.length ? `<div style="flex:1;padding:12px;background:#ECFDF5;border-radius:8px;"><h4 style="color:#065F46;margin:0 0 8px;">Top Strengths</h4><ul style="margin:0;padding-left:16px;">${d.topStrengths.map((s: string) => `<li style="font-size:12px;color:#065F46;margin-bottom:4px;">${esc(s)}</li>`).join('')}</ul></div>` : ''}
        ${d.topConcerns?.length ? `<div style="flex:1;padding:12px;background:#FFFBEB;border-radius:8px;"><h4 style="color:#92400E;margin:0 0 8px;">Top Concerns</h4><ul style="margin:0;padding-left:16px;">${d.topConcerns.map((c: string) => `<li style="font-size:12px;color:#92400E;margin-bottom:4px;">${esc(c)}</li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  }

  // --- SURVEY ---
  if (report.surveyData) {
    const d = report.surveyData;
    sections += `
    <div class="section">
      <h2>Validation Survey</h2>
      ${d.questions?.map((q: any, i: number) => `
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:start;">
            <strong>Q${i + 1}: ${esc(q.question)}</strong>
            <span class="badge">${esc(q.type)}</span>
          </div>
          ${q.options?.length ? `<div style="margin-top:8px;">${q.options.map((o: string) => `<div style="font-size:12px;padding:2px 0;">○ ${esc(o)}</div>`).join('')}</div>` : ''}
          ${q.insight ? `<div class="insight">💡 ${esc(q.insight)}</div>` : ''}
        </div>
      `).join('') || ''}
    </div>`;
  }

  // --- COMPETITORS ---
  if (report.competitorData) {
    const d = report.competitorData;
    sections += `
    <div class="section">
      <h2>Competitor Analysis</h2>
      ${d.competitors?.map((c: any) => `
        <div class="card">
          <h3 style="margin:0 0 4px;">${esc(c.name)}</h3>
          ${c.description ? `<p style="font-size:12px;color:#6B7280;margin:0 0 8px;">${esc(c.description)}</p>` : ''}
          ${c.positioning ? `<p style="font-size:12px;"><strong>Positioning:</strong> ${esc(c.positioning)}</p>` : ''}
          <div style="display:flex;gap:12px;margin-top:8px;">
            ${c.strengths?.length ? `<div style="flex:1;"><span style="font-size:11px;font-weight:600;color:#065F46;">Strengths</span><ul style="margin:4px 0 0;padding-left:14px;">${c.strengths.map((s: string) => `<li style="font-size:11px;color:#065F46;">${esc(s)}</li>`).join('')}</ul></div>` : ''}
            ${c.weaknesses?.length ? `<div style="flex:1;"><span style="font-size:11px;font-weight:600;color:#991B1B;">Weaknesses</span><ul style="margin:4px 0 0;padding-left:14px;">${c.weaknesses.map((w: string) => `<li style="font-size:11px;color:#991B1B;">${esc(w)}</li>`).join('')}</ul></div>` : ''}
          </div>
        </div>
      `).join('') || ''}
      ${d.competitiveAdvantages?.length ? `<div class="callout" style="border-left:4px solid #059669;"><strong style="color:#065F46;">Your Competitive Advantages</strong><ul style="margin:8px 0 0;padding-left:16px;">${d.competitiveAdvantages.map((a: string) => `<li style="font-size:12px;color:#065F46;">${esc(a)}</li>`).join('')}</ul></div>` : ''}
    </div>`;
  }

  // --- MARKET SIZING ---
  if (report.marketData) {
    const d = report.marketData;
    const fmt = (v: any) => { if (typeof v === 'string') return v; const n = Number(v); if (isNaN(n)) return '$0'; if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`; if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`; if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`; return `$${n}`; };
    sections += `
    <div class="section">
      <h2>Market Sizing</h2>
      <div style="display:flex;gap:12px;margin-bottom:16px;">
        <div class="metric-box" style="border-color:#059669;"><div class="metric-label">TAM</div><div class="metric-value" style="color:#059669;">${fmt(d.tam) || esc(d.tamLabel) || 'N/A'}</div></div>
        <div class="metric-box" style="border-color:#2563EB;"><div class="metric-label">SAM</div><div class="metric-value" style="color:#2563EB;">${fmt(d.sam) || esc(d.samLabel) || 'N/A'}</div></div>
        <div class="metric-box" style="border-color:#7C3AED;"><div class="metric-label">SOM</div><div class="metric-value" style="color:#7C3AED;">${fmt(d.som) || esc(d.somLabel) || 'N/A'}</div></div>
        <div class="metric-box" style="border-color:#D97706;"><div class="metric-label">Growth</div><div class="metric-value" style="color:#D97706;">${esc(String(d.growth || d.growthLabel || 'N/A'))}</div></div>
      </div>
      ${d.insights?.length ? `<div class="callout" style="border-left:4px solid #2563EB;"><strong>Key Market Insights</strong><ul style="margin:8px 0 0;padding-left:16px;">${d.insights.map((ins: string) => `<li style="font-size:12px;">${esc(ins)}</li>`).join('')}</ul></div>` : ''}
    </div>`;
  }

  // --- SWOT ---
  if (report.swotData) {
    const d = report.swotData;
    const quads = [
      { key: 'strengths', label: 'Strengths', color: '#059669', bg: '#ECFDF5' },
      { key: 'weaknesses', label: 'Weaknesses', color: '#DC2626', bg: '#FEF2F2' },
      { key: 'opportunities', label: 'Opportunities', color: '#2563EB', bg: '#EFF6FF' },
      { key: 'threats', label: 'Threats', color: '#D97706', bg: '#FFFBEB' },
    ];
    sections += `
    <div class="section">
      <h2>SWOT Analysis</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        ${quads.map(q => `<div style="padding:14px;background:${q.bg};border-radius:8px;">
          <h4 style="color:${q.color};margin:0 0 8px;">${q.label}</h4>
          ${(d[q.key] || []).map((item: any) => `<div style="margin-bottom:6px;"><strong style="font-size:12px;color:${q.color};">${esc(item.title)}</strong><p style="font-size:11px;color:#6B7280;margin:2px 0 0;">${esc(item.description)}</p></div>`).join('')}
        </div>`).join('')}
      </div>
      ${d.strategicInsight ? `<div class="callout" style="margin-top:12px;"><strong>Strategic Insight:</strong> ${esc(d.strategicInsight)}</div>` : ''}
    </div>`;
  }

  // --- PRICING STRATEGY ---
  if (report.pricingStrategyData) {
    const d = report.pricingStrategyData;
    sections += `
    <div class="section">
      <h2>Pricing Strategy</h2>
      ${d.recommendedModel ? `<div class="callout" style="border-left:4px solid #059669;"><strong>Recommended Model:</strong> <span style="text-transform:capitalize;font-weight:700;color:#059669;">${esc(d.recommendedModel)}</span><br/><span style="font-size:12px;color:#6B7280;">${esc(d.modelReasoning)}</span></div>` : ''}
      ${d.tiers?.length ? `
      <div style="display:flex;gap:12px;margin:16px 0;">
        ${d.tiers.map((t: any, i: number) => `<div style="flex:1;padding:16px;border:${i === 1 ? '2px solid #059669' : '1px solid #E5E7EB'};border-radius:8px;${i === 1 ? 'background:#F0FDF4;' : ''}">
          <h4 style="margin:0;">${esc(t.name)}</h4>
          <div style="font-size:24px;font-weight:800;margin:8px 0;">${esc(t.price)}</div>
          <div style="font-size:11px;color:#6B7280;margin-bottom:8px;">${esc(t.target)}</div>
          ${t.features?.map((f: string) => `<div style="font-size:11px;padding:2px 0;">• ${esc(f)}</div>`).join('') || ''}
        </div>`).join('')}
      </div>` : ''}
      ${d.revenueProjection ? `<div style="display:flex;gap:12px;margin-bottom:12px;">
        ${['year1','year2','year3'].map((yr, i) => `<div style="flex:1;text-align:center;padding:12px;background:#F9FAFB;border-radius:8px;border:1px solid #E5E7EB;"><div style="font-size:11px;color:#6B7280;">Year ${i+1}</div><div style="font-size:20px;font-weight:800;">${esc(d.revenueProjection[yr])}</div></div>`).join('')}
      </div>` : ''}
      ${d.keyInsights?.length ? `<ul style="padding-left:16px;">${d.keyInsights.map((k: string) => `<li style="font-size:12px;margin-bottom:4px;">${esc(k)}</li>`).join('')}</ul>` : ''}
    </div>`;
  }

  // --- GTM PLAN ---
  if (report.gtmPlanData) {
    const d = report.gtmPlanData;
    const phaseColors = ['#2563EB', '#7C3AED', '#059669'];
    sections += `
    <div class="section">
      <h2>Go-To-Market Plan</h2>
      ${d.phases?.map((p: any, pi: number) => `
        <div style="padding:14px;background:${pi === 0 ? '#EFF6FF' : pi === 1 ? '#F5F3FF' : '#ECFDF5'};border-radius:8px;margin-bottom:12px;">
          <h3 style="color:${phaseColors[pi]};margin:0 0 4px;font-size:15px;">${esc(p.name)}</h3>
          <p style="font-size:12px;color:#6B7280;margin:0 0 8px;">🎯 ${esc(p.goal)}</p>
          ${p.tasks?.map((t: any) => `<div style="font-size:12px;padding:4px 0;display:flex;justify-content:space-between;"><span>${esc(t.task)}</span><span class="badge">${esc(t.priority)}</span></div>`).join('') || ''}
          <p style="font-size:12px;font-weight:600;margin:8px 0 0;">📌 Milestone: ${esc(p.milestone)}</p>
        </div>
      `).join('') || ''}
      ${d.first100Customers ? `<div class="callout" style="border-left:4px solid #EA580C;"><strong>First 100 Customers:</strong> ${esc(d.first100Customers)}</div>` : ''}
    </div>`;
  }

  // --- MVP FEATURES ---
  if (report.mvpFeaturesData) {
    const d = report.mvpFeaturesData;
    sections += `
    <div class="section">
      <h2>MVP Features</h2>
      ${d.mvpVision ? `<p style="font-weight:600;font-size:14px;">${esc(d.mvpVision)}</p>` : ''}
      ${d.coreProblem ? `<p style="font-size:12px;color:#6B7280;">Core Problem: ${esc(d.coreProblem)}</p>` : ''}
      ${d.mustHave?.length ? `<h3>Must-Have Features</h3>
      <table class="data-table">
        <tr><th>Feature</th><th>Effort</th><th>Impact</th><th>Why</th></tr>
        ${d.mustHave.map((f: any) => `<tr><td><strong>${esc(f.feature)}</strong><br/><span style="font-size:11px;color:#6B7280;">${esc(f.description)}</span></td><td class="badge-cell"><span class="badge">${esc(f.effort)}</span></td><td class="badge-cell"><span class="badge">${esc(f.impact)}</span></td><td style="font-size:11px;">${esc(f.reasoning)}</td></tr>`).join('')}
      </table>` : ''}
      ${d.niceToHave?.length ? `<h3>Nice-To-Have (Post-MVP)</h3>
      <table class="data-table">
        <tr><th>Feature</th><th>Phase</th></tr>
        ${d.niceToHave.map((f: any) => `<tr><td><strong>${esc(f.feature)}</strong> — <span style="font-size:11px;color:#6B7280;">${esc(f.description)}</span></td><td><span class="badge">${esc(f.phase)}</span></td></tr>`).join('')}
      </table>` : ''}
      ${d.estimatedTimeline ? `<p style="font-size:12px;"><strong>Timeline:</strong> ${esc(d.estimatedTimeline)}</p>` : ''}
    </div>`;
  }

  // --- CUSTOMER PERSONAS ---
  if (report.personasData) {
    const d = report.personasData;
    sections += `
    <div class="section">
      <h2>Customer Personas</h2>
      ${d.personas?.map((p: any) => `
        <div class="card">
          <h3 style="margin:0 0 4px;">${esc(p.name)}</h3>
          <div style="font-size:11px;color:#6B7280;margin-bottom:8px;">${[p.occupation, p.age, p.location, p.income].filter(Boolean).map(esc).join(' • ')}</div>
          ${p.bio ? `<p style="font-size:12px;color:#6B7280;">${esc(p.bio)}</p>` : ''}
          ${p.quote ? `<blockquote style="border-left:3px solid #EC4899;padding-left:12px;font-style:italic;font-size:12px;color:#6B7280;margin:8px 0;">"${esc(p.quote)}"</blockquote>` : ''}
          <div style="display:flex;gap:12px;">
            ${p.goals?.length ? `<div style="flex:1;"><strong style="font-size:11px;color:#059669;">Goals</strong>${p.goals.map((g: string) => `<div style="font-size:11px;">${esc(g)}</div>`).join('')}</div>` : ''}
            ${p.painPoints?.length ? `<div style="flex:1;"><strong style="font-size:11px;color:#DC2626;">Pain Points</strong>${p.painPoints.map((pp: string) => `<div style="font-size:11px;">${esc(pp)}</div>`).join('')}</div>` : ''}
            ${p.channels?.length ? `<div style="flex:1;"><strong style="font-size:11px;color:#2563EB;">Channels</strong>${p.channels.map((ch: string) => `<div style="font-size:11px;">${esc(ch)}</div>`).join('')}</div>` : ''}
          </div>
        </div>
      `).join('') || ''}
      ${d.acquisitionStrategy ? `<div class="callout" style="border-left:4px solid #EC4899;"><strong>Acquisition Strategy:</strong> ${esc(d.acquisitionStrategy)}</div>` : ''}
    </div>`;
  }

  // --- BUSINESS MODEL CANVAS ---
  if (report.businessCanvasData) {
    const d = report.businessCanvasData;
    const blocks = [
      { key: 'keyPartners', label: 'Key Partners' }, { key: 'keyActivities', label: 'Key Activities' },
      { key: 'valuePropositions', label: 'Value Props' }, { key: 'customerRelationships', label: 'Customer Relationships' },
      { key: 'customerSegments', label: 'Customer Segments' }, { key: 'keyResources', label: 'Key Resources' },
      { key: 'channels', label: 'Channels' }, { key: 'costStructure', label: 'Cost Structure' },
      { key: 'revenueStreams', label: 'Revenue Streams' },
    ];
    sections += `
    <div class="section">
      <h2>Business Model Canvas</h2>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
        ${blocks.map(b => {
          const block = d.blocks?.[b.key];
          return `<div style="padding:10px;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;"><strong style="font-size:11px;color:#4B5563;">${b.label}</strong>${block?.items?.map((item: string) => `<div style="font-size:10px;margin-top:3px;">• ${esc(item)}</div>`).join('') || '<div style="font-size:10px;color:#9CA3AF;">—</div>'}</div>`;
        }).join('')}
      </div>
      ${d.summary ? `<div class="callout" style="margin-top:12px;"><strong>Summary:</strong> ${esc(d.summary)}</div>` : ''}
    </div>`;
  }

  // --- RISK ASSESSMENT ---
  if (report.riskAssessmentData) {
    const d = report.riskAssessmentData;
    const riskScore = d.riskScore ?? 0;
    const riskColor = riskScore <= 30 ? '#059669' : riskScore <= 60 ? '#D97706' : '#DC2626';
    sections += `
    <div class="section">
      <h2>Risk Assessment</h2>
      <div style="display:flex;align-items:center;gap:24px;margin-bottom:16px;">
        <div style="text-align:center;"><div style="font-size:40px;font-weight:800;color:${riskColor};">${riskScore}</div><div style="font-size:11px;color:#6B7280;">Risk Score</div></div>
        ${d.overallRiskLevel ? `<span class="badge" style="background:${riskColor};color:#fff;text-transform:capitalize;">${esc(d.overallRiskLevel)}</span>` : ''}
      </div>
      ${d.categories?.map((cat: any) => `
        <div class="card">
          <h4 style="margin:0 0 8px;">${esc(cat.category)} <span class="badge">${esc(cat.level)}</span></h4>
          ${cat.risks?.map((r: any) => `<div style="margin-bottom:8px;padding:8px;background:#F9FAFB;border-radius:6px;">
            <div style="font-size:12px;font-weight:600;">${esc(r.risk)}</div>
            <div style="font-size:11px;color:#6B7280;">Impact: ${esc(r.impact)} | Likelihood: ${esc(r.likelihood)}</div>
            <div style="font-size:11px;color:#059669;">🛡️ ${esc(r.mitigation)}</div>
          </div>`).join('') || ''}
        </div>
      `).join('') || ''}
      ${d.mitigationPlan ? `<div class="callout" style="border-left:4px solid #059669;"><strong>Overall Mitigation Strategy:</strong> ${esc(d.mitigationPlan)}</div>` : ''}
    </div>`;
  }

  // --- REFINEMENT SUGGESTIONS ---
  if (report.refinementData) {
    const d = report.refinementData;
    sections += `
    <div class="section">
      <h2>Idea Refinement Suggestions</h2>
      ${d.currentAssessment ? `<p style="font-size:12px;color:#6B7280;margin-bottom:12px;">${esc(d.currentAssessment)}</p>` : ''}
      ${d.suggestions?.map((s: any, i: number) => `
        <div class="card">
          <div style="margin-bottom:4px;"><span class="badge">${esc(s.type)}</span> <span class="badge">${esc(s.effort)} effort</span></div>
          <h4 style="margin:0 0 4px;">${esc(s.title)}</h4>
          <p style="font-size:12px;color:#6B7280;margin:0 0 8px;">${esc(s.description)}</p>
          <div style="font-size:11px;"><strong style="color:#059669;">Impact:</strong> ${esc(s.expectedImpact)}</div>
          <div style="font-size:11px;"><strong style="color:#2563EB;">Example:</strong> ${esc(s.example)}</div>
        </div>
      `).join('') || ''}
      ${d.recommendedNext ? `<div class="callout" style="border-left:4px solid #EAB308;"><strong>Recommended Next Step:</strong> ${esc(d.recommendedNext)}</div>` : ''}
    </div>`;
  }

  // --- ELEVATOR PITCHES ---
  if (report.elevatorPitchData) {
    const d = report.elevatorPitchData;
    sections += `
    <div class="section">
      <h2>Elevator Pitches</h2>
      ${d.pitches?.map((p: any) => `
        <div class="card">
          <div style="margin-bottom:4px;"><span class="badge">${esc(p.label)}</span></div>
          <p style="font-size:13px;line-height:1.6;margin:0;">${esc(p.pitch)}</p>
        </div>
      `).join('') || ''}
      ${d.tipsForDelivery?.length ? `<div class="callout"><strong>Delivery Tips</strong><ul style="margin:8px 0 0;padding-left:16px;">${d.tipsForDelivery.map((t: string) => `<li style="font-size:12px;">${esc(t)}</li>`).join('')}</ul></div>` : ''}
    </div>`;
  }

  // --- PITCH DECK ---
  if (report.pitchDeckData) {
    const d = report.pitchDeckData;
    sections += `
    <div class="section">
      <h2>Pitch Deck Outline</h2>
      <table class="data-table">
        <tr><th>Slide</th><th>Title</th><th>Content</th><th>Key Points</th></tr>
        ${d.slides?.map((s: any) => `<tr>
          <td style="text-align:center;font-weight:700;">${s.slideNumber}</td>
          <td style="font-weight:600;">${esc(s.title)}</td>
          <td style="font-size:11px;">${esc(s.content)}</td>
          <td style="font-size:11px;">${s.bulletPoints?.map((bp: string) => `• ${esc(bp)}`).join('<br/>') || '—'}</td>
        </tr>`).join('') || ''}
      </table>
    </div>`;
  }

  // No analyses generated
  if (!sections) {
    sections = '<div class="section"><p style="text-align:center;color:#9CA3AF;font-size:14px;">No analyses have been generated yet. Run validations on the idea page to populate this report.</p></div>';
  }

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',system-ui,sans-serif; color:#1F2937; line-height:1.5; }

  .cover { background:linear-gradient(135deg,#4F46E5,#7C3AED); color:#fff; padding:80px 60px; min-height:100vh; display:flex; flex-direction:column; justify-content:center; page-break-after:always; }
  .cover h1 { font-size:48px; font-weight:800; letter-spacing:-1.5px; margin-bottom:12px; }
  .cover .subtitle { font-size:20px; opacity:0.85; margin-bottom:40px; }
  .cover .meta { font-size:13px; opacity:0.7; }
  .cover .meta span { display:block; margin-bottom:4px; }

  .page-body { padding:40px 48px; }

  .section { margin-bottom:32px; page-break-inside:avoid; }
  .section h2 { font-size:22px; font-weight:800; color:#1F2937; letter-spacing:-0.5px; border-bottom:2px solid #E5E7EB; padding-bottom:8px; margin-bottom:16px; }
  .section h3 { font-size:15px; font-weight:700; color:#374151; margin:12px 0 8px; }

  .card { padding:14px; border:1px solid #E5E7EB; border-radius:8px; margin-bottom:10px; background:#FAFAFA; }

  .badge { display:inline-block; font-size:10px; font-weight:600; padding:2px 8px; border-radius:999px; background:#F3F4F6; color:#6B7280; text-transform:capitalize; }

  .callout { padding:12px 16px; background:#F9FAFB; border-left:4px solid #6366F1; border-radius:0 8px 8px 0; font-size:13px; margin:12px 0; }

  .insight { margin-top:8px; padding:6px 10px; background:#EFF6FF; border-left:3px solid #3B82F6; border-radius:0 6px 6px 0; font-size:11px; color:#1E40AF; }

  .data-table { width:100%; border-collapse:collapse; font-size:12px; margin:8px 0; }
  .data-table th { background:#F3F4F6; padding:8px 10px; text-align:left; font-weight:600; border-bottom:2px solid #E5E7EB; }
  .data-table td { padding:8px 10px; border-bottom:1px solid #F3F4F6; vertical-align:top; }
  .badge-cell { text-align:center; }

  .metric-box { flex:1; text-align:center; padding:14px; border:2px solid; border-radius:8px; }
  .metric-label { font-size:11px; font-weight:600; color:#6B7280; margin-bottom:4px; }
  .metric-value { font-size:22px; font-weight:800; }

  .footer { text-align:center; font-size:10px; color:#9CA3AF; padding:20px 0; border-top:1px solid #E5E7EB; margin-top:40px; }
</style>
</head><body>

  <div class="cover">
    <h1>${esc(idea.title)}</h1>
    <div class="subtitle">${esc(idea.description)}</div>
    <div class="meta">
      <span><strong>Category:</strong> ${esc(idea.category)}</span>
      <span><strong>Target Audience:</strong> ${esc(idea.targetAudience)}</span>
      <span><strong>Problem:</strong> ${esc(idea.problemStatement)}</span>
      <span><strong>Submitted:</strong> ${created}</span>
    </div>
    <div style="margin-top:auto;font-size:14px;opacity:0.6;">VentureVibe — Full Validation Report</div>
  </div>

  <div class="page-body">
    ${sections}
    <div class="footer">Generated by VentureVibe on ${date} — This report is AI-generated and should be used for informational purposes only.</div>
  </div>

</body></html>`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ideaId } = await request.json();
    if (!ideaId) return NextResponse.json({ error: "Missing ideaId" }, { status: 400 });

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: { validationReport: true },
    });
    if (!idea || idea.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const report = idea.validationReport || {};
    const html = buildReportHTML(idea, report);

    // Create PDF
    const createResponse = await fetch('https://apps.abacus.ai/api/createConvertHtmlToPdfRequest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        html_content: html,
        pdf_options: {
          format: 'A4',
          landscape: false,
          print_background: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        },
      }),
    });

    if (!createResponse.ok) {
      return NextResponse.json({ error: 'Failed to create PDF' }, { status: 500 });
    }

    const { request_id } = await createResponse.json();
    if (!request_id) {
      return NextResponse.json({ error: 'No request ID' }, { status: 500 });
    }

    // Poll
    let attempts = 0;
    while (attempts < 180) {
      await new Promise(r => setTimeout(r, 1000));
      const statusRes = await fetch('https://apps.abacus.ai/api/getConvertHtmlToPdfStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id, deployment_token: process.env.ABACUSAI_API_KEY }),
      });
      const statusResult = await statusRes.json();
      if (statusResult?.status === 'SUCCESS' && statusResult?.result?.result) {
        const pdfBuffer = Buffer.from(statusResult.result.result, 'base64');
        const filename = `${idea.title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_')}_Validation_Report.pdf`;
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
          },
        });
      }
      if (statusResult?.status === 'FAILED') {
        return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
      }
      attempts++;
    }

    return NextResponse.json({ error: 'PDF generation timed out' }, { status: 500 });
  } catch (error) {
    console.error('Report PDF error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
