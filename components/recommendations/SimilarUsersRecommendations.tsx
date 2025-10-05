// components/recommendations/SimilarUsersRecommendations.tsx

import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { getSimilarUsersRecommendations } from "@/lib/recommendation-utils";
import Link from "next/link";

interface SimilarUsersRecommendationsProps {
  userId: string;
  limit?: number;
}

const SimilarUsersRecommendations = async ({ userId, limit = 10 }: SimilarUsersRecommendationsProps) => {
  try {
    const recommendations = await getSimilarUsersRecommendations(userId, limit);

    if (!recommendations || recommendations.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-white border-4 border-black rounded-xl p-8 max-w-md mx-auto">
            <h3 className="text-20-medium mb-4">No Similar Users Found</h3>
            <p className="text-14-normal !text-black-300 mb-6">
              We need more data to find users with similar preferences. Keep upvoting startups to improve recommendations!
            </p>
            <Link
              href="/"
              className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg border-2 border-black shadow-100 hover:shadow-none transition-all font-semibold"
            >
              Explore Startups
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="bg-white border-4 border-black rounded-xl p-6">
          <h3 className="text-20-medium mb-4">How This Works</h3>
          <p className="text-14-normal !text-black-300">
            We analyze users who have upvoted similar startups as you, then recommend startups they&apos;ve upvoted that you haven&apos;t seen yet.
            This collaborative filtering approach helps you discover hidden gems!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((startup: StartupTypeCard) => (
            <StartupCard key={startup._id} post={startup} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading similar users recommendations:', error);
    return (
      <div className="text-center py-12">
        <div className="bg-white border-4 border-black rounded-xl p-8 max-w-md mx-auto">
          <h3 className="text-20-medium mb-4">Unable to Load Recommendations</h3>
          <p className="text-14-normal !text-black-300">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }
};

export default SimilarUsersRecommendations;
