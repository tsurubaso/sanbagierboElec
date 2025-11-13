"use client";
import { use } from "react";
import BookEditor from "@/components/BookEditor";

export default function Page({ params, searchParams }) {
  const book = use(params).link;
  const branch = use(searchParams)?.branch || "master";

  return <BookEditor book={book} initialBranch={branch} />;
}
