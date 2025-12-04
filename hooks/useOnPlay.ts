import { Song } from "@/types";

import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const authModal = useAuthModal();
  const { user } = useUser();

  const onPlay = (id: string) => {
    // Tetap cek apakah user sudah login
    if (!user) {
      return authModal.onOpen();
    }

    // BAGIAN HAPUS: Syarat (!subscription) sudah dibuang.
    // Sekarang langsung mainkan lagu!

    player.setId(id);
    player.setIds(songs.map((song) => song.id));
  }

  return onPlay;
};

export default useOnPlay;
