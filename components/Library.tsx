"use client";

import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { useRouter } from "next/navigation"; // IMPORT BARU
import { useMemo } from 'react'; // IMPORT BARU

import { Song, Playlist } from "@/types"; // Import Playlist (Asumsi ada di types.ts)
import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import useOnPlay from "@/hooks/useOnPlay";
import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal"; // IMPORT BARU

import MediaItem from "./MediaItem";

interface LibraryProps {
  songs: Song[];
  playlists: Playlist[]; // NEW PROP: Data playlist
}

const Library: React.FC<LibraryProps> = ({
  songs,
  playlists // DITERIMA DI SINI
}) => {
  const { user } = useUser();
  const authModal = useAuthModal();
  const createPlaylistModal = useCreatePlaylistModal(); // HOOK BARU
  const router = useRouter(); // HOOK BARU

  const onPlay = useOnPlay(songs);

  const onClick = () => {
    // Tombol '+' sekarang untuk Buat Playlist
    if (!user) {
      return authModal.onOpen();
    }
    return createPlaylistModal.onOpen(); 
  }

  // Helper untuk membuat objek tampilan playlist agar bisa dirender MediaItem
  const createPlaylistData = (item: Playlist) => ({
      id: item.id,
      title: item.title,
      author: 'Playlist Anda', 
      song_path: '',
      image_path: item.image_path || '', // Ambil gambar playlist jika ada
  } as Song);


  return ( 
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-neutral-400" size={26} />
          <p className="text-neutral-400 font-medium text-md">
            Your Library
          </p>
        </div>
        {/* Tombol '+' sekarang untuk Buat Playlist */}
        <AiOutlinePlus 
          onClick={onClick} 
          size={20} 
          className="
            text-neutral-400 
            cursor-pointer 
            hover:text-white 
            transition
          "
        />
      </div>
      
      {/* --- DAFTAR PLAYLISTS (Fitur Baru) --- */}
      {playlists.length > 0 && (
        <div className="flex flex-col gap-y-2 mt-4 px-3">
          {playlists.map((item) => (
            <MediaItem 
              // Navigasi ke halaman playlist (Anda harus membuat route ini nanti!)
              onClick={() => router.push(`/playlist/${item.id}`)} 
              key={item.id} 
              data={createPlaylistData(item)} 
            />
          ))}
        </div>
      )}
      {/* ------------------------------------- */}
      
      {/* --- DAFTAR LAGU (Lama) --- */}
      <p className="text-neutral-400 text-sm mt-4 px-3">Lagu Anda:</p>
      <div className="flex flex-col gap-y-2 mt-2 px-3">
        {songs.map((item) => (
          <MediaItem 
            onClick={(id: string) => onPlay(id)} 
            key={item.id} 
            data={item}
          />
        ))}
      </div>
    </div>
   );
}
 
export default Library;
