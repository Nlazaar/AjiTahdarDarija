-- AlterTable
ALTER TABLE "LessonExercise" ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "LessonExercise_lessonId_isPublished_idx" ON "LessonExercise"("lessonId", "isPublished");
