import PostTag from "@/components/common/Card/PostTag";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CardContent } from "@/components/ui/card";

import { FULL_KEYWORD_ITEM } from "@/constants/dummyData";

import { formatDate } from "@/utils/date";

import { useMediaStore } from "@/store/useMediaStore";
import { Post } from "@/types/post";

const isValidPlatform = (platform: string): boolean => {
  const validPlatforms = ["tistory", "velog", "medium"];
  return validPlatforms.includes(platform);
};
interface PostCardContentProps {
  post: Post;
}

export const PostCardContent = ({ post }: PostCardContentProps) => {
  const isMobile = useMediaStore((state) => state.isMobile);
  post.tags = FULL_KEYWORD_ITEM;
  return isMobile ? <MobileCardContent post={post} /> : <DesktopCardContent post={post} />;
};

const MobileCardContent = ({ post }: PostCardContentProps) => {
  const authorInitial = post.author?.charAt(0)?.toUpperCase() || "?";

  return (
    <CardContent className="p-0">
      <div className="flex items-center ml-4 mb-3 gap-3">
        <Avatar className="h-8 w-8 ring-2 ring-background cursor-pointer">
          {isValidPlatform(post.blogPlatform) ? (
            <img
              src={`https://denamu.site/files/${post.blogPlatform}-icon.svg`}
              alt={post.author}
              className="w-full h-full"
            />
          ) : (
            <AvatarFallback className="text-xs bg-slate-200">{authorInitial}</AvatarFallback>
          )}
        </Avatar>
        <p className="font-bold text-sm">{post.author}</p>
      </div>
      <div className="px-4 pb-4">
        <p className="h-[48px] font-bold text-md group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </p>
        <p className="text-[12px] text-gray-400 pt-2">{formatDate(post.createdAt)}</p>
        {post.tags && post.tags.map((tag, index) => <PostTag tag={tag} key={index} />)}
      </div>
    </CardContent>
  );
};

const DesktopCardContent = ({ post }: PostCardContentProps) => {
  const authorInitial = post.author?.charAt(0)?.toUpperCase() || "?";

  return (
    <CardContent className="p-0">
      <div className="relative -mt-4 ml-4 mb-3">
        <Avatar className="h-8 w-8 ring-2 ring-background cursor-pointer">
          {isValidPlatform(post.blogPlatform) ? (
            <img
              src={`https://denamu.site/files/${post.blogPlatform}-icon.svg`}
              alt={post.author}
              className="w-full h-full"
            />
          ) : (
            <AvatarFallback className="text-xs bg-slate-200">{authorInitial}</AvatarFallback>
          )}
        </Avatar>
      </div>
      <div className="px-4 pb-4">
        <p className="font-bold text-xs text-gray-400 pb-1 line-clamp-1">{post.author}</p>
        <p className="h-[40px] font-bold text-sm group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </p>
        <p className="text-[10px] text-gray-400 pt-2">{formatDate(post.createdAt)}</p>
        {post.tags && post.tags.map((tag, index) => <PostTag tag={tag} key={index} />)}
      </div>
    </CardContent>
  );
};

export default PostCardContent;
