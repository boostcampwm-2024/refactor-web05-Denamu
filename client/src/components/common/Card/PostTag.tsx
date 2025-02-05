export default function PostTag({ tag }: { tag: string }) {
  return (
    <span className="text-[12px] text-[#6B7280] inline-block rounded-lg border border-[#E2E8F0] mr-[5px] px-2">
      #{tag}
    </span>
  );
}
