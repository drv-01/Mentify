/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Users_phoneNumber_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "phoneNumber";
