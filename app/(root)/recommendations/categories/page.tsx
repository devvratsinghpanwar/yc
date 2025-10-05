// app/(root)/recommendations/categories/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BarChart3 } from "lucide-react";
import CategoryPreferences from "@/components/recommendations/CategoryPreferences";
import { StartupCardSkeleton } from "@/components/StartupCard";

const CategoriesPage = async () => {
  const supabase = await createClient();
  const {
    data: { user: sessionUser },
  } = await supabase.auth.getUser();

  if (!sessionUser) redirect("/login");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BarChart3 className="h-8 w-8 text-white" />
          <h1 className="heading">Category Preferences</h1>
        </div>
        <p className="sub-heading !max-w-3xl">
          Your personalized category rankings and recommendations
        </p>
      </section>

      <section className="section_container">
        <Suspense fallback={
          <div className="space-y-8">
            <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <StartupCardSkeleton key={i} />
              ))}
            </div>
          </div>
        }>
          <CategoryPreferences userId={sessionUser.id} />
        </Suspense>
      </section>
    </>
  );
};

export default CategoriesPage;
