-- CreateEnum
CREATE TYPE "RevisionPosition" AS ENUM ('MIDDLE', 'END');

-- CreateTable
CREATE TABLE "ModuleRevision" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "position" "RevisionPosition" NOT NULL,
    "title" TEXT,
    "content" JSONB NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModuleRevision_moduleId_position_key" ON "ModuleRevision"("moduleId", "position");

-- CreateIndex
CREATE INDEX "ModuleRevision_moduleId_idx" ON "ModuleRevision"("moduleId");

-- CreateIndex
CREATE INDEX "ModuleRevision_isPublished_idx" ON "ModuleRevision"("isPublished");

-- AddForeignKey
ALTER TABLE "ModuleRevision" ADD CONSTRAINT "ModuleRevision_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
