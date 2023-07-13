import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';



async function JoinChat(formData: FormData) {
  "use server";
  const name = formData.get("room") as string;
  

  const roomIfExist = await prisma.chat.findUnique({
    where: {
      name
    }
  })

  if(!roomIfExist) {
    await prisma.chat.create({
      data: {
        name,
        messages: {
          create: []
        }
      }
    })
  }

  redirect(`/${name}`)
}

export default async function Home() {
  const user = await getServerSession(authOptions);

  user ?? redirect("/api/auth/signin");


  return (
    <main className='grid place-items-center h-screen'>
        <div className="card bg-text sm:w-[26rem] w-[90%] aspect-[8/7] flex flex-col items-center
         text-bg">
          <h1 className='text-4xl font-bold my-10'>Join a Room</h1>

          <form className='flex flex-col w-[90%] form-control my-auto' action={JoinChat}>
            <label htmlFor="room" className='label'>
              <span className='label-text text-bg'>Enter the room name</span>
            </label>
            <input type="text" name='room' className='text-text input placeholder:text-text' placeholder='Room name' />
            <button type="submit" className='btn btn-accent mt-4'>Join!</button>
          </form>

      </div>
    </main>
  )
}
