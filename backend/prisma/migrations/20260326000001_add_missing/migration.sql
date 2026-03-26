-- Add missing columns to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "subscriptionStatus" TEXT DEFAULT 'free';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "subscriptionExpiresAt" TIMESTAMP(3);

-- Add missing columns to Module table
ALTER TABLE "Module" ADD COLUMN IF NOT EXISTS "subtitle" TEXT;
ALTER TABLE "Module" ADD COLUMN IF NOT EXISTS "colorA" TEXT;
ALTER TABLE "Module" ADD COLUMN IF NOT EXISTS "colorB" TEXT;
ALTER TABLE "Module" ADD COLUMN IF NOT EXISTS "shadowColor" TEXT;

-- Add missing columns to Lesson table
ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "slug" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Lesson_slug_key" ON "Lesson"("slug");

-- CreateTable AnalyticsEvent
CREATE TABLE IF NOT EXISTS "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_userId_idx" ON "AnalyticsEvent"("userId");
CREATE INDEX IF NOT EXISTS "AnalyticsEvent_type_idx" ON "AnalyticsEvent"("type");

-- CreateTable FriendRequest
CREATE TABLE IF NOT EXISTS "FriendRequest" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "FriendRequest_fromId_idx" ON "FriendRequest"("fromId");
CREATE INDEX IF NOT EXISTS "FriendRequest_toId_idx" ON "FriendRequest"("toId");

-- CreateTable LeagueMembership
CREATE TABLE IF NOT EXISTS "LeagueMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "league" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeagueMembership_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "LeagueMembership_userId_idx" ON "LeagueMembership"("userId");
CREATE INDEX IF NOT EXISTS "LeagueMembership_league_idx" ON "LeagueMembership"("league");

-- CreateTable VocabularyPack
CREATE TABLE IF NOT EXISTS "VocabularyPack" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" TEXT,
    "category" TEXT,
    "premiumOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VocabularyPack_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "VocabularyPack_difficulty_idx" ON "VocabularyPack"("difficulty");
CREATE INDEX IF NOT EXISTS "VocabularyPack_category_idx" ON "VocabularyPack"("category");

-- CreateTable PackWord
CREATE TABLE IF NOT EXISTS "PackWord" (
    "id" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    CONSTRAINT "PackWord_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "PackWord_packId_idx" ON "PackWord"("packId");
CREATE INDEX IF NOT EXISTS "PackWord_vocabularyId_idx" ON "PackWord"("vocabularyId");

-- AddForeignKey PackWord
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'PackWord_packId_fkey'
  ) THEN
    ALTER TABLE "PackWord" ADD CONSTRAINT "PackWord_packId_fkey" FOREIGN KEY ("packId") REFERENCES "VocabularyPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'PackWord_vocabularyId_fkey'
  ) THEN
    ALTER TABLE "PackWord" ADD CONSTRAINT "PackWord_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- CreateTable ConversationMessage
CREATE TABLE IF NOT EXISTS "ConversationMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ConversationMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ConversationMessage_userId_idx" ON "ConversationMessage"("userId");
CREATE INDEX IF NOT EXISTS "ConversationMessage_createdAt_idx" ON "ConversationMessage"("createdAt");

-- AddForeignKey ConversationMessage
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'ConversationMessage_userId_fkey'
  ) THEN
    ALTER TABLE "ConversationMessage" ADD CONSTRAINT "ConversationMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- CreateTable ShopItem
CREATE TABLE IF NOT EXISTS "ShopItem" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "effect" JSONB,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ShopItem_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ShopItem_key_key" ON "ShopItem"("key");

-- CreateTable UserInventory
CREATE TABLE IF NOT EXISTS "UserInventory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemKey" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserInventory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "UserInventory_userId_idx" ON "UserInventory"("userId");

-- AddForeignKey UserInventory
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'UserInventory_userId_fkey'
  ) THEN
    ALTER TABLE "UserInventory" ADD CONSTRAINT "UserInventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'UserInventory_itemKey_fkey'
  ) THEN
    ALTER TABLE "UserInventory" ADD CONSTRAINT "UserInventory_itemKey_fkey" FOREIGN KEY ("itemKey") REFERENCES "ShopItem"("key") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- CreateTable DailyQuestProgress
CREATE TABLE IF NOT EXISTS "DailyQuestProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "questKey" TEXT NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "claimedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyQuestProgress_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "DailyQuestProgress_userId_date_questKey_key" ON "DailyQuestProgress"("userId", "date", "questKey");
CREATE INDEX IF NOT EXISTS "DailyQuestProgress_userId_date_idx" ON "DailyQuestProgress"("userId", "date");

-- CreateTable MonthlyQuestProgress
CREATE TABLE IF NOT EXISTS "MonthlyQuestProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "yearMonth" TEXT NOT NULL,
    "questsDone" INTEGER NOT NULL DEFAULT 0,
    "questsTarget" INTEGER NOT NULL DEFAULT 30,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "claimedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MonthlyQuestProgress_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "MonthlyQuestProgress_userId_yearMonth_key" ON "MonthlyQuestProgress"("userId", "yearMonth");
CREATE INDEX IF NOT EXISTS "MonthlyQuestProgress_userId_idx" ON "MonthlyQuestProgress"("userId");
