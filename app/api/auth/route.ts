import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email")!;
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    })

    console.log(email);
    

    return NextResponse.json(user);
}