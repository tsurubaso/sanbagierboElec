"use client";
import BookEditorDiscret from "@/components/BookEditorDiscret";

export default function EditorPage({ params, searchParams }) {
  const { link: book, editor: mySecretFromURL } = React.use(params);
  const branch = use(searchParams)?.branch || "master";

  // ✅ define the function here
  const secretKeyCheck = () => {
    const expected = process.env.NEXT_PUBLIC_EDITOR_SECRET_KEY;
    return mySecretFromURL === expected;
  };

  return (
    <BookEditorDiscret
      book={book}
      branch={branch}
      secretKeyCheck={secretKeyCheck}
    />
  );
}
