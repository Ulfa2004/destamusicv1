// actions/getPlaylistsByUserId.ts

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Playlist } from '@/types'; 

export const getPlaylistsByUserId = async (): Promise<Playlist[]> => {
  const supabase = createServerComponentClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return []; 
  }

  const { data, error } = await supabase
    .from('playlists')
    .select('id, title, user_id, image_path') 
    .eq('user_id', user.id) 
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }
  
  return (data as any) || [];
};

export default getPlaylistsByUserId;

