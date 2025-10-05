// app/(root)/startup/[id]/edit/page.tsx
import { client } from "@/sanity/lib/client";
import { STARTUP_BY_ID_QUERY } from "@/sanity/lib/queries";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import StartupEditForm from "@/components/StartupEditForm";

const EditStartupPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  // Get the current user
  const supabase = await createClient();
  const {
    data: { user: sessionUser },
  } = await supabase.auth.getUser();

  if (!sessionUser) {
    redirect("/login");
  }

  // Fetch the startup
  const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

  if (!post) {
    notFound();
  }

  // Check if the current user is the owner of the startup
  const isOwner = sessionUser.id === post.author?._id;

  if (!isOwner) {
    redirect(`/startup/${id}`);
  }

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <h1 className="heading">Edit Your Pitch</h1>
        <p className="sub-heading !max-w-3xl">
          Update your startup pitch and make it even better
        </p>
      </section>

      <StartupEditForm post={post} />
    </>
  );
};

export default EditStartupPage;
