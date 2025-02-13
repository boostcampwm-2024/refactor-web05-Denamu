import React from "react";
import Markdown from "react-markdown";

import { Post } from "@/types/post";

interface PostContentProps {
  data: Post;
  onPostClick: () => void;
}

export const PostContent = React.memo(({ data, onPostClick }: PostContentProps) => {
  const summary = data.summary;
  const markdownString = (summary ?? "").replace(/\\n/g, "\n").replace(/\\r/g, "\r");

  return (
    <div className="flex flex-col gap-5 mb-10">
      <div
        className="grid grid-cols-5 gap-4 items-center border rounded-md shadow-sm transition-transform duration-300 hover:scale-[1.02]"
        role="button"
        onClick={onPostClick}
      >
        <div className="col-span-3 flex flex-col h-full justify-between p-4 bg-white">
          <span className="text-lg font-semibold">{data.title}</span>
          <span className="text-sm text-gray-400 hover:underline truncate flex gap-1">
            <img
              src={`https://denamu.site/files/${data.blogPlatform}-icon.svg`}
              alt={data.author}
              className="h-5 w-5 rounded-none"
            />
            {data.path}
          </span>
        </div>
        <div className="col-span-2 h-[200px] w-full overflow-hidden bg-gray-100">
          <img src={data.thumbnail} alt={`Thumbnail for ${data.title}`} className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="prose">
        <Markdown>{markdownString}</Markdown>
        {summary && (
          <p className="text-gray-400">💡 인공지능이 요약한 내용입니다. 오류가 포함될 수 있으니 참고 바랍니다.</p>
        )}
      </div>
    </div>
  );
});

PostContent.displayName = "PostContent";
