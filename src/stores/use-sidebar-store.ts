import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SidebarState {
  open: boolean;
  isMini: boolean;
  openMobile: boolean;
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  setIsMini: (isMini: boolean) => void;
  setOpenMobile: (open: boolean | ((open: boolean) => boolean)) => void;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, _get) => ({
      open: false,
      isMini: true,
      openMobile: false,
      setOpen: (open) =>
        set((state) => ({
          open: typeof open === "function" ? open(state.open) : open,
        })),
      setIsMini: (isMini) => set({ isMini }),
      setOpenMobile: (open) =>
        set((state) => ({
          openMobile:
            typeof open === "function" ? open(state.openMobile) : open,
        })),
      toggleSidebar: () =>
        set((state) => {
          // Logic to handle mobile vs desktop toggle could be here,
          // but usually we check isMobile in the component.
          // For simplicity, we'll just toggle 'open' here, but components
          // should decide which one to toggle based on screen size.
          return { open: !state.open };
        }),
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => localStorage), // or cookies if needed
      // Note: The original code used cookies for SSR compatibility.
      // If SSR is critical for sidebar state (to avoid layout shift),
      // we might need to keep using cookies or initialize from cookies.
      // For now, localStorage is the standard Zustand way.
    },
  ),
);
