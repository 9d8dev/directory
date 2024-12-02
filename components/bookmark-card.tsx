import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star, Archive, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

interface BookmarkCardProps {
  bookmark: {
    id: number;
    url: string;
    title: string;
    description?: string | null;
    category?: {
      id: string;
      name: string;
      color?: string;
      icon?: string;
    };
    favicon?: string | null;
    overview?: string | null;
    ogImage?: string | null;
    isArchived: boolean;
    isFavorite: boolean;
    slug: string;
  };
}

export const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
  return (
    <div
      className={cn(
        "not-prose group relative grid gap-2 rounded-md",
        "border bg-accent/50 p-1.5",
        "transition-all hover:bg-accent",
        bookmark.isArchived && "opacity-60",
      )}
    >
      {/* Status Icons */}
      <div className="absolute right-2 top-2 flex gap-1">
        {bookmark.isFavorite && (
          <Badge
            variant="secondary"
            className="bg-yellow-500/10 text-yellow-500"
          >
            <Star className="h-3 w-3" />
          </Badge>
        )}
        {bookmark.isArchived && (
          <Badge variant="secondary" className="bg-gray-500/10 text-gray-500">
            <Archive className="h-3 w-3" />
          </Badge>
        )}
      </div>

      {/* Card Content */}
      <Link href={`/${bookmark.slug}`} className="space-y-3">
        {/* Preview Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded border">
          <Image
            src={bookmark.ogImage || "/placeholder.jpg"}
            alt={bookmark.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Title and Description */}
        <div className="flex items-start gap-2">
          <Image
            src={bookmark.favicon || "/favicon.ico"}
            alt=""
            width={16}
            height={16}
            className="h-4 w-4"
          />
          <div className="space-y-1">
            <h2 className="font-medium leading-tight">{bookmark.title}</h2>
            {bookmark.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {bookmark.description}
              </p>
            )}
          </div>
        </div>

        {/* Category Badge */}
        {bookmark.category && (
          <Badge
            style={{
              backgroundColor: bookmark.category.color,
              color: "white",
            }}
            className="w-fit"
          >
            {bookmark.category.icon} {bookmark.category.name}
          </Badge>
        )}
      </Link>

      {/* Action Buttons */}
      <div className="mt-2 flex gap-2">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/${bookmark.slug}`}>View Details</Link>
        </Button>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={bookmark.url} target="_blank" rel="noopener noreferrer">
            Visit Site <ExternalLink className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
