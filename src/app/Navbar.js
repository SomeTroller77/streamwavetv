"use client";

import { Bebas_Neue } from "next/font/google";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});

export const dynamic = "force-dynamic";

export default function Navbar({ countries, current }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentRegion = searchParams.get("region") || current;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  /* Redirect to default region if missing */
  useEffect(() => {
    if (!searchParams.get("region")) {
      router.replace(`/?region=${current}`);
    }
  }, []);

  /* Change region */
  function changeRegion(code) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("region", code);
    router.push(`/?${params.toString()}`);
    setOpen(false);
  }

  /* Handle search */
  function handleSearch(e) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("name", search.trim());
    } else {
      params.delete("name");
    }
    if(params.get("name")){
        router.push(`/search?${params.toString()}`);
    }else{
        router.push(`/?${params.toString()}`);
    }
    
  }

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center gap-6 px-6 py-4 bg-black border-b border-gray-800">

      {/* Logo */}
      <Link href="/">
        <h1 className={`text-blue-600 ${bebas.className} text-3xl hover:scale-105 transition`}>
          StreamWave TV
        </h1>
      </Link>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 flex justify-center">
        <div className="relative w-full max-w-lg group">
          
          {/* Search Icon */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search channels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full pl-12 pr-5 py-3
              rounded-full
              bg-gray-900 text-white
              border border-gray-700
              focus:outline-none
              focus:border-blue-600
              focus:ring-2 focus:ring-blue-600/60
              transition-all duration-300
              group-hover:border-blue-500
            "
          />
        </div>
      </form>

      {/* Region Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="
            px-5 py-2
            rounded-lg
            border border-blue-600
            text-blue-600
            hover:bg-blue-600 hover:text-white
            transition duration-200
          "
        >
          {currentRegion} ▼
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-800">
              {countries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => changeRegion(c.code)}
                  className={`w-full text-left px-4 py-2 transition hover:bg-blue-600 ${
                    currentRegion === c.code
                      ? "bg-blue-700 text-white"
                      : "text-gray-200"
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
  );
}