import { create } from 'zustand';

interface PlayerViewStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const usePlayerView = create<PlayerViewStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default usePlayerView;
