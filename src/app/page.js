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
export const dynamic = "force-dynamic";

export default async function Home({searchParams}) {
  const country = (await searchParams).region;
  const res = await axios.get('https://iptv-org.github.io/api/categories.json');
  const resp = await res.data;
  const logos = await (await axios.get("https://iptv-org.github.io/api/logos.json")).data;
  const rawChannels = await (await axios.get('https://iptv-org.github.io/api/channels.json')).data;
  var streams = await (await axios.get("https://iptv-org.github.io/api/streams.json")).data;
  streams = streams.filter((e) => e.url !== null);
  streams = streams.map((e) => { return e.channel});
  return (
    <div>
      <div className="flex flex-col gap-10 px-8 py-6">
        {resp.map((i) => {
          return <Section name={i.name} key={i.id} channels={rawChannels.filter((j) => j.country == country && j.categories?.includes(i.id) && streams.indexOf(j.id) !== -1)} logos={logos}/>
        })}
      </div>
    </div>
  );
}
