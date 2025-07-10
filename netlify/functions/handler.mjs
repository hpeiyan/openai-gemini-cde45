import { getStore } from "@netlify/blobs";
import worker from "../../src/worker.mjs";

export const config = {
  path: "/*",
  // "kv" is the name of the store, can be changed
  blobs: ["kv"],
};

export default async (request, context) => {
  const store = getStore("kv");
  const kv = {
    async get(key) {
      return await store.get(key);
    },
    async put(key, value) {
      await store.set(key, value);
    },
  };

  // Create a mock env object that's compatible with the Cloudflare Worker
  const env = {
    ...context.env, // Netlify's environment variables
    KV: kv,
    GEMINI_API_KEYS: context.env.GEMINI_API_KEYS,
  };

  return worker.fetch(request, env);
};
