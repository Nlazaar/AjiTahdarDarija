-- CreateTable
CREATE TABLE "UserRevisionProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "revisionId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRevisionProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRevisionProgress_userId_revisionId_key" ON "UserRevisionProgress"("userId", "revisionId");

-- CreateIndex
CREATE INDEX "UserRevisionProgress_userId_idx" ON "UserRevisionProgress"("userId");

-- CreateIndex
CREATE INDEX "UserRevisionProgress_revisionId_idx" ON "UserRevisionProgress"("revisionId");

-- AddForeignKey
ALTER TABLE "UserRevisionProgress" ADD CONSTRAINT "UserRevisionProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRevisionProgress" ADD CONSTRAINT "UserRevisionProgress_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "ModuleRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE;
