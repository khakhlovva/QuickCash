/*
  Warnings:

  - Added the required column `sectionName` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "sectionName" TEXT NOT NULL;
