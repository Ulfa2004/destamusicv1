// components/CreatePlaylistModal.tsx (Kerangka)

'use client';

import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
// Import hook dan komponen lain yang dibutuhkan:
import useCreatePlaylistModal from '@/hooks/useCreatePlaylistModal'; 
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const CreatePlaylistModal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const createPlaylistModal = useCreatePlaylistModal();
  const supabaseClient = useSupabaseClient();
  
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: { title: '' },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      createPlaylistModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      // --- LOGIKA UTAMA MEMBUAT PLAYLIST DI SINI ---
      const { data: { user } } = await supabaseClient.auth.getUser();

      if (!user) {
        toast.error('Anda harus login.');
        return;
      }

      const { error: dbError } = await supabaseClient
        .from('playlists')
        .insert([{ title: values.title, user_id: user.id }]);

      if (dbError) {
        return toast.error(dbError.message);
      }
      
      router.refresh(); // Refresh untuk menampilkan playlist baru
      toast.success('Playlist berhasil dibuat!');
      reset();
      createPlaylistModal.onClose();

    } catch (error) {
      toast.error('Terjadi kesalahan saat membuat playlist.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Buat Playlist Baru"
      description="Masukkan nama untuk playlist Anda."
      isOpen={createPlaylistModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Nama Playlist"
        />
        <Button disabled={isLoading} type="submit">
          Buat
        </Button>
      </form>
    </Modal>
  );
};

export default CreatePlaylistModal;
