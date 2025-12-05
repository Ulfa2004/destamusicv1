"use client";

import Image from "next/image";
import { AiOutlineClose, AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

import { Song } from "@/types";
import usePlayerView from "@/hooks/usePlayerView";
import Slider from "./Slider";
import LikeButton from "./LikeButton";

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
}

const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({
  song,
  isPlaying,
  volume,
  togglePlay,
  toggleMute,
  onNext,
  onPrevious,
  onChangeVolume
}) => {
  const playerView = usePlayerView();
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

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

      {/* Gambar Album Besar */}
      <div className="flex-1 flex items-center justify-center relative w-full max-h-[50vh] aspect-square mx-auto mb-8 bg-neutral-800 rounded-md shadow-2xl overflow-hidden">
        <Image 
          src={song.image_path || '/images/liked.png'} 
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
