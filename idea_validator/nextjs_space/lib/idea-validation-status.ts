import { prisma } from "./prisma";

/** Core 48-hour validation trio — all three required for status `completed`. */
export const CORE_VALIDATION_FIELDS = [
  "surveyData",
  "competitorData",
  "marketData",
] as const;

const CORE_FIELD_SET = new Set<string>(CORE_VALIDATION_FIELDS);

export function isCoreValidationField(fieldName: string): boolean {
  return CORE_FIELD_SET.has(fieldName);
}

/** Call when the user starts a core analysis (pending → in_progress). */
export async function markValidationStarted(ideaId: string): Promise<void> {
  await prisma.idea.updateMany({
    where: { id: ideaId, status: "pending" },
    data: { status: "in_progress" },
  });
}

/** Recompute idea status from validation report core fields. */
export async function refreshIdeaValidationStatus(ideaId: string): Promise<void> {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    include: { validationReport: true },
  });
  if (!idea) return;

  const report = idea.validationReport;
  const hasCore = (field: (typeof CORE_VALIDATION_FIELDS)[number]) => {
    if (!report) return false;
    const value = report[field];
    return value != null;
  };

  const allCoreDone = CORE_VALIDATION_FIELDS.every(hasCore);
  const anyCoreDone = CORE_VALIDATION_FIELDS.some(hasCore);

  let nextStatus: string;
  if (allCoreDone) {
    nextStatus = "completed";
  } else if (anyCoreDone) {
    nextStatus = "in_progress";
  } else {
    nextStatus = "pending";
  }

  if (idea.status !== nextStatus) {
    await prisma.idea.update({
      where: { id: ideaId },
      data: { status: nextStatus },
    });
  }
}
