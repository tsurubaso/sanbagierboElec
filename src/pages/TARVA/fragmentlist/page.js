"use client";
import StoriesGrid from "@/components/StoriesGrid";
import { usePathname } from "next/navigation";

export default function FragmentListPage() {
      const pathname = usePathname();
    // Exemple : "/BILLY/draftlist/reader" → ["", "BILLY", "draftlist", "reader"]
    const [, person] = pathname.split("/");
  return (
    <StoriesGrid
    basePath ={person}
      status="fragment"
      textDePresentation="Fragments d'histoires ou l'étape entre histoire et brouillon"
    />
  );
}
