/*
  Warnings:

  - A unique constraint covering the columns `[category,itemName,size,unit,price]` on the table `Material` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Material_category_itemName_size_unit_price_key" ON "public"."Material"("category", "itemName", "size", "unit", "price");
