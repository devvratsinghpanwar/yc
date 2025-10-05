import React, { Suspense } from "react";
import SearchForms from "../../components/SearchForms";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { createClient } from "@/utils/supabase/server";
import TopStartupsByCategory from "@/components/TopStartupsByCategory";
import { StartupCardSkeleton } from "@/components/StartupCard";

// The component props must reflect that searchParams is a Promise.
const Home = async ({ searchParams }: { searchParams?: Promise<{ query?: string }> }) => {
  // 1. Await the searchParams Promise to get the actual object.
  // This resolves the Next.js 15 build error.
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query ?? "";

  // 2. Always create a params object with the 'search' key that the GROQ query expects.
  // This resolves the runtime Sanity error.
  const sanityParams = { search: query || null };

  // Get Supabase user session (server-side)
  const supabase = await createClient();
  const {
    data: {},
  } = await supabase.auth.getUser();

  // Fetch startups from Sanity using the correctly structured params
  const { data: posts } = await sanityFetch({ query: STARTUPS_QUERY, params: sanityParams });

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch your startup <br />
          CONNECT WITH ENTREPRENEURS
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on pitches and get noticed in Virtual Competitions.
        </p>
        <SearchForms query={query} />
      </section>

      {/* Top Picks by Category - Only show when not searching */}
      {!query && (
        <Suspense fallback={
          <section className="section_container">
            <h2 className="text-30-semibold mb-8">Top Picks by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <StartupCardSkeleton key={i} />
              ))}
            </div>
          </section>
        }>
          <TopStartupsByCategory />
        </Suspense>
      )}

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No Startups Found</p>
          )}
        </ul>
      </section>
      <SanityLive />
    </>
  );
};

export default Home;