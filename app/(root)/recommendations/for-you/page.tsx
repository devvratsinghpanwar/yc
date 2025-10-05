// app/(root)/recommendations/for-you/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Heart } from "lucide-react";
import RecommendedForYou from "@/components/recommendations/RecommendedForYou";
import { StartupCardSkeleton } from "@/components/StartupCard";
import UserUpvoteStats from "@/components/recommendations/UserUpvoteStats";

const ForYouPage = async () => {
  const supabase = await createClient();
  const {
    data: { user: sessionUser },
  } = await supabase.auth.getUser();

  if (!sessionUser) redirect("/login");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="h-8 w-8 text-white" />
          <h1 className="heading">For You</h1>
        </div>
        <p className="sub-heading !max-w-3xl">
          Personalized startup recommendations based on your upvoting history
        </p>
      </section>

      <section className="section_container">
        {/* User Stats */}
        <div className="mb-8">
          <Suspense fallback={<div className="h-32 bg-gray-100 rounded-lg animate-pulse" />}>
            <UserUpvoteStats userId={sessionUser.id} />
          </Suspense>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-30-semibold mb-6">Recommended Startups</h2>
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <StartupCardSkeleton key={i} />
              ))}
            </div>
          }>
            <RecommendedForYou userId={sessionUser.id} limit={12} />
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default ForYouPage;
