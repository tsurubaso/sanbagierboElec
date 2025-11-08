"use client";
import StoriesGrid from "@/components/StoriesGrid";
import { usePathname } from "next/navigation";

export default function OtherListPage() {
    const pathname = usePathname();
  // Exemple : "/BILLY/draftlist/reader" → ["", "BILLY", "draftlist", "reader"]
  const [, person] = pathname.split("/");
  return (
    <StoriesGrid
    basePath ={person}
      status="other"
      textDePresentation="Beaucoup de choses faites avant"
    />
  );
}
