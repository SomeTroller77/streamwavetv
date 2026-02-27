"use client"
import "tailwindcss";
import { useRouter } from "next/navigation";


export default function Channel({imageUrl, id}){
    const router = useRouter();
    return(
        <div>
            <div className="min-w-[180px] h-[200px] flex items-center justify-center bg-gray-900 rounded-lg flex-shrink-0">
                <img
                    src={imageUrl}
                    alt="Channel Logo"
                    className="max-h-full max-w-full object-contain"
                onClick={() => {
                    router.push(`/channel/${id}`);
                }}/>
            </div>
        </div>
    );
}