// components/UserStartupCard.tsx
import { formatDate } from "@/lib/utils";
import { EyeIcon, Heart, Edit } from "lucide-react";
import Link from "next/link";
import { Author, Startup } from "@/sanity/types";
import { urlForImage } from "@/sanity/lib/image";
import { getStartupImageUrl } from "@/lib/image-utils";
import DeleteStartupButton from "./DeleteStartupButton";
import { Button } from "@/components/ui/button";

export type UserStartupTypeCard = Omit<Startup, "author"> & { author?: Author };

interface UserStartupCardProps {
  post: UserStartupTypeCard;
  currentUserId?: string;
  showDeleteButton?: boolean;
}

const UserStartupCard = ({
  post,
  currentUserId,
  showDeleteButton = false,
}: UserStartupCardProps) => {
  const { _createdAt, views, author, title, category, _id, description } = post;

  const profileImageUrl = author?.image
    ? urlForImage(author.image)?.width(440).height(440).url()
    : undefined;

  const startupImageUrl = getStartupImageUrl(post);
  const isOwner = currentUserId === author?._id;

  return (
    <li className="startup-card group relative">
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex flex-col gap-1.5">
          {/* Edit and Delete buttons for owner */}
          {showDeleteButton && isOwner && (
            <div className="flex gap-2">
              <Link href={`/startup/${_id}/edit`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                >
                  <Edit size={16} />
                </Button>
              </Link>
              <DeleteStartupButton
                startupId={_id}
                authorId={author?._id || ""}
                startupTitle={title || "Untitled"}
              />
            </div>
          )}
          <div className="flex flex-row gap-3">
            <div className="flex gap-1.5 items-center">
              <EyeIcon className="size-6 text-primary" />
              <span className="text-16-medium">{views}</span>
            </div>
            <div className="flex gap-1.5 items-center">
              <Heart className="size-6 text-red-500" />
              <span className="text-16-medium">{(post as Startup & { upvotes?: number }).upvotes || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author?._id}`}>
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          </Link>
          <Link href={`/startup/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${author?._id}`}>
          <img
            src={
              profileImageUrl ??
              `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || "User")}&size=48&background=random`
            }
            alt={author?.name ?? "author"}
            width={48}
            height={48}
            className="rounded-full"
          />
        </Link>
      </div>

      <Link href={`/startup/${_id}`}>
        <p className="startup-card_desc">{description}</p>

        <img
          src={startupImageUrl ?? "image not found"}
          alt="placeholder"
          className="startup-card_img"
        />
      </Link>

      <div className="flex-between gap-3 text-white mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        <Link href={`/startup/${_id}`}>
          <button className="startup-card_btn">Details</button>
        </Link>
      </div>
    </li>
  );
};

export default UserStartupCard;
