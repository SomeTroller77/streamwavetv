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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!searchParams.get("region")) {
      router.replace(`/?region=${current}`);
    }
  }, []);

  function changeRegion(code) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("region", code);
    router.push(`/?${params.toString()}`);
    setOpen(false);
    setDrawerOpen(false);
  }

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("name", search.trim());
      router.push(`/search?${params.toString()}`);
    } else {
      params.delete("name");
      router.push(`/?${params.toString()}`);
    }

    setSearchOpen(false);
    setSearch("");
  }

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
    <>
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 md:px-6 py-4 bg-black border-b border-gray-800 relative z-50">

        {/* Left Section */}
        <div className="flex items-center gap-4">

          {/* Hamburger (Mobile Only) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden text-white text-2xl"
          >
            ☰
          </button>

          {/* Logo */}
          <Link href="/">
            <h1
              className={`text-blue-600 ${bebas.className} text-xl md:text-3xl transition`}
            >
              StreamWave TV
            </h1>
          </Link>
        </div>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 justify-center"
        >
          <div className="relative w-full max-w-lg">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600">
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
                focus:ring-2 focus:ring-blue-600/60
                transition
              "
            />
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Mobile Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden text-xl text-white"
          >
            🔍
          </button>

          {/* Region Dropdown (Desktop) */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="
                px-4 py-2
                rounded-lg
                border border-blue-600
                text-blue-600
                hover:bg-blue-600 hover:text-white
                transition
              "
            >
              {currentRegion} ▼
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                {countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => changeRegion(c.code)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-600"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-40 transition ${
          drawerOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setDrawerOpen(false)}
        ></div>

        <div
          className={`absolute left-0 top-0 h-full w-72 bg-gray-900 p-6 transform transition-transform ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-white text-xl mb-6"
          >
            ✕
          </button>

          <h2 className="text-blue-600 text-lg mb-4">Select Region</h2>

          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => changeRegion(c.code)}
              className="block w-full text-left py-2 text-gray-200 hover:text-white"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH MODAL (Mobile) */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-start p-6">
          <form
            onSubmit={handleSearch}
            className="w-full"
          >
            <div className="relative">
              <input
                autoFocus
                type="text"
                placeholder="Search channels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full px-6 py-4
                  rounded-full
                  bg-gray-800 text-white
                  border border-gray-700
                  focus:outline-none
                  focus:ring-2 focus:ring-blue-600
                  text-lg
                "
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}