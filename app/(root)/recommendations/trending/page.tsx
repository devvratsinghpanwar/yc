// app/(root)/recommendations/trending/page.tsx
import { Suspense } from "react";
import { TrendingUp } from "lucide-react";
import TrendingStartups from "@/components/recommendations/TrendingStartups";
import { StartupCardSkeleton } from "@/components/StartupCard";
import { Button } from "@/components/ui/button";

const TrendingPage = async () => {
  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <div className="flex items-center justify-center gap-3 mb-4">
          <TrendingUp className="h-8 w-8 text-white" />
          <h1 className="heading">Trending Startups</h1>
        </div>
        <p className="sub-heading !max-w-3xl">
          Discover the most popular startups based on recent upvotes
        </p>
      </section>

      <section className="section_container">
        {/* Time Period Filters */}
        <div className="flex gap-4 mb-8 justify-center">
          <Button 
            variant="default" 
            className="bg-primary hover:bg-primary/90 text-white border-2 border-black shadow-100 hover:shadow-none"
          >
            Last 24 Hours
          </Button>
          <Button 
            variant="outline" 
            className="border-2 border-black shadow-100 hover:shadow-none hover:bg-primary-100"
          >
            Last Week
          </Button>
          <Button 
            variant="outline" 
            className="border-2 border-black shadow-100 hover:shadow-none hover:bg-primary-100"
          >
            Last Month
          </Button>
        </div>

        {/* Trending Startups */}
        <div>
          <h2 className="text-30-semibold mb-6">Most Upvoted Recently</h2>
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <StartupCardSkeleton key={i} />
              ))}
            </div>
          }>
            <TrendingStartups period="24h" limit={12} />
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default TrendingPage;
