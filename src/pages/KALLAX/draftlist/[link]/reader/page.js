// app/BILLY/draftlist/[link]/page.js
import MarkdownLoader from "@/components/MarkdownLoader";
import { use } from "react";

export default function BookPage({params, searchParams }) {
   const { link } = use(params); // ✅

  const search = use(searchParams); // unwrap
  const branch =search?.branch || "master"; // ✅

  return (
    <div className="flex min-h-screen bg-[#1e1e1e] text-gray-100">
      <main className="flex-1 p-2 bg-[#2a2a2a]">
        <div className="p-8">
          <div className="markdown-content prose prose-invert">
           <MarkdownLoader link={link} branch={branch} />
          </div>
        </div>
      </main>
    </div>
  );
}
