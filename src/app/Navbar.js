"use client"

import { Bebas_Neue } from "next/font/google"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
})
export const dynamic = "force-dynamic";
export default function Navbar({ countries, current }) {
const router = useRouter()
const searchParams = useSearchParams()
const currentRegion = !searchParams.get("region") ? searchParams.get('current') : searchParams.get("region");
useEffect(() => {
    if(!searchParams.get('region')){
        router.push(`/?region=${current}`);
    }
}, [])
const [open, setOpen] = useState(false)
const dropdownRef = useRef(null)
function changeRegion(code) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("region", code)
    router.push(`/?${params.toString()}`)
    setOpen(false)
}
// Close dropdown when clicking outside
useEffect(() => {
    function handleClickOutside(e) {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
    }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () =>
    document.removeEventListener("mousedown", handleClickOutside)
}, [])

return (
    <nav className="flex items-center px-6 py-4 bg-black text-white border-b border-gray-800">
    <Link href="/">
        <h1 className={`text-blue-600 ${bebas.className} text-3xl`}>
        StreamWave TV
        </h1>
    </Link>

    <div className="flex-1" />

    <div className="relative" ref={dropdownRef}>
        <button
        onClick={() => setOpen(!open)}
        className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-5 py-2 rounded-lg transition duration-200"
        >
        {currentRegion} ▼
        </button>

        {open && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
            
            {/* Scrollable container */}
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-800">
            {countries.map((c) => (
                <button
                key={c.code}
                onClick={() => changeRegion(c.code)}
                className={`w-full text-left px-4 py-2 hover:bg-blue-600 transition ${
                    currentRegion === c.code
                    ? "bg-blue-700 text-white"
                    : ""
                }`}
                >
                {c.name}
                </button>
            ))}
            </div>

        </div>
        )}
    </div>
    </nav>
    )
}