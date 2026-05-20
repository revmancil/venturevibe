import type { LegalSection } from "@/lib/legal";

export function LegalSection({ section }: { section: LegalSection }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="font-display mb-4 text-xl font-semibold">{section.title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {section.paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
        {section.list && section.list.length > 0 && (
          <ul className="list-disc space-y-2 pl-5">
            {section.list.map((item) => (
              <li key={item.slice(0, 40)}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
