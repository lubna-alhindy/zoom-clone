/*
  Warnings:

  - Added the required column `name` to the `Conference` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conference" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'running';
