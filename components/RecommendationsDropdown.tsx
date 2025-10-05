// components/RecommendationsDropdown.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Heart, TrendingUp, Users, BarChart3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const RecommendationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative">
      {/* Dropdown Trigger */}
      <Button
        onClick={toggleDropdown}
        className="bg-secondary hover:bg-secondary/90 text-black border-2 border-black shadow-100 hover:shadow-none transition-all font-semibold"
      >
        <Sparkles className="size-4 mr-2" />
        <span className="max-sm:hidden">Recommendations</span>
        <span className="sm:hidden">Recs</span>
        <ChevronDown className={`size-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={closeDropdown}
          />
          
          {/* Dropdown Content */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-white border-4 border-black rounded-xl shadow-200 z-20 overflow-hidden">
            <div className="p-2">
              <div className="text-sm font-semibold text-black-300 px-3 py-2 uppercase tracking-wide">
                Discover Startups
              </div>
              
              <Link href="/recommendations" onClick={closeDropdown}>
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary-100 transition-colors group">
                  <Sparkles className="size-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-black">All Recommendations</div>
                    <div className="text-xs text-black-300">Overview & quick access</div>
                  </div>
                </div>
              </Link>

              <Link href="/recommendations/for-you" onClick={closeDropdown}>
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary-100 transition-colors group">
                  <Heart className="size-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-black">For You</div>
                    <div className="text-xs text-black-300">Based on your upvotes</div>
                  </div>
                </div>
              </Link>

              <Link href="/recommendations/trending" onClick={closeDropdown}>
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary-100 transition-colors group">
                  <TrendingUp className="size-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-black">Trending</div>
                    <div className="text-xs text-black-300">Most upvoted recently</div>
                  </div>
                </div>
              </Link>

              <Link href="/recommendations/similar-users" onClick={closeDropdown}>
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary-100 transition-colors group">
                  <Users className="size-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-black">Similar Users</div>
                    <div className="text-xs text-black-300">What others like you upvoted</div>
                  </div>
                </div>
              </Link>

              <Link href="/recommendations/categories" onClick={closeDropdown}>
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary-100 transition-colors group">
                  <BarChart3 className="size-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-semibold text-black">Categories</div>
                    <div className="text-xs text-black-300">Your preferences & rankings</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RecommendationsDropdown;
