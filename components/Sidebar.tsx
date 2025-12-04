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
        flex-col       // UBAHAN 1: Di HP susun ke bawah (Sidebar di atas, konten di bawah)
        md:flex-row    // Di Laptop susun ke samping (Sidebar di kiri, konten di kanan)
        h-full
        `,
        player.activeId && 'h-[calc(100%-80px)]'
      )}
    >
      <div 
        className="
          flex          // UBAHAN 2: Hapus 'hidden', jadi selalu muncul
          flex-col 
          gap-y-2 
          bg-black 
          h-auto        // UBAHAN 3: Di HP tingginya menyesuaikan isi
          md:h-full     // Di Laptop tingginya full layar
          w-full        // UBAHAN 4: Di HP lebarnya full
          md:w-[300px]  // Di Laptop lebarnya tetap 300px
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
        
        {/* Opsional: Library tetap bisa di-scroll di dalam kotak kecil jika di HP */}
        <Box className="overflow-y-auto h-full">
          <Library songs={songs} />
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">
        {children}
      </main>
    </div>
  );
}
 
export default Sidebar;
