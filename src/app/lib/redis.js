import { createClient } from "redis";

let client;
let connecting;

export async function getRedis() {
  if (client?.isOpen) return client;

  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });
  }

  if (!connecting) {
    connecting = client.connect().catch((err) => {
      connecting = null;
      throw err;
    });
  }

  await connecting;
  return client;
}