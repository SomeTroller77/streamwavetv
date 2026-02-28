import axios from "axios";
import Stream from "./Stream";


export default async function play({ params }){
    const {id} = await params;
    const streams = await (await axios.get("https://iptv-org.github.io/api/streams.json")).data;
    const stream = streams.find((e) => e.channel == id);
    const channelStreams = streams.filter(
        e => e.channel?.toLowerCase() === id.toLowerCase()
    );
    return(
        <>
            {typeof stream !== 'undefined' ? <Stream url={stream.url}/> : <h1> Not allowed under copyright laws</h1>}
        </>
    );
}