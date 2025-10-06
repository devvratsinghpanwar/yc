
import { createClient } from "@/utils/supabase/server";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_ID_QUERY } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image"; // <-- Import the new image helper
import { notFound } from "next/navigation";
import Image from "next/image";
import UserStartups from "@/components/UserStartups";
import UserProfileClient, { EditProfileButtonWrapper } from "@/components/UserProfileClient"; // <-- Import client wrapper
import { Suspense } from "react";
import { StartupCardSkeleton } from "@/components/StartupCard";

export const experimental_ppr = true;

// The params prop is a direct object in the App Router, not a Promise
const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  // 2. Await the params Promise to get the actual object.
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Get the current logged-in user's session from Supabase
  const supabase = await createClient();
  const {
    data: { user: sessionUser },
  } = await supabase.auth.getUser();

  // Fetch the profile data for the user whose page is being viewed from Sanity
  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id });

  // If no user is found in Sanity for this ID, show a 404 page
  if (!user) {
    notFound();
  }

  // Use the helper to build a full image URL from the Sanity image object
  const profileImageUrl = user.image
    ? urlForImage(user.image)?.width(440).height(440).url()
    : undefined;

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>

          {/* Use the processed image URL and provide a fallback */}
          <Image
            src={
              profileImageUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&size=220&background=random`
            }
            alt={`${user.name}'s profile picture`}
            width={220}
            height={220}
            className="profile_image" // Ensure this class has `border-radius: 50%` and `object-fit: cover`
          />

          <p className="text-30-extrabold mt-7 text-center">
            @{user?.username}
          </p>

          {/* FIX: Display the bio with a fallback message */}
          <p className="mt-1 text-center text-14-normal px-4 text-white">
            {user?.bio || "This user has not provided a bio yet."}
          </p>

          {/* Edit Profile Button */}
          <EditProfileButtonWrapper
            user={{ _id: user._id, bio: user.bio || "" }}
            isOwner={sessionUser?.id === id}
          />
        </div>

        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">
            {sessionUser?.id === id
              ? "Your Startups"
              : `${user.name}'s Startups`}
          </p>
          <ul className="card_grid-sm">
            <Suspense fallback={<StartupCardSkeleton />}>
              <UserStartups id={id} />
            </Suspense>
          </ul>
        </div>
      </section>

      {/* Render EditProfile components outside the profile_container for proper z-index layering */}
      <UserProfileClient
        user={{ _id: user._id, bio: user.bio || "" }}
        isOwner={sessionUser?.id === id}
      />
    </>
  );
};

export default Page;
