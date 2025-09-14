// testPrisma.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // 1. Create or fetch a test vendor
    const vendor = await prisma.vendor.upsert({
      where: { name: "Test Vendor" },
      update: {},
      create: {
        name: "Test Vendor",
        email: "vendor@test.com",
        phone: "1234567890",
        notes: "Test notes",
      },
    });
    console.log("Vendor upserted:", vendor);

    // 2. Create or fetch a test material
    const material = await prisma.material.upsert({
      where: { id: 1 }, // use 1 or any unique id
      update: {
        itemName: "Test Material",
        category: "Test Category",
        size: "1x1",
        unit: "ea",
        price: 9.99,
      },
      create: {
        id: 1,
        itemName: "Test Material",
        category: "Test Category",
        size: "1x1",
        unit: "ea",
        price: 9.99,
      },
    });
    console.log("Material upserted:", material);

    // 3. Connect material with vendor (MaterialVendor)
    const materialVendor = await prisma.materialVendor.upsert({
      where: {
        materialId_vendorId: { materialId: material.id, vendorId: vendor.id },
      },
      update: {},
      create: {
        materialId: material.id,
        vendorId: vendor.id,
      },
    });
    console.log("MaterialVendor upserted:", materialVendor);

    // 4. Fetch all materials with vendors
    const materialsWithVendors = await prisma.material.findMany({
      include: {
        vendors: {
          include: { vendor: true },
        },
      },
    });
    console.log(
      "All materials with vendors:",
      JSON.stringify(materialsWithVendors, null, 2)
    );
  } catch (err) {
    console.error("Prisma test failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
