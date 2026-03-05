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
  const params = new URLSearchParams();
  params.append('region', country);
  const trending = await (await axios.post(`https://www.streamwavetv.online/api/viewCount`, params)).data;
  console.log(trending);
  const globalChannels = [];
  const regionChannels = [];
  if(trending.success){
    trending.data.global.forEach((e) => {
      globalChannels.push(rawChannels.find((ch) => ch.id === e));
      const rgChannel = rawChannels.find((ch) => ch.id === e && ch.country === country);
      rgChannel ? regionChannels.push(rgChannel) : null;
    });
  }
  var streams = await (await axios.get("https://iptv-org.github.io/api/streams.json")).data;
  streams = streams.filter((e) => e.url !== null);
  streams = streams.map((e) => { return e.channel});
  return (
    <div>
      <div className="flex flex-col gap-10 px-8 py-6">
        {
          globalChannels.length !== 0 ? (<Section name={"Popular around the globe"} key={"globalChannels"} channels={globalChannels} logos={logos}/>) : <></>
        }
        {
          regionChannels.length !== 0 ? (<Section name={"Popular in your region"} key={"regionalChannels"} channels={regionChannels} logos={logos}/>) : <></>
        }
        {resp.map((i) => {
          return <Section name={i.name} key={i.id} channels={rawChannels.filter((j) => j.country == country && j.categories?.includes(i.id) && streams.indexOf(j.id) !== -1)} logos={logos}/>
        })}
      </div>
    </div>
  );
}
