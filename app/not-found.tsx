import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center gap-y-2'>
      <h2 className='text-4xl'> Not Found</h2>
      <p>Could not find requested resource</p>
      <Link className='px-8 py-4 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50' href="/">Return Home</Link>
    </div>
  )
}