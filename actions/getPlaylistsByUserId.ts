// actions/getPlaylistsByUserId.ts

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Playlist } from '@/types';

export const getPlaylistsByUserId = async (): Promise<Playlist[]> => {
  const supabase = createServerComponentClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return []; // Jika user belum login, kembalikan array kosong
  }

  const { data, error } = await supabase
    .from('playlists')
    .select('id, title, user_id, image_path') // Pilih kolom yang relevan
    .eq('user_id', user.id) // Filter hanya playlist milik user yang sedang login
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }
  
  // Karena tabel 'playlists' sudah dibuat, kita bisa menganggap data yang kembali sesuai.
  return (data as any) || [];
};

export default getPlaylistsByUserId;
