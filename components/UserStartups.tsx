import React from "react";
import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import { createClient } from "@/utils/supabase/server";
import UserStartupCard, { UserStartupTypeCard } from "@/components/UserStartupCard";

const UserStartups = async ({ id }: { id: string }) => {
  const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id });

  // Get current user to check if they can delete startups
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  return (
    <>
      {startups.length > 0 ? (
        startups.map((startup: UserStartupTypeCard) => (
          <UserStartupCard
            key={startup._id}
            post={startup}
            currentUserId={currentUser?.id}
            showDeleteButton={true}
          />
        ))
      ) : (
        <p className="no-result">No posts yet</p>
      )}
    </>
  );
};
export default UserStartups;