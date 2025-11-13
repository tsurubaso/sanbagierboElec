// src/pages/ReaderPage.jsx
import { useParams, useNavigate  } from "react-router-dom";
import MarkdownLoader from "@/components/MarkdownLoader";

export default function ReaderPage() {
  const { link } = useParams();
   const navigate = useNavigate();

  return (
    <div>
      {/* Go back to previous page */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-600 text-white rounded"
      >before</button>

      <div className="flex min-h-screen bg-[#1e1e1e] text-gray-100">
        <main className="flex-1 p-2 bg-[#2a2a2a]">
          <div className="p-8 markdown-content prose prose-invert">
            <MarkdownLoader link={link} />
          </div>
        </main>
      </div>
    </div>
  );
}
