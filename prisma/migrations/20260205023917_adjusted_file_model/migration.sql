/*
  Warnings:

  - You are about to drop the column `file` on the `Files` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `Files` table. All the data in the column will be lost.
  - Added the required column `mimeType` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" DROP COLUMN "file",
DROP COLUMN "fileType",
ADD COLUMN     "mimeType" TEXT NOT NULL,
ALTER COLUMN "fileSize" SET DATA TYPE BIGINT;
