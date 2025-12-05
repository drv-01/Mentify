-- CreateTable
CREATE TABLE "MoodEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mood" TEXT NOT NULL,
    "moodLabel" TEXT NOT NULL,
    "moodEmoji" TEXT NOT NULL,
    "stressLevel" INTEGER NOT NULL,
    "trigger" TEXT,
    "note" TEXT,
    "sleepQuality" INTEGER,
    "energyLevel" INTEGER,
    "socialConnection" INTEGER,
    "physicalActivity" TEXT,
    "mealPattern" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoodEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MoodEntry_userId_idx" ON "MoodEntry"("userId");

-- AddForeignKey
ALTER TABLE "MoodEntry" ADD CONSTRAINT "MoodEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;