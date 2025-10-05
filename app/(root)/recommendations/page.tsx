// app/(root)/recommendations/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Heart, TrendingUp, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecommendedForYou from "@/components/recommendations/RecommendedForYou";
import { StartupCardSkeleton } from "@/components/StartupCard";

const RecommendationsPage = async () => {
  const supabase = await createClient();
  const {
    data: { user: sessionUser },
  } = await supabase.auth.getUser();

  if (!sessionUser) redirect("/login");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Recommendations</h1>
        <p className="sub-heading !max-w-3xl">
          Discover startups tailored to your interests and preferences
        </p>
      </section>

      <section className="section_container">
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/recommendations/for-you">
            <div className="bg-white border-4 border-black rounded-xl p-6 hover:shadow-200 transition-all hover:bg-primary-100 group">
              <Heart className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-20-medium mb-2">For You</h3>
              <p className="text-14-normal !text-black-300">
                Based on your upvoted categories
              </p>
            </div>
          </Link>

          <Link href="/recommendations/trending">
            <div className="bg-white border-4 border-black rounded-xl p-6 hover:shadow-200 transition-all hover:bg-primary-100 group">
              <TrendingUp className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-20-medium mb-2">Trending</h3>
              <p className="text-14-normal !text-black-300">
                Most upvoted in last 24h/week
              </p>
            </div>
          </Link>

          <Link href="/recommendations/similar-users">
            <div className="bg-white border-4 border-black rounded-xl p-6 hover:shadow-200 transition-all hover:bg-primary-100 group">
              <Users className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-20-medium mb-2">Similar Users</h3>
              <p className="text-14-normal !text-black-300">
                What users like you also upvoted
              </p>
            </div>
          </Link>

          <Link href="/recommendations/categories">
            <div className="bg-white border-4 border-black rounded-xl p-6 hover:shadow-200 transition-all hover:bg-primary-100 group">
              <BarChart3 className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-20-medium mb-2">Categories</h3>
              <p className="text-14-normal !text-black-300">
                Your personalized category rankings
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Preview - Recommended For You */}
        <div className="mb-12">
          <div className="flex-between mb-6">
            <h2 className="text-30-semibold">Quick Preview - For You</h2>
            <Link href="/recommendations/for-you">
              <Button variant="outline" className="border-2 border-black shadow-100 hover:shadow-none">
                View All
              </Button>
            </Link>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <StartupCardSkeleton key={i} />
              ))}
            </div>
          }>
            <RecommendedForYou userId={sessionUser.id} limit={3} />
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default RecommendationsPage;
