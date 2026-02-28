import "./globals.css";
import 'animate.css';
import { Bebas_Neue } from 'next/font/google'
import Loader from "./utils/Loader";
import Navbar from "./Navbar";
import axios from "axios";
const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
})
export const metadata = {
  title: "StreamWaveTV",
  description: "Made by Saksham Vitwekar",
};

export default async function RootLayout({ children }) {
  const countries = await (await axios.get("https://iptv-org.github.io/api/countries.json")).data;
  const ip = await(await axios.get("http://ip-api.com/json/")).data;
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="container dark:bg-black text-blue-700">
        <Loader/>
        <Navbar countries={countries} current={ip.countryCode}/>
        {children}
      </body>
    </html>
  );
}
