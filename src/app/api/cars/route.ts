import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  // Ambil parameter dari URL
  const search = searchParams.get("search") || ""
  const brand = searchParams.get("brand") || "all"
  const sort = searchParams.get("sort") || "terbaru"
  const status = searchParams.get("status") || "all"

  // Susun query Prisma
  const query: any = {
    where: {
      AND: [
        {
          OR: [
            { brand: { contains: search, mode: 'insensitive' } },
            { model: { contains: search, mode: 'insensitive' } },
          ],
        },
        brand !== "all" ? { brand } : {},
        status !== "all" ? { status: status as any } : {},
      ],
    },
    orderBy: {},
  }

  // Logika Sorting
  if (sort === "termahal") query.orderBy = { price: 'desc' }
  else if (sort === "termurah") query.orderBy = { price: 'asc' }
  else query.orderBy = { createdAt: 'desc' }

  const cars = await prisma.car.findMany(query)
  return NextResponse.json(cars)
}