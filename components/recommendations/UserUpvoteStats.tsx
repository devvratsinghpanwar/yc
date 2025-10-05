// components/recommendations/UserUpvoteStats.tsx
import { getUserUpvoteStats } from "@/lib/recommendation-utils";
import { Heart, Tag, TrendingUp } from "lucide-react";

interface UserUpvoteStatsProps {
  userId: string;
}

const UserUpvoteStats = async ({ userId }: UserUpvoteStatsProps) => {
  try {
    const stats = await getUserUpvoteStats(userId);

    return (
      <div className="bg-white border-4 border-black rounded-xl p-6">
        <h3 className="text-20-medium mb-6">Your Upvote Activity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3 mx-auto">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div className="text-24-black">{stats.totalUpvotes}</div>
            <div className="text-14-normal !text-black-300">Total Upvotes</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3 mx-auto">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <div className="text-24-black">{stats.categoriesUpvoted}</div>
            <div className="text-14-normal !text-black-300">Categories Explored</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-3 mx-auto">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="text-24-black">
              {stats.topCategories?.[0]?.category || 'None'}
            </div>
            <div className="text-14-normal !text-black-300">Top Category</div>
          </div>
        </div>

        {stats.topCategories && stats.topCategories.length > 0 && (
          <div>
            <h4 className="text-16-medium mb-4">Your Favorite Categories</h4>
            <div className="flex flex-wrap gap-2">
              {stats.topCategories.slice(0, 5).map((category: { category: string; count: number; percentage: number }) => (
                <div 
                  key={category.category}
                  className="bg-primary-100 px-3 py-2 rounded-full border-2 border-black text-14-normal font-medium"
                >
                  {category.category} ({category.count})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading user stats:', error);
    return (
      <div className="bg-white border-4 border-black rounded-xl p-6">
        <h3 className="text-20-medium mb-4">Your Upvote Activity</h3>
        <p className="text-14-normal !text-black-300">Unable to load stats. Please try again later.</p>
      </div>
    );
  }
};

export default UserUpvoteStats;
