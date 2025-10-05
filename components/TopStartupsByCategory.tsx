// components/TopStartupsByCategory.tsx
import { client } from "@/sanity/lib/client";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { Crown } from "lucide-react";

const TopStartupsByCategory = async () => {
  try {
    // Get top startup from each of the 3 most popular categories
    const topStartups = await client.fetch(
      `{
        "categories": *[_type == "startup" && defined(category) && defined(slug.current)] | {
          "category": category,
          "count": count(*[_type == "startup" && category == ^.category])
        } | order(count desc) [0...3],
        "startups": *[_type == "startup" && defined(slug.current)] {
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
        }
      }`
    );

    if (!topStartups.categories || topStartups.categories.length === 0) {
      return null;
    }

    // Get the top startup from each category
    interface Author {
      _id: string;
      name: string;
      image?: string;
      bio?: string;
    }

    interface Startup {
      _id: string;
      title: string;
      slug: { current: string };
      _createdAt: string;
      author?: Author;
      views?: number;
      description?: string;
      category: string;
      image?: string;
      imageAsset?: string;
      upvotes?: number;
      upvotedBy?: string[];
    }

    interface CategoryCount {
      category: string;
      count: number;
    }

    interface TopStartupsData {
      categories: CategoryCount[];
      startups: Startup[];
    }

    interface FeaturedStartup {
      category: string;
      startup: Startup;
    }

    const featuredStartups: FeaturedStartup[] = (topStartups as TopStartupsData).categories.map((cat: CategoryCount) => {
      const categoryStartups = (topStartups as TopStartupsData).startups.filter(
      (startup: Startup) => startup.category === cat.category
      );
      
      // Sort by upvotes desc, then by views desc, then by creation date desc
      categoryStartups.sort((a: Startup, b: Startup) => {
      if ((b.upvotes || 0) !== (a.upvotes || 0)) {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }
      if ((b.views || 0) !== (a.views || 0)) {
        return (b.views || 0) - (a.views || 0);
      }
      return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
      });

      return {
      category: cat.category,
      startup: categoryStartups[0]
      };
    }).filter((item: FeaturedStartup) => item.startup); // Filter out categories with no startups

    if (featuredStartups.length === 0) {
      return null;
    }

    return (
      <section className="section_container">
        <div className="flex items-center gap-3 mb-8">
          <Crown className="h-8 w-8 text-primary" />
          <h2 className="text-30-semibold">Top Picks by Category</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredStartups.map((item, index: number) => (
            <div key={item.category} className="relative">
              {/* Category Badge */}
              <div className="absolute -top-3 left-4 z-10 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold border-2 border-black">
                #{index + 1} in {item.category}
              </div>
              
              {/* Startup Card */}
              <div className="pt-4">
                <StartupCard post={item.startup as StartupTypeCard} />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <p className="text-16-medium !text-black-300 mb-4">
            Want personalized recommendations based on your interests?
          </p>
          <a 
            href="/recommendations" 
            className="inline-block bg-secondary hover:bg-secondary/90 text-black px-6 py-3 rounded-lg border-2 border-black shadow-100 hover:shadow-none transition-all font-semibold"
          >
            Explore Recommendations
          </a>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error loading top startups by category:', error);
    return null;
  }
};

export default TopStartupsByCategory;
