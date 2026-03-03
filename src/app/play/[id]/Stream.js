"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

export default function Stream({ url }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const volumeRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const [isAdjustingVolume, setIsAdjustingVolume] = useState(false);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  /* ================= INIT PLAYER ================= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const savedVolume = localStorage.getItem("player-volume");
    if (savedVolume !== null) {
      video.volume = parseFloat(savedVolume);
      setVolume(parseFloat(savedVolume));
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ liveSyncDurationCount: 3 });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsBuffering(false);
        video.play();
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    }

    return () => {
      hlsRef.current?.destroy();
    };
  }, [url]);

  /* ================= VIDEO EVENTS ================= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration);
    const onPlaying = () => {
      setIsPlaying(true);
      setIsBuffering(false);
    };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsBuffering(true);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
    };
  }, []);

  /* ================= CLICK OUTSIDE CLOSE ================= */
  useEffect(() => {
    function handleClickOutside(e) {
      if (volumeRef.current && !volumeRef.current.contains(e.target)) {
        setShowVolume(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  /* ================= CONTROLS ================= */

  const togglePlay = () => {
    const video = videoRef.current;
    video.paused ? video.play() : video.pause();
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;

    video.volume = newVolume;
    video.muted = false;

    setVolume(newVolume);
    localStorage.setItem("player-volume", newVolume);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative w-full max-w-4xl group">

        {/* VIDEO */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-lg bg-black"
        />

        {/* BUFFERING SPINNER */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
          </div>
        )}

        {/* CONTROLS */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-lg px-4 py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

          {/* PROGRESS BAR */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              step="0.1"
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* CONTROL ROW */}
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-6">

              <button onClick={togglePlay} className="text-white text-lg">
                {isPlaying ? "⏸" : "▶"}
              </button>

              {/* VOLUME CONTROL */}
              <div ref={volumeRef} className="relative flex items-center">

                <button
                  onClick={() => setShowVolume((v) => !v)}
                  className={`text-white text-lg transition ${
                    isAdjustingVolume ? "text-blue-500 drop-shadow-[0_0_8px_#2563eb]" : ""
                  }`}
                >
                  {volume === 0 ? "🔇" : "🔊"}
                </button>

                {/* VERTICAL SLIDER */}
                <div
                  className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-300 ${
                    showVolume
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 pointer-events-none"
                  }`}
                >
                  <div
                    className={`h-32 w-10 bg-gray-900/90 backdrop-blur-md rounded-full flex items-center justify-center p-2 shadow-lg transition ${
                      isAdjustingVolume
                        ? "ring-2 ring-blue-600 shadow-[0_0_15px_#2563eb]"
                        : ""
                    }`}
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      onMouseDown={() => setIsAdjustingVolume(true)}
                      onMouseUp={() => setIsAdjustingVolume(false)}
                      onTouchStart={() => setIsAdjustingVolume(true)}
                      onTouchEnd={() => setIsAdjustingVolume(false)}
                      className="rotate-[-90deg] w-28 appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* FULLSCREEN */}
            <button
              onClick={() => videoRef.current.requestFullscreen()}
              className="text-white"
            >
              ⛶
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}