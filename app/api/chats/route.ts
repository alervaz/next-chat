import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const name = req.nextUrl.searchParams.get("name") as string;

    const chat = await prisma.chat.findFirst({
        where: {
            name
        }
    });


    return NextResponse.json(chat);
}