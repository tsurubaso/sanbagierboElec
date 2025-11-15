
import { useLocation } from "react-router-dom";
import ClientWrapper from "@/components/ClientWrapper";
import DictionarySidebarSimple from "@/components/DicoSimplePourSidebare";
import DictionarySidebarFull from "@/components/DicoCompletPourSidebare";
//import GithubSidebar from "@/components/GitHubSideBar";


export default function PersonLayout({ children }) {
   const location = useLocation();
  const pathname = location.pathname;

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


  // Base path
  const basePath = pathname.replace(/\/(reader|editor|creator)$/, "");

  const navItemsTop = [
    { href: `${basePath}/reader`, label: "📖 Reader" },
    { href: `${basePath}/editor`, label: "✏️ Editor" },
  ];

  // === PRIORITÉ AUX MODES ===
  if (isReader) {
    return (
      <ClientWrapper
        navItemsTop={navItemsTop}
        rightSidebarContent={<DictionarySidebarSimple />}
        showRightDefault={true}
      >
        {children}
      </ClientWrapper>
    );
  }

  if (isEditor) {
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
        rightSidebarContent={<h1>Tata</h1>}//{<GithubSidebar />}
      >
        {children}
      </ClientWrapper>
    );
  }

  if (isDraft || isFragment || isIllustration || isOther || isStory) {
    return (
      <ClientWrapper
       // navItemsTop={navItemsTop}
        rightSidebarContent={<h1>Tata</h1>}//{<GithubSidebar />}
        showRightDefault={false}
      >
        {children}
      </ClientWrapper>
    );
  }

  // === PAR DÉFAUT ===
  return <>{children}</>;
}
