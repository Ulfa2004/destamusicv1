"use client";

import { useEffect, useState } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import useSound from 'use-sound';

import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import usePlayerView from "@/hooks/usePlayerView";

import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import Slider from "./Slider";
import FullScreenPlayer from "./FullScreenPlayer";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ 
  song, 
  songUrl
}) => {
  const player = usePlayer();
  const playerView = usePlayerView();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  }

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  }

  // --- SETTING PEMUTAR MUSIK ---
  const [play, { pause, sound }] = useSound(
    songUrl,
    { 
      volume: volume,
      onplay: () => setIsPlaying(true),
      onend: () => {
        setIsPlaying(false);
        onPlayNext();
      },
      onpause: () => setIsPlaying(false),
      format: ['mp3'],
      html5: true    // <--- INI KUNCI UTAMANYA! (Wajib ada biar notif muncul)
    }
  );

  useEffect(() => {
    sound?.play();
    
    return () => {
      sound?.unload();
    }
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  }

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  }

  // --- BAGIAN NOTIFIKASI HP (MEDIA SESSION) ---
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.author,
        artwork: [
          { src: song.image_path || '/images/liked.png', sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', handlePlay);
      navigator.mediaSession.setActionHandler('pause', handlePlay);
      navigator.mediaSession.setActionHandler('previoustrack', onPlayPrevious);
      navigator.mediaSession.setActionHandler('nexttrack', onPlayNext);
    }
  }, [song, handlePlay, onPlayNext, onPlayPrevious]);

  // UPDATE STATUS PLAY/PAUSE DI NOTIFIKASI
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  return ( 
    <div className="grid grid-cols-2 md:grid-cols-3 h-full">
        <div className="flex w-full justify-start">
          <div className="flex items-center gap-x-4">
            <div 
              onClick={playerView.onOpen}
              className="cursor-pointer hover:opacity-75 transition"
            >
              <MediaItem data={song} />
            </div>
            <LikeButton songId={song.id} />
          </div>
        </div>

        <div className="flex md:hidden col-auto w-full justify-end items-center">
          <div 
            onClick={handlePlay} 
            className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={30} className="text-black" />
          </div>
        </div>

        <div className="hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={30} 
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <div 
            onClick={handlePlay} 
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={30} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={30} 
            className="text-neutral-400 cursor-pointer hover:text-white transition" 
          />
        </div>

        <div className="hidden md:flex w-full justify-end pr-2">
          <div className="flex items-center gap-x-2 w-[120px]">
            <VolumeIcon onClick={toggleMute} className="cursor-pointer" size={34} />
            <Slider value={volume} onChange={(value) => setVolume(value)} />
          </div>
        </div>

        <FullScreenPlayer 
          song={song}
          songUrl={songUrl}
          isPlaying={isPlaying}
          volume={volume}
          togglePlay={handlePlay}
          toggleMute={toggleMute}
          onNext={onPlayNext}
          onPrevious={onPlayPrevious}
          onChangeVolume={setVolume}
        />
      </div>
   );
}
 
export default PlayerContent;
