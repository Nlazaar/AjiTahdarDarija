-- AlterTable
ALTER TABLE "Vocabulary" ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Vocabulary_isPublished_idx" ON "Vocabulary"("isPublished");
