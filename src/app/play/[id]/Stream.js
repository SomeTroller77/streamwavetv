"use client"
import Hls from "hls.js";
import { useEffect, useRef } from "react";

export default function Stream({url}){
    const videoRef = useRef(null);
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (Hls.isSupported()) {
                const hls = new Hls({liveSyncDurationCount: 3});
                hls.loadSource(url);
                hls.attachMedia(video);
            } 
            else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
            } 
            else {
                console.log("HLS not supported");
            }
    }, [url]);
    return(
        <>
        <div className="min-h-screen bg-black flex items-center justify-center">
            <video
                ref={videoRef}
                controls
                autoPlay
                muted
                className="w-full max-w-4xl rounded-lg"
            />
        </div>
        </>
    );
}