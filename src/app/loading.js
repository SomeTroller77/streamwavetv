"use client"
import { Bebas_Neue } from 'next/font/google'
import "tailwindcss";
import "animate.css";
import { useState, useEffect } from 'react';
const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
})

export default function Loading(){
    const [visible, setVisible] = useState(true);

     useEffect(() => {
        const timer = setTimeout(() => {
        setVisible(false);
    }, 3000);

        return () => clearTimeout(timer);
    }, []);
    return(
        <>
            {visible ? <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]" id="loader">
                <h1 className={`text-blue-700 ${bebas.className} text-5xl animate__animated animate__pulse animate__infinite`}>StreamWave TV</h1>
            </div> : null}
        </>
    )
}