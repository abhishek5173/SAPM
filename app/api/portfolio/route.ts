import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
 
  try {
    const body = await req.json();
    const { name, totalPrice, selectedStocks } = body;

    if (!selectedStocks || !Array.isArray(selectedStocks)) {
      return NextResponse.json({ success: false, error: "Invalid or missing selectedStocks" }, { status: 400 });
    }

    const newPortfolio = await db.portfolio.create({
      data: {
        name,
        totalPrice,
        userId: Number(session?.user.id),
        stocks: {
          create: selectedStocks.map((stock) => ({
            stockName: stock.stock,
            price: stock.price,
            quantity: stock.quantity,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, portfolio: newPortfolio }, { status: 201 });
  } catch (error: any) {
    console.error("Error saving portfolio:", error?.message || error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to save portfolio" }, { status: 500 });
  }

}
