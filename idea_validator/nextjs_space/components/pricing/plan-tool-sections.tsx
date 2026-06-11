import { Check } from 'lucide-react';
import type { PlanKey } from '@/lib/plans';
import { getToolSectionsForPlan, TOOL_LABELS, TOOL_SECTION_LABELS } from '@/lib/tool-access';

type PlanToolSectionsProps = {
  planKey: PlanKey;
};

export function PlanToolSections({ planKey }: PlanToolSectionsProps) {
  const sections = getToolSectionsForPlan(planKey);

  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <div key={section.key}>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {TOOL_SECTION_LABELS[section.key]}
          </p>
          <ul className="space-y-2">
            {section.tools.map((slug) => (
              <li key={slug} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{TOOL_LABELS[slug]}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
