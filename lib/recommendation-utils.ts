// lib/recommendation-utils.ts
import { client } from '@/sanity/lib/client';
import { STARTUPS_BY_CATEGORY_QUERY, POPULAR_STARTUPS_QUERY } from '@/sanity/lib/queries';

// Get user's upvoted categories for recommendation
export async function getUserUpvotedCategories(userId: string): Promise<string[]> {
  try {
    const result = await client.fetch(
      `*[_type == "startup" && $userId in upvotedBy[]->_id]{
        category
      }`,
      { userId }
    );

    // Extract unique categories
    const categories = result
      .map((startup: { category: string }) => startup.category)
      .filter((category: string) => category)
      .filter((category: string, index: number, arr: string[]) => 
        arr.indexOf(category) === index
      );

    return categories;
  } catch (error) {
    console.error('Failed to get user upvoted categories:', error);
    return [];
  }
}

// Get recommended startups based on user's upvoted categories
export async function getRecommendedStartups(userId: string, limit: number = 10) {
  try {
    const upvotedCategories = await getUserUpvotedCategories(userId);
    
    if (upvotedCategories.length === 0) {
      // If user hasn't upvoted anything, return popular startups
      return await client.fetch(POPULAR_STARTUPS_QUERY);
    }

    // Get startups from categories the user has upvoted
    const recommendedStartups = [];
    
    for (const category of upvotedCategories) {
      const categoryStartups = await client.fetch(
        STARTUPS_BY_CATEGORY_QUERY, 
        { category }
      );
      
      // Filter out startups the user has already upvoted
      const filteredStartups = categoryStartups.filter((startup: { upvotedBy?: string[] }) =>
        !startup.upvotedBy?.includes(userId)
      );
      
      recommendedStartups.push(...filteredStartups.slice(0, 3)); // Take top 3 from each category
    }

    // Remove duplicates and sort by upvotes
    const uniqueStartups = recommendedStartups
      .filter((startup, index, arr) => 
        arr.findIndex(s => s._id === startup._id) === index
      )
      .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      .slice(0, limit);

    return uniqueStartups;
  } catch (error) {
    console.error('Failed to get recommended startups:', error);
    // Fallback to popular startups
    return await client.fetch(POPULAR_STARTUPS_QUERY);
  }
}

// Get user's upvote statistics
export async function getUserUpvoteStats(userId: string) {
  try {
    const result = await client.fetch(
      `{
        "totalUpvotes": count(*[_type == "startup" && $userId in upvotedBy[]->_id]),
        "categoriesUpvoted": count(array::unique(*[_type == "startup" && $userId in upvotedBy[]->_id].category)),
        "topCategories": *[_type == "startup" && $userId in upvotedBy[]->_id] {
          category
        } | {
          "category": category,
          "count": count(*[_type == "startup" && category == ^.category && $userId in upvotedBy[]->_id])
        } | order(count desc) [0...5]
      }`,
      { userId }
    );

    return result;
  } catch (error) {
    console.error('Failed to get user upvote stats:', error);
    return {
      totalUpvotes: 0,
      categoriesUpvoted: 0,
      topCategories: []
    };
  }
}

// Get trending startups based on time period
export async function getTrendingStartups(period: '24h' | '7d' | '30d', limit: number = 10) {
  try {
    // Calculate date threshold
    const now = new Date();
    let hoursAgo = 24;

    switch (period) {
      case '7d':
        hoursAgo = 24 * 7;
        break;
      case '30d':
        hoursAgo = 24 * 30;
        break;
      default:
        hoursAgo = 24;
    }

    const dateThreshold = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000)).toISOString();

    const result = await client.fetch(
      `*[_type == "startup" && defined(slug.current) && _createdAt >= $dateThreshold] | order(upvotes desc, _createdAt desc) [0...$limit] {
        _id,
        title,
        slug,
        _createdAt,
        author -> {
          _id, name, image, bio
        },
        views,
        description,
        category,
        image,
        imageAsset,
        upvotes,
        "upvotedBy": upvotedBy[]->_id,
      }`,
      { dateThreshold, limit: limit - 1 }
    );

    return result;
  } catch (error) {
    console.error('Failed to get trending startups:', error);
    return [];
  }
}

// Get recommendations based on similar users (collaborative filtering)
export async function getSimilarUsersRecommendations(userId: string, limit: number = 10) {
  try {
    // Find users who have upvoted similar startups
    const similarUsers = await client.fetch(
      `*[_type == "startup" && $userId in upvotedBy[]->_id] {
        "upvotedBy": upvotedBy[]->_id
      } | {
        "users": upvotedBy[@ != $userId]
      }.users[] | {
        "userId": @,
        "count": count(*[_type == "startup" && $userId in upvotedBy[]->_id && @ in upvotedBy[]->_id])
      } | order(count desc) [0...10]`,
      { userId }
    );

    if (similarUsers.length === 0) {
      return [];
    }

    // Get startups upvoted by similar users that current user hasn't upvoted
    const recommendations = await client.fetch(
      `*[_type == "startup" && defined(slug.current) && !($userId in upvotedBy[]->_id) && count(upvotedBy[]->_id[@ in $similarUserIds]) > 0] | order(upvotes desc, _createdAt desc) [0...$limit] {
        _id,
        title,
        slug,
        _createdAt,
        author -> {
          _id, name, image, bio
        },
        views,
        description,
        category,
        image,
        imageAsset,
        upvotes,
        "upvotedBy": upvotedBy[]->_id,
      }`,
      {
        userId,
        similarUserIds: similarUsers.map((u: { userId: string }) => u.userId),
        limit: limit - 1
      }
    );

    return recommendations;
  } catch (error) {
    console.error('Failed to get similar users recommendations:', error);
    return [];
  }
}

// Get category-based recommendations
export async function getCategoryRecommendations(userId: string, limit: number = 10) {
  try {
    const upvotedCategories = await getUserUpvotedCategories(userId);

    if (upvotedCategories.length === 0) {
      return [];
    }

    const recommendations = await client.fetch(
      `*[_type == "startup" && defined(slug.current) && category in $categories && !($userId in upvotedBy[]->_id)] | order(upvotes desc, _createdAt desc) [0...$limit] {
        _id,
        title,
        slug,
        _createdAt,
        author -> {
          _id, name, image, bio
        },
        views,
        description,
        category,
        image,
        imageAsset,
        upvotes,
        "upvotedBy": upvotedBy[]->_id,
      }`,
      {
        categories: upvotedCategories,
        userId,
        limit: limit - 1
      }
    );

    return recommendations;
  } catch (error) {
    console.error('Failed to get category recommendations:', error);
    return [];
  }
}
