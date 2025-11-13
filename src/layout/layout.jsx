"use client";

import ClientWrapper from "@/components/ClientWrapper";
import DictionarySidebarSimple from "@/components/DicoSimplePourSidebare";
import DictionarySidebarFull from "@/components/DicoCompletPourSidebare";
import GithubSidebar from "@/components/GitHubSideBar";
import { usePathname } from "next/navigation";

export default function PersonLayout({ children }) {
  const pathname = usePathname();

    // Exemple : "/BILLY/draftlist/reader" → ["", "BILLY", "draftlist", "reader"]
  const [, person] = pathname.split("/");

  // Catégories principales
  const isDraft = pathname.includes("draftlist");
  const isFragment = pathname.includes("fragmentlist");
  const isIllustration = pathname.includes("illustrationlist");
  const isOther = pathname.includes("otherlist");
  const isStory = pathname.includes("storylist");
  const isRules = pathname.includes("Rules");

  // Modes
  const isReader = pathname.includes("/reader");
  const isEditor = pathname.includes("/editor");
  const isMerger = pathname.includes("/merger");

  // Base path
  const basePath = pathname.replace(/\/(reader|editor|merger)$/, "");

  const navItemsTop = [
    { href: `${basePath}/reader`, label: "📖 Reader" },
    { href: `${basePath}/editor`, label: "✏️ Editor" },
    { href: `${basePath}/merger`, label: "🧩 Merger" },
  ];

  // === PRIORITÉ AUX MODES ===
  if (isReader) {
    return (
      <ClientWrapper
        navItemsTop={navItemsTop}
        //rightSidebarDescription={<p>🧾 Mode Lecture</p>}
        rightSidebarContent={<DictionarySidebarSimple />}
        showRightDefault={true}
      >
        {children}
      </ClientWrapper>
    );
  }

  if (isEditor || isMerger) {
    return (
      <ClientWrapper
        navItemsTop={navItemsTop}
        rightSidebarContent={<DictionarySidebarFull />}
        showRightDefault={true}
      >
        {children}
      </ClientWrapper>
    );
  }

  // === ENSUITE LES CATÉGORIES ===
  if (isRules) {
    return (
      <ClientWrapper
       // navItemsTop={navItemsTop}
        rightSidebarContent={<GithubSidebar />}
      >
        {children}
      </ClientWrapper>
    );
  }

  if (isDraft || isFragment || isIllustration || isOther || isStory) {
    return (
      <ClientWrapper
       // navItemsTop={navItemsTop}
        rightSidebarContent={<GithubSidebar />}
        showRightDefault={false}
      >
        {children}
      </ClientWrapper>
    );
  }

  // === PAR DÉFAUT ===
  return <>{children}</>;
}
