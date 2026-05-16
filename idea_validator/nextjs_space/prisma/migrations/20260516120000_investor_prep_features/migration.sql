-- AlterTable
ALTER TABLE "ValidationReport" ADD COLUMN IF NOT EXISTS "financialProjectionsData" JSONB;
ALTER TABLE "ValidationReport" ADD COLUMN IF NOT EXISTS "nameCheckerData" JSONB;
ALTER TABLE "ValidationReport" ADD COLUMN IF NOT EXISTS "fundingReadinessData" JSONB;
ALTER TABLE "ValidationReport" ADD COLUMN IF NOT EXISTS "positioningMapData" JSONB;
