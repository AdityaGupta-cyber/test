/*
  Warnings:

  - Added the required column `userId` to the `Dog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dog" ADD COLUMN     "description" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Dog_userId_idx" ON "Dog"("userId");

-- AddForeignKey
ALTER TABLE "Dog" ADD CONSTRAINT "Dog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
