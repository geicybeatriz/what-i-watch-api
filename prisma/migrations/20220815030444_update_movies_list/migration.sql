/*
  Warnings:

  - You are about to drop the column `movieId` on the `moviesList` table. All the data in the column will be lost.
  - Added the required column `listId` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "moviesList" DROP CONSTRAINT "moviesList_movieId_fkey";

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "listId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "moviesList" DROP COLUMN "movieId";

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_listId_fkey" FOREIGN KEY ("listId") REFERENCES "moviesList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
