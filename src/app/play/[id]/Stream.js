"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

export default function Stream({ url }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const startTimeRef = useRef(null);

  const [error, setError] = useState(null);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uptime, setUptime] = useState(0);

  /* ================= INIT PLAYER ================= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let retryCount = 0;

    if (Hls.isSupported()) {
      const hls = new Hls({
        liveSyncDurationCount: 3,
        maxBufferLength: 30,
      });

      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsBuffering(false);
        video.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.log("HLS ERROR:", data);

        if (data.response?.code === 403) {
          setError("This stream is geo-blocked in your region.");
          hls.destroy();
          return;
        }

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (retryCount < 3) {
                retryCount++;
                hls.startLoad();
              } else {
                setError("Stream unavailable (network error)");
                hls.destroy();
              }
              break;

            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;

            default:
              setError("Stream unavailable");
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else {
      setError("HLS not supported in this browser.");
    }

    return () => {
      hlsRef.current?.destroy();
    };
  }, [url]);

  /* ================= VIDEO EVENTS ================= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
      if (!startTimeRef.current) startTimeRef.current = Date.now();
    };
    const onPause = () => setIsPlaying(false);

    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  /* ================= UPTIME TRACKING ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      if (startTimeRef.current) {
        const seconds = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        setUptime(seconds);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ================= CUSTOM CONTROLS ================= */
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!document.fullscreenElement) {
      video.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  /* ================= ERROR UI ================= */
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-xl mb-2">Channel Unavailable</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative">
      <div className="relative w-full max-w-4xl">

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
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {/* CUSTOM CONTROLS */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
          <button onClick={togglePlay}>
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>

          <div className="text-sm text-gray-300">
            Uptime: {uptime}s
          </div>

          <button onClick={toggleFullscreen}>
            ⛶ Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
}