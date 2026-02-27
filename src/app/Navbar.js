import { Bebas_Neue } from 'next/font/google'
import Link from 'next/link';
const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
})

export default function Navbar(){
    return(
        <nav className='flex items-center px-6 py-4 bg-black text-white'>
            <Link href={"/"}>
                <h1 className={`text-blue-700 ${bebas.className} text-3xl`}>StreamWave TV</h1>
            </Link>
            <div className="flex gap-6 mx-auto"/>
            <button className="border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white px-5 py-2 rounded-lg transition duration-300">
                Change Region
            </button>
        </nav>
    );
}