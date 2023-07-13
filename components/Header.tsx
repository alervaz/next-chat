"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";


function Card({ children }: { children: React.ReactNode }) {
    return(
        <div className="card bg-text text-bg lg:block hidden p-4 fixed mt-4 ml-4">
            {children}
        </div>
    )
}

export default function Header() {
    const { data, status } = useSession();

    if(status === "loading") {
        return (
            <Card>
                <h1>Loading...</h1>
            </Card>
        )
    }


    return (
        <Card>
            <h1>{data?.user?.name}{"'"}s Credentials</h1>
            <section className="flex items-center">
                <Image
                    className="rounded-full"
                    src={data?.user?.image!}
                    alt={`${data?.user?.name}`}
                    width={50}
                    height={50}
                />
                <p className="text-sm ml-4 opacity-75">{data?.user?.email}</p>
            </section>
            <button className="btn btn-md my-2 bg-bg text-text" onClick={() => signOut()}>Sign out</button>
        </Card>
    )
}
