import { useLocation, useNavigate } from "react-router-dom"; 
import ClientWrapper from "@/components/ClientWrapper";
import DictionarySidebarSimple from "@/components/DicoSimplePourSidebare";
import DictionarySidebarFull from "@/components/DicoCompletPourSidebare";
import GithubDeviceLogin from "@/components/GithubDeviceLogin";
import GithubSyncButtons from "@/components/GithubSyncButtons";


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

  //  Fonction pour rescanner
  const handleRescan = async () => {
    try {
      await window.electronAPI.rescanBooks();
      console.log("✅ Livres rescannés !");
      // Optionnel : recharger la page pour voir les changements
      window.location.reload();
    } catch (err) {
      console.error("❌ Erreur rescan:", err);
    }
  };

  const navItemsTop = [
    { href: `${basePath}/reader`, label: "📖 Reader" },
    { href: `${basePath}/editor`, label: "✏️ Editor" },
  ];

  // Boutons d'action
  const actionButtons = [
    {
      label: "⬅️ Go Back",
      onClick: () => navigate(-1),
    },
  ];

    const actionButtonsGrid = [
    {
      label: "⬅️ Go Back",
      onClick: () => navigate(-1),
    },

    {
      label: "🔄 Rescan Books",
      onClick: handleRescan,
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
        rightSidebarContent={<div><GithubDeviceLogin /><GithubSyncButtons /></div>} //
      >
        {children}
      </ClientWrapper>
    );
  }

  if (isDraft || isFragment || isIllustration || isOther || isStory) {
    return (
      <ClientWrapper
        // navItemsTop={navItemsTop}
        actionButtons={actionButtonsGrid}
        rightSidebarContent={<div><GithubDeviceLogin /><GithubSyncButtons /></div>} //
        showRightDefault={false}
      >
        {children}
      </ClientWrapper>
    );
  }

  // === PAR DÉFAUT ===
  return <>{children}</>;
}
