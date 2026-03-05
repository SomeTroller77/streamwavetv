import { Redis } from '@upstash/redis'

const client = Redis.fromEnv();

export async function POST(req){
    const form = await req.formData();
    const region = form.get("region");
    if(region){
        const globalChannels = await client.zrange("trending:global", 0, 9, {rev:true});
        const rgChannels = await client.zrange(`trending:${region}`, 0, 9, {rev:true}) || null;
        console.log(globalChannels);
        if(globalChannels && rgChannels){
            return Response.json({success:true, data:{global:globalChannels, region:rgChannels}});
        }else{
            return Response.json({success:false, message:"Invalid regions"});
        }
    }else{
        return Response.json({success:true, message:"Bad request"});
    }
}