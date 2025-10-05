import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import {
  PLAYLIST_BY_SLUG_QUERY,
  STARTUP_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { urlForImage } from "@/sanity/lib/image";
import { getStartupImageUrl } from "@/lib/image-utils";
import { createClient } from "@/utils/supabase/server";
import DeleteStartupButton from "@/components/DeleteStartupButton";
import UpvoteButton from "@/components/UpvoteButton";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

const md = markdownit();

export const experimental_ppr = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const [post, pr] = await Promise.all([
    client.fetch(STARTUP_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, {
      slug: "editor-picks-new",
    }),
  ]);
  console.log("pr:", pr);

  if (!post) return notFound();

  // Get current user to check if they can delete the startup
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const { author } = post;
  const profileImageUrl = author?.image
    ? urlForImage(author.image)?.width(440).height(440).url()
    : undefined;

  const startupImageUrl = getStartupImageUrl(post);
  const parsedContent = md.render(post?.pitch || "");
  const isOwner = currentUser?.id === author?._id;

  // Get upvote data
  const upvotes = post.upvotes || 0;
  const upvotedByUsers = post.upvotedBy || [];
  const hasUpvoted = currentUser ? upvotedByUsers.includes(currentUser.id) : false;

  return (
    <>
      <section className="pink_container !min-h-[230px] relative">
        <p className="tag">{formatDate(post?._createdAt)}</p>

        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>

        {/* Edit and Delete buttons for owner */}
        {isOwner && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Link href={`/startup/${post._id}/edit`}>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </Button>
            </Link>
            <DeleteStartupButton
              startupId={post._id}
              authorId={author?._id || ''}
              startupTitle={post.title || 'Untitled'}
            />
          </div>
        )}
      </section>

      <section className="section_container">
        <img
          src={startupImageUrl || post.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <img
                src={profileImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || 'User')}&size=64&background=random`}
                alt={author?.name ?? "author"}
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post.author.username}
                </p>
              </div>
            </Link>

            <p className="category-tag">{post.category}</p>
          </div>

          {/* Upvote Button Section */}
          <div className="flex justify-center py-6">
            <UpvoteButton
              startupId={post._id}
              initialUpvotes={upvotes}
              initialHasUpvoted={hasUpvoted}
              isLoggedIn={!!currentUser}
            />
          </div>

          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr className="divider" />

        {pr?.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Editor Picks</p>

            <ul className="mt-7 card_grid-sm">
              {pr.map((post: StartupTypeCard, i: number) => (
                <StartupCard key={i} post={post} />
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default Page;
