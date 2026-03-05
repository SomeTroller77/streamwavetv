import { Redis } from '@upstash/redis'
import { headers } from 'next/headers';
import crypto from 'crypto';
const client = Redis.fromEnv();

export async function POST(req){
    const headersList = headers();
    const ip = (await headersList).get("x-forwarded-for") || null;
    if(!ip){
        return Response.json({success:false, message:"x-forwarded for header not found"});
    }
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    const form = await req.formData();
    const id = form.get("id");
    const region = form.get("region");
    if(id && region){
        const exist = await client.get(`view:${ipHash}:${id}`);
        if(!exist){
            await client.zincrby("trending:global", 1, id);
            await client.zincrby(`trending:${region}`, 1, id);
            await client.set(`view:${ipHash}:${id}`, 1, {ex:86400});
        }
        return Response.json({success:true});
    }else{
        return Response.json({success:false, message:"parameter(s) missing"});
    }
}   