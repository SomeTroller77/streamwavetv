import axios from "axios";
import Stream from "./Stream";


export default async function play({ params }){
    const {id} = await params;
    const channels = await (await axios.get("https://iptv-org.github.io/api/channels.json")).data;
    const channel = channels.find((e) => e.id === id);
    const streams = await (await axios.get("https://iptv-org.github.io/api/streams.json")).data;
    const stream = streams.find((e) => e.channel == id);
    const channelStreams = streams.filter(
        e => e.channel?.toLowerCase() === id.toLowerCase()
    );
    return(
        <>
            {typeof stream !== 'undefined' ? <Stream url={stream.url} region={channel.country} channelID={id}/> : <h1> Not allowed under copyright laws</h1>}
        </>
    );
}