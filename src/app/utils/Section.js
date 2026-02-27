"use client"
import 'tailwindcss';
import { Inter } from 'next/font/google';
import Channel from './Channel';
import axios from 'axios';
const inter = Inter({
    subsets:['latin'],
    weight:'200',
});

export default function Section({name, channels, logos}){
    return(
        <>
           <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-6">
                {name}
            </h2>
            <div className="flex gap-6 overflow-x-auto hide-scrollbar">
                {channels.map(i => {
                    return(
                        <Channel key={i.id} id={i.id} imageUrl={
                            logos.find(j => i.id === j.channel)?.url
                        }/>
                    )
                })}
            </div>
        </div>
        </>
    );
}