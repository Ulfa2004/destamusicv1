"use client";

import { useMemo } from "react";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
// IMPORT BARU: Icon Plus yang lebih tegas
import { AiOutlinePlus } from "react-icons/ai";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
// IMPORT BARU: Hook untuk membuka modal upload
import useUploadModal from "@/hooks/useUploadModal";

import SidebarItem from "./SidebarItem";
import Box from "./Box";
import Library from "./Library";

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
}

const Sidebar = ({ children, songs }: SidebarProps) => {
  const pathname = usePathname();
  const player = usePlayer();
  // HOOK BARU: Panggil fungsi upload modal
  const uploadModal = useUploadModal();

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
      {/* --- SIDEBAR LAPTOP (Tidak Berubah) --- */}
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
          <Library songs={songs} />
        </Box>
      </div>

      {/* --- MENU BAWAH HP (NATIVE STYLE DENGAN TOMBOL TENGAH) --- */}
      <div className="md:hidden fixed bottom-0 w-full bg-black z-50 p-2 border-t border-neutral-800 h-[80px]">
         <Box className="h-full justify-center">
           {/* Kita susun manual secara horizontal: Home - Tambah - Search */}
           <div className="flex flex-row justify-between items-end w-full px-8 h-full pb-1">
             
             {/* 1. Tombol Home (Kiri) */}
             <SidebarItem {...routes[0]} />

             {/* 2. TOMBOL UPLOAD TENGAH YANG KEREN */}
             {/* Kita bungkus div dengan negative margin-top supaya dia "mengapung" keluar batas atas */}
             <div className="relative -top-5">
                <button 
                  onClick={uploadModal.onOpen}
                  className="
                    h-16 w-16
                    rounded-full
                    bg-green-500
                    flex items-center justify-center
                    hover:scale-105 hover:bg-green-400
                    transition
                    shadow-xl shadow-neutral-900/50
                    border-[4px] border-black /* Border hitam agar menyatu dengan background */
                  "
                >
                  <AiOutlinePlus className="text-black font-bold" size={32} />
                </button>
             </div>

             {/* 3. Tombol Search (Kanan) */}
             <SidebarItem {...routes[1]} />
             
           </div>
         </Box>
      </div>
      
      <main className="h-full flex-1 overflow-y-auto py-2 pb-[150px] md:pb-0">
        {children}
      </main>
    </div>
  );
}
 
export default Sidebar;
