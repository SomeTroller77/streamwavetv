import axios from "axios";
import Link from "next/link";

export async function generateMetadata({params}){
    const channels = await (await axios.get('https://iptv-org.github.io/api/channels.json')).data;
    const {id} = await params;
    const chobj = channels.find((e) => e.id == id);
    return{
        title:`Watch ${chobj.name} for free LIVE`,
        description:`Watch ${chobj.name} for free LIVE without any ads!`
    }
}
export default async function ChannelPage({ params }) {
    const {id} = await params;
    const channels = await (await axios.get('https://iptv-org.github.io/api/channels.json')).data;
    const chobj = channels.find((e) => e.id == id);
    const logos = await (await axios.get('https://iptv-org.github.io/api/logos.json')).data;
    const logo = logos.find((e) => e.channel === id);
    return (
        <>
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        {/* Logo */}
                <div className="w-[250px] h-[150px] flex items-center justify-center bg-gray-900 rounded-xl mb-6">
                    {logo.url !== null ? (
                    <img
                        src={logo.url}
                        alt={chobj.name}
                        className="max-h-full max-w-full object-contain"
                    />
                    ) : <h1>{chobj.name}</h1>}
                </div>
                {/* Channel Name */}
                <h1 className="text-4xl font-bold text-blue-700 mb-4">
                    {chobj.name}
                </h1>
                {/* Launch Date */}
                <p className="text-gray-400 mb-6">
                    Launched: {chobj.launched || "Unknown"}
                </p>
                {/* Play Button */}
                <Link href={`/play/${id}`}>
                    <button className="bg-blue-700 hover:bg-blue-800 transition px-8 py-3 rounded-lg text-white text-lg font-semibold">
                        ▶ Play
                    </button>
                </Link>
            </div>
        </>
    );
}