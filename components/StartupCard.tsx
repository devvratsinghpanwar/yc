import { cn, formatDate } from "@/lib/utils";
import { EyeIcon, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Author, Startup } from "@/sanity/types";
import { Skeleton } from "@/components/ui/skeleton";
import { urlForImage } from "@/sanity/lib/image";
import { getStartupImageUrl } from "@/lib/image-utils";

export type StartupTypeCard = Omit<Startup, "author"> & { author?: Author };

const StartupCard = ({ post }: { post: StartupTypeCard }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    category,
    _id,
    description,
    upvotes,
  } = post;

  const profileImageUrl = author?.image
    ? urlForImage(author.image)?.width(440).height(440).url()
    : undefined;

  const startupImageUrl = getStartupImageUrl(post);
  return (
    <li className="startup-card group">
      <div className="flex-between">
        <p className="startup_card_date">{formatDate(_createdAt)}</p>
        <div className="flex gap-3">
          <div className="flex gap-1.5 items-center">
            <EyeIcon className="size-6 text-primary" />
            <span className="text-16-medium">{views}</span>
          </div>
          <div className="flex gap-1.5 items-center">
            <Heart className="size-6 text-red-500" />
            <span className="text-16-medium">{upvotes || 0}</span>
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
            src={profileImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || 'User')}&size=48&background=random`}
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

      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <p className="text-16-medium">{category}</p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/startup/${_id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export const StartupCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index: number) => (
      <li key={cn("skeleton", index)}>
        <Skeleton className="startup-card_skeleton" />
      </li>
    ))}
  </>
);

export default StartupCard;
