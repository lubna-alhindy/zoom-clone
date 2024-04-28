/*
  Warnings:

  - Added the required column `status` to the `UserConference` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserConferenceStatus" AS ENUM ('in', 'out');

-- AlterTable
ALTER TABLE "UserConference" ADD COLUMN     "inDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "outDate" TIMESTAMP(3),
ADD COLUMN     "status" "UserConferenceStatus" NOT NULL;
