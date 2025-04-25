import { supabase } from './client';

export const uploadAvatar = async (userId: string, uri: string) => {
  try {
    console.log("Starting uploadAvatar function with userId:", userId);

    try {
      const fileAccessCheck = await fetch(uri);
      if (!fileAccessCheck.ok) {
        throw new Error(`Cannot access image file: ${fileAccessCheck.status} ${fileAccessCheck.statusText}`);
      }
      console.log("File access check passed");
    } catch (accessError) {
      console.error("File access error:", accessError);
      if (accessError instanceof Error) {
        throw new Error(`File access error: ${accessError.message}`);
      } else {
        throw new Error('File access error: Unknown error occurred');
      }
    }
    
    // Convert image to blob
    const response = await fetch(uri);
    const blob = await response.blob();
    console.log("File converted to blob, size:", blob.size);
    
    // Generate unique filename
    const fileExt = uri.split('.').pop();
    const filename = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${filename}`;
    console.log("Uploading to Supabase path:", filePath);

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('user-avatars')
      .upload(filePath, blob, {
        contentType: `image/${fileExt}`,
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error("Supabase storage error:", error);
      throw new Error(`Supabase upload error: ${error.message}`);
    }
    
    if (!data || !data.path) {
      throw new Error('Upload succeeded but path is missing from response');
    }
    
    console.log("Upload successful, data:", data);

    // Get public URL 
    const publicUrlResponse = supabase.storage
      .from('user-avatars')
      .getPublicUrl(data.path);
    
    if (!publicUrlResponse || !publicUrlResponse.data || !publicUrlResponse.data.publicUrl) {
      throw new Error('Failed to get public URL or it is missing from the response');
    }
    
    console.log("Public URL retrieved:", publicUrlResponse.data.publicUrl);
    return publicUrlResponse.data.publicUrl;
  } catch (error) {
    console.error("Avatar upload failed:", error);
    throw error; // Re-throw to handle in the calling function
  }
};
