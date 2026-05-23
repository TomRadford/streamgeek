import { initClient, initClientNavigation } from "rwsdk/client";
import { setNavigationLoading } from "@/web/lib/navigation-loading";

// this is for new deploys that need to reload when new chunks....
// very stange i was getting this, im pretty sure lib should handle this?!
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  window.location.reload();
});

const { handleResponse, onHydrated } = initClientNavigation({
  onNavigate: () => {
    setNavigationLoading(true);
  },
});

initClient({
  handleResponse,
  onHydrated: () => {
    onHydrated?.();
    setNavigationLoading(false);
  },
});
