import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session) {
        return new NextResponse ( JSON.stringify({error: "Unauthorized"}), {status:403} );
    }
    try {
        const portfolio = await db.portfolio.findMany({
            where: {
                userId: Number(session.user.id),
            },
            include: {
                stocks: true,
            },
        })

        return new NextResponse ( JSON.stringify(portfolio), {status:200} );
    } catch (error) {
        return new NextResponse ( JSON.stringify({error: "Failed to fetch portfolio"}), {status:500} );
    }
}

export async function DELETE(req:NextRequest){
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    const body = await req.json();
    const { id } = body;
    if (!session) {
        return new NextResponse ( JSON.stringify({error: "Unauthorized"}), {status:403} );
    }
    try {
        const portfolio = await db.portfolio.delete({
            where: {
                userId: Number(session.user.id),
                id: id
            }
        })

        return new NextResponse ( JSON.stringify(portfolio), {status:200} );
    } catch (error) {
        return new NextResponse ( JSON.stringify({error: "Failed to fetch portfolio"}), {status:500} );
    }
}