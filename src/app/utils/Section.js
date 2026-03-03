"use client";

import { useRef, useState, useEffect } from "react";
import Channel from "./Channel";

export default function Section({ name, channels, logos }) {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /* ================= CHECK SCROLL POSITION ================= */
  const updateScrollButtons = () => {
    const el = containerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - 5
    );
  };

  useEffect(() => {
    updateScrollButtons();
  }, []);

  /* ================= SCROLL HANDLERS ================= */
  const scrollLeft = () => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollBy({
      left: -400,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollBy({
      left: 400,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col gap-4 relative">

      {/* SECTION TITLE */}
      <h2 className="text-2xl font-bold text-blue-600">
        {name}
      </h2>

      <div className="relative">

        {/* LEFT BUTTON */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white px-3 py-6 rounded-r-lg transition"
          >
            ◀
          </button>
        )}

        {/* CHANNEL ROW */}
        <div
          ref={containerRef}
          onScroll={updateScrollButtons}
          className="flex gap-6 overflow-x-hidden scroll-smooth"
        >
          {channels.map((i) => (
            <Channel
              key={i.id}
              id={i.id}
              imageUrl={
                logos.find((j) => i.id === j.channel)?.url
              }
              name={i.name}
            />
          ))}
        </div>

        {/* RIGHT BUTTON */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white px-3 py-6 rounded-l-lg transition"
          >
            ▶
          </button>
        )}
      </div>
    </div>
  );
}