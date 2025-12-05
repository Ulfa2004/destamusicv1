"use client";

import { useEffect, useState } from "react";

import AuthModal from "@/components/AuthModal";
import  UploadModal  from '@/components/UploadModal';
import SubscribeModal from './../components/SubscribeModal';
import CreatePlaylistModal from '@/components/CreatePlaylistModal'; // IMPORT BARU: Modal Playlist
import { ProductWithPrice } from "@/types";

interface ModalProviderProps {
  products: ProductWithPrice[];
}

const ModalProvider: React.FC<ModalProviderProps> = ({
  products
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <SubscribeModal products={products} />
      <UploadModal />
      <CreatePlaylistModal /> {/* <--- PERBAIKAN: Modal Playlist Aktif */}
    </>
  );
}

export default ModalProvider;
