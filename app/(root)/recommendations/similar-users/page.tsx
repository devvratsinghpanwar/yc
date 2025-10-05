// app/(root)/recommendations/similar-users/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Users } from "lucide-react";
import SimilarUsersRecommendations from "@/components/recommendations/SimilarUsersRecommendations";
import { StartupCardSkeleton } from "@/components/StartupCard";

const SimilarUsersPage = async () => {
  const supabase = await createClient();
  const {
    data: { user: sessionUser },
  } = await supabase.auth.getUser();

  if (!sessionUser) redirect("/login");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Users className="h-8 w-8 text-white" />
          <h1 className="heading">Similar Users</h1>
        </div>
        <p className="sub-heading !max-w-3xl">
          Discover startups liked by users with similar preferences to yours
        </p>
      </section>

      <section className="section_container">
        <div>
          <h2 className="text-30-semibold mb-6">Users Like You Also Upvoted</h2>
          <p className="text-16-medium !text-black-300 mb-8">
            Based on collaborative filtering - finding users who upvoted similar startups as you
          </p>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <StartupCardSkeleton key={i} />
              ))}
            </div>
          }>
            <SimilarUsersRecommendations userId={sessionUser.id} limit={12} />
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default SimilarUsersPage;
