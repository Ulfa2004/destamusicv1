"use client";

import { useMemo } from "react";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
// Icon untuk Playlist dan Upload
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlinePlaylistAdd } from "react-icons/md"; 
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

// [1] IMPORT BARU: Import tipe Playlist
import { Song, Playlist } from "@/types"; 
import usePlayer from "@/hooks/usePlayer";
import useUploadModal from "@/hooks/useUploadModal";
import useAuthModal from "@/hooks/useAuthModal";
import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal";

import SidebarItem from "./SidebarItem";
import Box from "./Box";
import Library from "./Library";
import { useUser } from "@/hooks/useUser";

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
  playlists: Playlist[]; // [2] NEW PROP: Data playlist diterima di sini
}

const Sidebar = ({ children, songs, playlists }: SidebarProps) => { // [3] Diterima sebagai argumen
  const pathname = usePathname();
  const player = usePlayer();
  const uploadModal = useUploadModal();
  const authModal = useAuthModal();
  const createPlaylistModal = useCreatePlaylistModal();

  const { user } = useUser();

  const routes = useMemo(() => [
    {
      icon: HiHome,
      label: 'Home',
      active: pathname !== '/search',
      href: '/'
    },
    {
      icon: BiSearch,
      label: 'Search',
      href: '/search',
      active: pathname === '/search'
    },
  ], [pathname]);

  // Fungsi untuk membuka modal Upload Musik
  const onUploadClick = () => {
    if (!user) {
      return authModal.onOpen();
    }
    uploadModal.onOpen();
  };

  // Fungsi untuk membuka modal Buat Playlist
  const onCreatePlaylistClick = () => {
    if (!user) {
      return authModal.onOpen();
    }
    createPlaylistModal.onOpen();
  };

  return (
    <div 
      className={twMerge(`
        flex 
        flex-col-reverse 
        md:flex-row 
        h-full
        `
      )}
    >
      {/* --- SIDEBAR LAPTOP (Di Kiri) --- */}
      <div 
        className="
          hidden 
          md:flex 
          flex-col 
          gap-y-2 
          bg-black 
          h-full 
          w-[300px] 
          p-2
        "
      >
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          {/* [4] DITERUSKAN KE LIBRARY */}
          <Library songs={songs} playlists={playlists} /> 
        </Box>
      </div>

      {/* --- MENU BAWAH HP (BOTTOM NAVIGATION) --- */}
      <div className="md:hidden fixed bottom-0 w-full bg-black z-50 p-2 border-t border-neutral-800 h-[80px]">
         <Box className="h-full justify-center">
           <div className="flex flex-row justify-between items-end w-full px-8 h-full pb-1">
             
             {/* 1. Tombol Home (Kiri) */}
             <SidebarItem {...routes[0]} />

             {/* 2. TOMBOL UPLOAD MUSIK (BARU) */}
             <button onClick={onUploadClick} className="text-neutral-400 hover:text-white mb-2">
                <AiOutlinePlus size={24} />
             </button>

             {/* 3. TOMBOL BUAT PLAYLIST (TENGAH, Tombol Besar) */}
             <div className="relative -top-5">
                <button 
                  onClick={onCreatePlaylistClick} // Panggil fungsi Playlist
                  className="
                    h-16 w-16
                    rounded-full
                    bg-green-500 
                    flex items-center justify-center
                    hover:scale-105 hover:bg-green-400
                    transition
                    shadow-xl shadow-neutral-900/50
                    border-[4px] border-black
                  "
                >
                  <MdOutlinePlaylistAdd className="text-black font-bold" size={32} />
                </button>
             </div>

             {/* 4. Tombol Search (Kanan) */}
             <SidebarItem {...routes[1]} />
             
             {/* 5. Tombol Kosong (untuk keseimbangan layout) */}
             <div className="w-[24px]"></div>
           </div>
         </Box>
      </div>
      
      <main className="h-full flex-1 overflow-y-auto py-2 pb-[160px] md:pb-0">
        {children}
      </main>
    </div>
  );
}
 
export default Sidebar;
