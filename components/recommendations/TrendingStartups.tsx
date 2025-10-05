// components/recommendations/TrendingStartups.tsx

import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { getTrendingStartups } from "@/lib/recommendation-utils";

interface TrendingStartupsProps {
  period: '24h' | '7d' | '30d';
  limit?: number;
}

const TrendingStartups = async ({ period, limit = 10 }: TrendingStartupsProps) => {
  try {
    const trendingStartups = await getTrendingStartups(period, limit);

    if (!trendingStartups || trendingStartups.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-white border-4 border-black rounded-xl p-8 max-w-md mx-auto">
            <h3 className="text-20-medium mb-4">No Trending Startups</h3>
            <p className="text-14-normal !text-black-300">
              No startups have been upvoted in this time period yet.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Top 3 with special styling */}
        {trendingStartups.slice(0, 3).length > 0 && (
          <div className="mb-8">
            <h3 className="text-24-black mb-4">🏆 Top 3 Trending</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingStartups.slice(0, 3).map((startup: StartupTypeCard, index: number) => (
                <div key={startup._id} className="relative">
                  <div className="absolute -top-2 -left-2 z-10 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 border-black">
                    {index + 1}
                  </div>
                  <StartupCard post={startup} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rest of the startups */}
        {trendingStartups.length > 3 && (
          <div>
            <h3 className="text-24-black mb-4">More Trending Startups</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingStartups.slice(3).map((startup: StartupTypeCard) => (
                <StartupCard key={startup._id} post={startup} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading trending startups:', error);
    return (
      <div className="text-center py-12">
        <div className="bg-white border-4 border-black rounded-xl p-8 max-w-md mx-auto">
          <h3 className="text-20-medium mb-4">Unable to Load Trending Startups</h3>
          <p className="text-14-normal !text-black-300">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }
};

export default TrendingStartups;
