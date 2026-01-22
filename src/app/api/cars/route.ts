import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search") || ""
    const brand = searchParams.get("brand") || "all"
    const sort = searchParams.get("sort") || "terbaru"
    const status = searchParams.get("status") || "all"

    const query: any = {
      where: {
        AND: [
          {
            OR: [
              { brand: { contains: search } },
              { model: { contains: search } },
            ],
          },
          brand !== "all" ? { brand } : {},
          status !== "all" ? { status } : {},
        ],
      },
      orderBy: {},
    }

    if (sort === "termahal") query.orderBy = { price: "desc" }
    else if (sort === "termurah") query.orderBy = { price: "asc" }
    else query.orderBy = { createdAt: "desc" }

    const cars = await prisma.car.findMany(query)
    return NextResponse.json(cars)
  } catch (error: any) {
    console.error("API /cars error:", error)
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    )
  }
}