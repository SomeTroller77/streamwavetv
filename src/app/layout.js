import "./globals.css";
import 'animate.css';
import { Bebas_Neue } from 'next/font/google'
import Loader from "./utils/Loader";
import Navbar from "./Navbar";
import { headers } from "next/headers"; 
import { Suspense } from "react";
import axios from "axios";
const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
})
export const metadata = {
  title: "StreamWaveTV",
  description: "Made by Saksham Vitwekar",
  themeColor: "#000000",
};

export default async function RootLayout({ children }) {
  const countries = await (await axios.get("https://iptv-org.github.io/api/countries.json")).data;
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  const ipraw = forwardedFor
    ? forwardedFor.split(",")[0]
    : realIp || "Unknown";
  const ip = await (await axios.get(`http://ip-api.com/json/${ipraw}`)).data
  return (
    <html lang="en" className="bg-black">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-black text-blue-700 min-h-screen flex flex-col">
        <Loader/>
        <Suspense fallback={null}>
          <Navbar countries={countries} current={ip.countryCode}/>
        </Suspense>
        {children}
        <footer className="mt-auto bg-black border-t border-gray-800 py-6 text-center">
          <p className="text-gray-500 text-sm tracking-wide">
            Made with ❤️ by{" "}
            <a
              href="https://github.com/SomeTroller77"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-semibold hover:underline"
            >
              Saksham Vitwekar
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
