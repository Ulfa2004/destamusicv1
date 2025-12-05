import { useSupabaseClient } from '@supabase/auth-helpers-react';

const useLoadImage = (imagePath: string) => {
  const supabaseClient = useSupabaseClient();

  if (!imagePath) {
    return null;
  }

  // Mendapatkan URL publik secara aman dan pasti
  const { data: imageData } = supabaseClient
    .storage
    .from('images') // Pastikan nama bucket kamu 'images'
    .getPublicUrl(imagePath);

  return imageData.publicUrl;
};

export default useLoadImage;
