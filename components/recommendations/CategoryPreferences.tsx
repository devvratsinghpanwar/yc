// components/recommendations/CategoryPreferences.tsx

import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { getUserUpvoteStats, getCategoryRecommendations } from "@/lib/recommendation-utils";
import { BarChart3, TrendingUp } from "lucide-react";

interface CategoryPreferencesProps {
  userId: string;
}

const CategoryPreferences = async ({ userId }: CategoryPreferencesProps) => {
  try {
    const [stats, categoryRecommendations] = await Promise.all([
      getUserUpvoteStats(userId),
      getCategoryRecommendations(userId, 9)
    ]);

    return (
      <div className="space-y-8">
        {/* Category Rankings */}
        <div className="bg-white border-4 border-black rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h3 className="text-20-medium">Your Category Rankings</h3>
          </div>
          
          {stats.topCategories && stats.topCategories.length > 0 ? (
            <div className="space-y-4">
              {stats.topCategories.map((category: { category: string; count: number; percentage: number }, index: number) => (
                <div key={category.category} className="flex items-center justify-between p-4 bg-primary-100 rounded-lg border-2 border-black">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{category.category}</div>
                      <div className="text-sm text-black-300">{category.count} upvotes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {Math.round((category.count / stats.totalUpvotes) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-14-normal !text-black-300">
                Start upvoting startups to see your category preferences!
              </p>
            </div>
          )}
        </div>

        {/* Category-based Recommendations */}
        {categoryRecommendations && categoryRecommendations.length > 0 && (
          <div>
            <h3 className="text-24-black mb-6">More From Your Favorite Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryRecommendations.map((startup: StartupTypeCard) => (
                <StartupCard key={startup._id} post={startup} />
              ))}
            </div>
          </div>
        )}

        {/* Category Insights */}
        <div className="bg-white border-4 border-black rounded-xl p-6">
          <h3 className="text-20-medium mb-4">Category Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Your Diversity Score</h4>
              <div className="text-2xl font-bold text-primary mb-2">
                {stats.categoriesUpvoted > 0 ? Math.min(100, (stats.categoriesUpvoted / 10) * 100) : 0}%
              </div>
              <p className="text-sm text-black-300">
                Based on how many different categories you&apos;ve explored
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recommendation Accuracy</h4>
              <div className="text-2xl font-bold text-primary mb-2">
                {stats.totalUpvotes > 5 ? 'High' : stats.totalUpvotes > 2 ? 'Medium' : 'Low'}
              </div>
              <p className="text-sm text-black-300">
                More upvotes = better recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading category preferences:', error);
    return (
      <div className="text-center py-12">
        <div className="bg-white border-4 border-black rounded-xl p-8 max-w-md mx-auto">
          <h3 className="text-20-medium mb-4">Unable to Load Category Preferences</h3>
          <p className="text-14-normal !text-black-300">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }
};

export default CategoryPreferences;
