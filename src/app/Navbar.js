"use client";

import { Bebas_Neue } from "next/font/google";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";

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
  const [regionSearch, setRegionSearch] = useState("");
  const [mobileRegionSearch, setMobileRegionSearch] = useState("");

  const dropdownRef = useRef(null);
  const desktopActiveRef = useRef(null);
  const mobileActiveRef = useRef(null);

  /* Redirect default region */
  useEffect(() => {
    if (!searchParams.get("region")) {
      router.replace(`/?region=${current}`);
    }
  }, []);

  /* Desktop auto-scroll */
  useEffect(() => {
    if (open && desktopActiveRef.current) {
      setTimeout(() => {
        desktopActiveRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }, 100);
    }
  }, [open]);

  /* Mobile auto-scroll */
  useEffect(() => {
    if (drawerOpen && mobileActiveRef.current) {
      setTimeout(() => {
        mobileActiveRef.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }, 150);
    }
  }, [drawerOpen]);

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

  const filteredDesktop = useMemo(() => {
    return countries.filter((c) =>
      c.name.toLowerCase().includes(regionSearch.toLowerCase())
    );
  }, [countries, regionSearch]);

  const filteredMobile = useMemo(() => {
    return countries.filter((c) =>
      c.name.toLowerCase().includes(mobileRegionSearch.toLowerCase())
    );
  }, [countries, mobileRegionSearch]);

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="flex items-center justify-between px-4 md:px-6 py-4 bg-black border-b border-gray-800 relative z-50">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden text-white text-2xl"
          >
            ☰
          </button>

          <Link href={`/?region=${current}`}>
            <h1 className={`text-blue-600 ${bebas.className} text-xl md:text-3xl`}>
              StreamWave TV
            </h1>
          </Link>
        </div>

        {/* DESKTOP SEARCH */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 justify-center"
        >
          <div className="relative w-full max-w-lg">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 z-10">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search channels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-3 rounded-full bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600/60 transition"
            />
          </div>
        </form>

        {/* DESKTOP REGION */}
        <div className="hidden md:block relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition"
          >
            {currentRegion} ▼
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">

              {/* Sticky Header */}
              <div className="sticky top-0 bg-gray-800 px-4 py-2 border-b border-gray-700 text-blue-500 font-semibold z-10">
                Current: {currentRegion}
              </div>

              {/* Region Search */}
              <div className="p-3 border-b border-gray-700">
                <input
                  type="text"
                  placeholder="Search region..."
                  value={regionSearch}
                  onChange={(e) => setRegionSearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Scrollable List */}
              <div className="max-h-60 overflow-y-auto">
                {filteredDesktop.map((c) => (
                  <button
                    key={c.code}
                    ref={c.code === currentRegion ? desktopActiveRef : null}
                    onClick={() => changeRegion(c.code)}
                    className={`w-full text-left px-4 py-2 transition ${
                      c.code === currentRegion
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-600"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MOBILE SEARCH ICON */}
        <button
          onClick={() => setSearchOpen(true)}
          className="md:hidden text-xl text-white"
        >
          🔍
        </button>
      </nav>

      {/* ================= MOBILE DRAWER ================= */}
      <div
        className={`fixed inset-0 z-40 transition ${
          drawerOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setDrawerOpen(false)}
        />

        <div
          className={`absolute left-0 top-0 h-full w-72 bg-gray-900 transform transition-transform flex flex-col ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 border-b border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-blue-600 text-lg">
                Current: {currentRegion}
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-white text-xl"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              placeholder="Search region..."
              value={mobileRegionSearch}
              onChange={(e) => setMobileRegionSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {filteredMobile.map((c) => (
              <button
                key={c.code}
                ref={c.code === currentRegion ? mobileActiveRef : null}
                onClick={() => changeRegion(c.code)}
                className={`block w-full text-left py-2 px-2 transition ${
                  c.code === currentRegion
                    ? "bg-blue-700 text-white rounded-md"
                    : "hover:text-white"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MOBILE SEARCH MODAL ================= */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-start p-6">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600">
                🔍
              </span>

              <input
                autoFocus
                type="text"
                placeholder="Search channels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
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