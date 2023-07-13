"use client";

import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import io from "socket.io-client";

interface Props {
    params: {
        name: string
    }
}

const socket = io('http://localhost:4000')

export default function Chat({ params }: Props) {
    const messageInput = useRef<HTMLInputElement | null>(null);
    const dummy = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const { data, status  } = useSession();

   
    const fetch = async() => {
        const res = await axios.get(`http://localhost:3000/api/chats/messages?name=${params.name}`);
        setMessages(res.data);
    }

    useEffect(() => {
        fetch();
        socket.on("message", messages => {
            recieveMessage(messages)
        })
    }, [])

    const recieveMessage = (message: any) => setMessages((state) => [...state, message])

    const submit = async(e: FormEvent) => {
        e.preventDefault();
        const message = messageInput.current?.value;
        const chat = await axios.get(`http://localhost:3000/api/chats?name=${params.name}`);
        const user = await axios.get(`http://localhost:3000/api/auth?email=${data?.user?.email}`);

        const body = {
            content: message,
            chat: chat.data,
            user: user.data,
            image: data?.user?.image
        }
        console.log(body);
        
        
        socket.emit("message", body);
        if(message !== "") {
            setMessages(prevMessaages => [...prevMessaages, body]);
            messageInput.current!.value = "";
        }
    }

    if(status === 'loading') {
        return <p>Loading...</p>
    }


    if(status === "unauthenticated") {
        router.push("/api/auth/signin")
    }

    return (
        <div className="flex justify-center">
            <main className="flex flex-col h-screen bg-text w-[90vw]  lg:w-[40vw] text-bg items-center">
                <header className="bg-bg translate-y-9 text-text w-[60%] border-4 rounded-2xl border-text h-16 flex items-center justify-center">
                    <h1 className="text-3xl">{params.name}</h1>
                    
                </header>
                
                <section className="bg-bg text-text h-[80%] w-[90%] my-auto rounded-lg flex flex-col">
                    <div className="flex-1 flex flex-col text-1xl overflow-y-scroll pt-4">
                        {messages.map((message, i) => 
                            <div key={i} className={`flex w-fit p-2 h-fit
                                    ${message?.image === data?.user?.image ? "flex-row-reverse ml-auto sm:mr-9" : "sm:ml-9"}
                                `} ref={dummy}>
                                <Image
                                    className="aspect-square w-[3rem] rounded-full h-[3rem]"
                                    src={message?.image}
                                    alt="image"
                                    width={100}
                                    height={100}/>
                                 <section className={` flex items-center
                                    ${message?.image === data?.user?.image ? "bg-primary mr-2" : "bg-secondary ml-2"} w-fit p-3 rounded-xl`}>
                                     
                                     <h1>{message?.content}</h1>
                                 </section>
                            </div>    
                        )}
                    </div>
                    <form onSubmit={submit} className="h-[35%] border-t-4 border-t-text flex items-center justify-center flex-col sm:flex-row">
                        <button 
                            className="block lg:hidden sm:ml-auto sm:mr-6 mb-4 sm:mb-0 btn-accent btn-sm btn" 
                            onClick={async() => await signOut()}
                        >
                                Signout
                        </button>
                        <input type="text" placeholder="Message..." ref={messageInput} className="input bg-text text-bg placeholder:text-bg mr-4 w-[70%]" />
                        <button type="submit" className="btn btn-accent sm:mr-6 sm:mt-0 mt-4">Send</button>
                    </form>
                </section>
            </main>
        </div>
    )
}
