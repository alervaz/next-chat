import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get("id")!;
    const user = await prisma.user.findFirst({
        where: {
            id
        }
    })

    return NextResponse.json(user);
}