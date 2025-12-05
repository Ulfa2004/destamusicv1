"use client";

import { useMemo } from "react";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import useUploadModal from "@/hooks/useUploadModal";
import useAuthModal from "@/hooks/useAuthModal"; // Pastikan ini diimport

import SidebarItem from "./SidebarItem";
import Box from "./Box";
import Library from "./Library";
import { useUser } from "@/hooks/useUser"; // Pastikan ini diimport

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
}

const Sidebar = ({ children, songs }: SidebarProps) => {
  const pathname = usePathname();
  const player = usePlayer();
  const uploadModal = useUploadModal();
  const authModal = useAuthModal();
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

  const onUploadClick = () => {
    if (!user) {
      return authModal.onOpen();
    }
    // Karena kita sudah matikan premium check di Library.tsx, ini akan langsung buka modal upload
    uploadModal.onOpen();
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
          <Library songs={songs} />
        </Box>
      </div>

      {/* --- MENU BAWAH HP (BOTTOM NAVIGATION) --- */}
      <div className="md:hidden fixed bottom-0 w-full bg-black z-50 p-2 border-t border-neutral-800 h-[80px]">
         <Box className="h-full justify-center">
           <div className="flex flex-row justify-between items-end w-full px-8 h-full pb-1">
             
             {/* Tombol Home */}
             <SidebarItem {...routes[0]} />

             {/* TOMBOL UPLOAD TENGAH */}
             <div className="relative -top-5">
                <button 
                  onClick={onUploadClick}
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
                  <AiOutlinePlus className="text-black font-bold" size={32} />
                </button>
             </div>

             {/* Tombol Search */}
             <SidebarItem {...routes[1]} />
             
           </div>
         </Box>
      </div>
      
      {/* PERBAIKAN PADDING: Reservasi ruang untuk Player (80px) + Navigasi (80px) = 160px */}
      <main className="h-full flex-1 overflow-y-auto py-2 pb-[160px] md:pb-0">
        {children}
      </main>
    </div>
  );
}
 
export default Sidebar;
