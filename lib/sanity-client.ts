// lib/sanity-client.ts
import { createClient } from "next-sanity";

// Note: These environment variables need to be exposed to the client.
// Prefix them with NEXT_PUBLIC_
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION!;
const token = process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN!; // A write token

//console.log("Sanity Write Token:", token); // Debugging line to verify the token is loaded

if (!token) {
  throw new Error("Sanity write token is not defined in environment variables.");
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false, // `false` if you want to ensure fresh data
});