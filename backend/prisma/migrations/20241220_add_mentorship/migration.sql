-- CreateTable
CREATE TABLE "CustomMentor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT,
    "domain" TEXT,
    "experience" TEXT,
    "specialization" TEXT[],
    "availability" TEXT,
    "bio" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "linkedin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomMentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorConnection" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mentorId" INTEGER,
    "mentorName" TEXT NOT NULL,
    "mentorType" TEXT NOT NULL DEFAULT 'default',
    "status" TEXT NOT NULL DEFAULT 'connected',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MentorConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomMentor_userId_idx" ON "CustomMentor"("userId");

-- CreateIndex
CREATE INDEX "MentorConnection_userId_idx" ON "MentorConnection"("userId");

-- AddForeignKey
ALTER TABLE "CustomMentor" ADD CONSTRAINT "CustomMentor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorConnection" ADD CONSTRAINT "MentorConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;