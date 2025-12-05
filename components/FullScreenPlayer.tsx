"use client";

import Image from "next/image";
import { AiOutlineClose, AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMemo } from 'react'; // Digunakan untuk membuat URL gambar

import { Song } from "@/types";
import usePlayerView from "@/hooks/usePlayerView";
import Slider from "./Slider";
import LikeButton from "./LikeButton";

// TIPE DATA BARU: Tambahkan properti untuk Durasi dan Pindah Waktu
interface FullScreenPlayerProps {
  song: Song;
  songUrl: string;
  isPlaying: boolean;
  volume: number;
  togglePlay: () => void;
  toggleMute: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onChangeVolume: (value: number) => void;
  // PROPS BARU UNTUK TIMELINE
  duration: number;
  currentTime: number;
  onSeek: (value: number) => void;
}

const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({
  song,
  isPlaying,
  volume,
  togglePlay,
  toggleMute,
  onNext,
  onPrevious,
  onChangeVolume,
  // PROPS BARU
  duration,
  currentTime,
  onSeek
}) => {
  const playerView = usePlayerView();
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;
  const supabaseClient = useSupabaseClient(); // Panggil Supabase Client

  // Solusi Gambar: Buat URL Publik dari image_path
  const imageUrl = useMemo(() => {
    if (!song) {
      return '';
    }
    if (song.image_path) {
      const { data: imageData } = supabaseClient
        .storage
        .from('images') // Pastikan nama bucket kamu 'images'
        .getPublicUrl(song.image_path);

      return imageData.publicUrl;
    }
    return '/images/liked.png'; // Fallback
  }, [song, supabaseClient]);

  // Helper untuk format detik ke menit:detik
  const formatTime = (time: number) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return '0:00';
  };

  if (!playerView.isOpen) return null;

  return ( 
    <div className="fixed inset-0 bg-neutral-900 z-[9999] flex flex-col p-6 h-full w-full overflow-hidden">
      {/* Tombol Tutup (Minimize) */}
      <div className="flex justify-between items-center mb-8">
        <div className="hidden md:block"></div>
        <button onClick={playerView.onClose} className="text-neutral-400 hover:text-white">
          <AiOutlineClose size={30} />
        </button>
      </div>

      {/* Gambar Album Besar - MENGGUNAKAN imageUrl */}
      <div className="flex-1 flex items-center justify-center relative w-full max-h-[50vh] aspect-square mx-auto mb-8 bg-neutral-800 rounded-md shadow-2xl overflow-hidden">
        <Image 
          src={imageUrl} // Gunakan URL publik yang sudah dikonstruksi
          fill 
          alt="Cover" 
          className="object-cover"
        />
      </div>

      {/* Info Lagu & Like */}
      <div className="flex flex-col items-start w-full mb-8">
        <div className="flex w-full justify-between items-center">
            <div className="flex flex-col gap-y-1 overflow-hidden">
                <p className="text-white text-2xl font-bold truncate">
                {song.title}
                </p>
                <p className="text-neutral-400 text-lg truncate">
                {song.author}
                </p>
            </div>
            <LikeButton songId={song.id} />
        </div>
      </div>

      {/* --- TIMELINE MUSIK (Fitur Baru) --- */}
      <div className="w-full flex flex-col gap-y-2 mb-8">
        <Slider 
          value={currentTime} 
          // Max value adalah total durasi lagu
          max={duration} 
          // Panggil fungsi onSeek (pindah waktu)
          onChange={onSeek} 
        />
        <div className="flex justify-between text-xs text-neutral-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      {/* ------------------------------------- */}


      {/* Kontrol Utama */}
      <div className="flex flex-col items-center justify-center gap-y-6 w-full">
        <div className="flex items-center justify-center gap-x-10 w-full">
            <AiFillStepBackward onClick={onPrevious} size={40} className="text-neutral-400 cursor-pointer hover:text-white transition" />
            <div onClick={togglePlay} className="h-20 w-20 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer hover:scale-110 transition">
              <Icon size={40} className="text-black" />
            </div>
            <AiFillStepForward onClick={onNext} size={40} className="text-neutral-400 cursor-pointer hover:text-white transition" />
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-x-2 w-full max-w-[300px] mt-4">
            <VolumeIcon onClick={toggleMute} className="cursor-pointer" size={24} />
            <Slider value={volume} onChange={onChangeVolume} />
        </div>
      </div>
    </div>
   );
}
 
export default FullScreenPlayer;
