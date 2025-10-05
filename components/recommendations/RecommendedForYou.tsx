// components/recommendations/RecommendedForYou.tsx

import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { getRecommendedStartups } from "@/lib/recommendation-utils";
import Link from "next/link";

interface RecommendedForYouProps {
  userId: string;
  limit?: number;
}

const RecommendedForYou = async ({ userId, limit = 10 }: RecommendedForYouProps) => {
  try {
    const recommendedStartups = await getRecommendedStartups(userId, limit);

    if (!recommendedStartups || recommendedStartups.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-white border-4 border-black rounded-xl p-8 max-w-md mx-auto">
            <h3 className="text-20-medium mb-4">No Recommendations Yet</h3>
            <p className="text-14-normal !text-black-300 mb-6">
              Start upvoting startups to get personalized recommendations!
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedStartups.map((startup: StartupTypeCard) => (
          <StartupCard key={startup._id} post={startup} />
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error loading recommendations:', error);
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

export default RecommendedForYou;
