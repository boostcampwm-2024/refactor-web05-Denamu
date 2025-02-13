import { useRef } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router-dom";

import PostAvatar from "@/components/common/Card/PostAvatar";
import { SimpleTagList } from "@/components/common/Card/PostTag";
import Header from "@/components/layout/Header";

import Loading from "@/pages/Loading";
import NotFound from "@/pages/NotFound";

import { usePostCardActions } from "@/hooks/common/usePostCardActions";
import { usePostDetail } from "@/hooks/queries/usePostDetail";

import { POST_MODAL_DATA } from "@/constants/dummyData";

import { detailFormatDate } from "@/utils/date";

export default function PostDetailPage() {
  const { id } = useParams();
  if (id && !/^\d+$/.test(id)) {
    return <NotFound />;
  }
  const { data, isLoading, error } = usePostDetail(Number(id));
  const modalRef = useRef<HTMLDivElement>(null);
  const { handlePostClick } = usePostCardActions(data?.data || POST_MODAL_DATA.data);
  if (isLoading) {
    return <Loading />;
  }
  if (error || !data) {
    return <NotFound />;
  }

  return (
    <div ref={modalRef} className="bg-white  overflow-y-auto relative">
      <Header />
      <div className="mt-5 px-10 md:px-40 flex flex-col gap-2">
        <h1 className="text-[2rem] font-bold">{data.data.title}</h1>
        <span className="flex gap-2 items-center">
          <PostAvatar blogPlatform={data.data.blogPlatform} className="h-8 w-8" author={data.data.author} />
          <span className="flex flex-col">
            <span>{data.data.author}</span>
            <span className="flex gap-2 text-sm text-gray-400">
              <span>{detailFormatDate(data.data.createdAt)}</span>
              <span>·</span>
              <span>{data.data.viewCount} views</span>
            </span>
          </span>
        </span>
        <span>
          <SimpleTagList tags={data.data.tag} />
        </span>
        <div className="flex flex-col gap-5 mb-10">
          <div
            className="grid grid-cols-5 gap-4 items-center border rounded-md shadow-sm transition-transform duration-300 hover:scale-[1.02]"
            role="button"
            onClick={handlePostClick}
          >
            <div className="col-span-3 flex flex-col h-full justify-between p-4 bg-white">
              <span className="text-lg font-semibold">{data.data.title}</span>
              <span className="text-sm text-gray-400 hover:underline">{data.data.path}</span>
            </div>
            <img
              src={data.data.thumbnail}
              alt={`Thumbnail for ${data.data.title}`}
              className="col-span-2 h-full w-full bg-gray-100"
            />
          </div>
          <div className="prose">
            <Markdown>{data.data.summary.replace(/\\n/g, "\n")}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}
