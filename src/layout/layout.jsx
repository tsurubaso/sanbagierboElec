
import { useLocation, useNavigate} from "react-router-dom";
import ClientWrapper from "@/components/ClientWrapper";
import DictionarySidebarSimple from "@/components/DicoSimplePourSidebare";
import DictionarySidebarFull from "@/components/DicoCompletPourSidebare";
//import GithubSidebar from "@/components/GitHubSideBar";


export default function PersonLayout({ children }) {
   const location = useLocation();
     const navigate = useNavigate();
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

    // ✅ NOUVEAU : Boutons d'action
  const actionButtons = [
    { 
      label: "⬅️ Go Back", 
      onClick: () => navigate(-1) 
    },
  ];

  // === PRIORITÉ AUX MODES ===
  if (isReader) {
    return (
      <ClientWrapper
        navItemsTop={navItemsTop}
        actionButtons={actionButtons} // ✅ Passer les boutons
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
        actionButtons={actionButtons}
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
       actionButtons={actionButtons}
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
       actionButtons={actionButtons}
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
