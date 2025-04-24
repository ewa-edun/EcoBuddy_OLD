import { supabase } from './client';

export const uploadAvatar = async (userId: string, uri: string) => {
  try {
    // Convert image to blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Generate unique filename
    const filename = `avatar_${userId}_${Date.now()}.jpg`;
    const filePath = `${userId}/${filename}`;

    // Upload to Supabase
    const { error } = await supabase.storage
    .from('user-avatars')
    .upload(filePath, blob, {
      cacheControl: '3600',
      upsert: true
    });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};