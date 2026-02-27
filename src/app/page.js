import Image from "next/image";
import { headers } from 'next/headers';
import { Bebas_Neue, Inter } from 'next/font/google'
import Section from "./utils/Section";
import axios from "axios";

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
})
const inter = Inter({
  subsets:['latin'],
  weight: '200',
});


export default async function Home({ req }) {
  const res = await axios.get('https://iptv-org.github.io/api/categories.json');
  const resp = await res.data;
  const logos = await (await axios.get("https://iptv-org.github.io/api/logos.json")).data;
  const headersList = headers();
  const forwardedFor = (await headersList).get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'Unknown';
  const rawChannels = await (await axios.get('https://iptv-org.github.io/api/channels.json')).data;
  console.log(rawChannels);
  return (
    <div>
      <div className="flex flex-col gap-10 px-8 py-6">
        {resp.map((i) => {
          return <Section name={i.name} key={i.id} channels={rawChannels.filter((j) => j.country == 'IN' && j.categories?.includes(i.id))} logos={logos}/>
        })}
      </div>
    </div>
  );
}
