"use client";
import StoriesGrid from "@/components/StoriesGrid";
import { usePathname } from "next/navigation";

export default function StoryListPage() {
    const pathname = usePathname();
  // Exemple : "/BILLY/draftlist/reader" → ["", "BILLY", "draftlist", "reader"]
  const [, person] = pathname.split("/");
  return (
    <StoriesGrid
    basePath ={person}
      status="story"
      textDePresentation="Les histoires toutes centrées sur un univers, la collonisation de la Lune"
    />
  );
}
