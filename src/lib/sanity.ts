import { createClient, SanityClient } from "@sanity/client";

let _client: SanityClient | null = null;

export function getSanityClient(): SanityClient {
  if (!_client) {
    _client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "k92utnmx",
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      apiVersion: "2024-01-01",
      useCdn: true,
      token: process.env.SANITY_API_READ_TOKEN,
    });
  }
  return _client;
}
