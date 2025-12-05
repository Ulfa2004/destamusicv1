"use client";

import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";

import SidebarItem from "./SidebarItem";
import Box from "./Box";
import Library from "./Library";
import { useMemo } from "react";

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
}

const Sidebar = ({ children, songs }: SidebarProps) => {
  const pathname = usePathname();
  const player = usePlayer();

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
        // BAGIAN YANG DIHAPUS: Saya membuang logic pengurangan tinggi di sini.
        // Sekarang layar akan selalu Full Screen walau ada lagu diputar.
      )}
    >
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

      {/* --- MENU BAWAH (HP) --- */}
      <div className="md:hidden fixed bottom-0 w-full bg-black z-40 p-2 border-t border-neutral-800">
         <Box>
           <div className="flex flex-row justify-around items-center w-full px-2 py-2">
             {routes.map((item) => (
                <SidebarItem key={item.label} {...item} />
             ))}
           </div>
         </Box>
      </div>
      
      {/* PERBAIKAN UTAMA DI SINI:
         - mb-[80px] diganti jadi pb-[150px].
         - Artinya: Background ditarik full ke bawah, tapi isi konten didorong ke atas (padding)
           supaya tidak ketutup tombol Home & Player.
      */}
      <main className="h-full flex-1 overflow-y-auto py-2 pb-[150px] md:pb-0">
        {children}
      </main>
    </div>
  );
}
 
export default Sidebar;
