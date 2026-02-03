/*
  Warnings:

  - You are about to drop the column `dateAdded` on the `Files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filePath` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `folderId` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Files" DROP COLUMN "dateAdded",
ADD COLUMN     "dateUploaded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "fileType" TEXT NOT NULL,
ADD COLUMN     "folderId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "folderName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Files_userId_key" ON "Files"("userId");

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
