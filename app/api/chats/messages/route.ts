import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const messageBody = await req.json();
    
    console.log({
        content: messageBody?.content,
        chatName: messageBody?.chatName,
        senderId: messageBody?.senderId,
    });
    
    try {
        
        const message = await prisma.message.create({
            data: {
                content: messageBody?.content,
                chatName: messageBody?.chatName,
                senderId: messageBody?.senderId,
                image: messageBody?.image
            },
        });
        
        return NextResponse.json(message);
    } catch(error) {
        console.log(error);
        return NextResponse.json(error);
        
    }
}

export async function GET(req: NextRequest) {
    const name = req.nextUrl.searchParams.get("name")!;

    const chat = await prisma.chat.findFirst({
        where: {
            name
        }
    })

    const messages = await prisma.message.findMany({
        where: {
            chat: chat!
        }
    })

    return NextResponse.json(messages);
}