import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project-id.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadAsset(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = `uploads/${fileName}`

  const { data, error } = await supabase.storage
    .from('assets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw error
  }

  const { data: urlData } = supabase.storage
    .from('assets')
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

export async function deleteAsset(url: string): Promise<boolean> {
  if (!url) return false;
  
  try {
    const bucketMarker = "/storage/v1/object/public/assets/";
    let filePath = "";

    if (url.includes(bucketMarker)) {
      filePath = url.split(bucketMarker)[1];
    } else if (url.includes("/assets/")) {
      filePath = url.split("/assets/")[1];
    } else if (!url.startsWith("http")) {
      filePath = url;
    }

    if (!filePath) return false;

    // Remove query parameters if present
    filePath = filePath.split("?")[0];
    filePath = decodeURIComponent(filePath);

    const { error } = await supabase.storage
      .from("assets")
      .remove([filePath]);

    if (error) {
      console.error("Failed to delete asset from storage:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error in deleteAsset:", err);
    return false;
  }
}

export type StorageAsset = {
  name: string;
  url: string;
  size?: number;
  created_at?: string;
  is_video: boolean;
};

export async function listAssets(): Promise<StorageAsset[]> {
  try {
    const { data: uploadFiles } = await supabase.storage
      .from('assets')
      .list('uploads', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });

    const { data: rootFiles } = await supabase.storage
      .from('assets')
      .list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });

    const results: StorageAsset[] = [];
    const seenUrls = new Set<string>();

    if (uploadFiles && uploadFiles.length > 0) {
      uploadFiles.forEach((f) => {
        if (f.name && f.name !== '.emptyFolderPlaceholder') {
          const path = `uploads/${f.name}`;
          const url = supabase.storage.from('assets').getPublicUrl(path).data.publicUrl;
          if (!seenUrls.has(url)) {
            seenUrls.add(url);
            const isVideo = !!f.name.match(/\.(mp4|webm|mov|ogg|avi|mkv)$/i);
            results.push({
              name: f.name,
              url,
              size: f.metadata?.size || 0,
              created_at: f.created_at || f.updated_at || undefined,
              is_video: isVideo,
            });
          }
        }
      });
    }

    if (rootFiles && rootFiles.length > 0) {
      rootFiles.forEach((f) => {
        if (f.name && f.name !== 'uploads' && f.name !== '.emptyFolderPlaceholder') {
          const url = supabase.storage.from('assets').getPublicUrl(f.name).data.publicUrl;
          if (!seenUrls.has(url)) {
            seenUrls.add(url);
            const isVideo = !!f.name.match(/\.(mp4|webm|mov|ogg|avi|mkv)$/i);
            results.push({
              name: f.name,
              url,
              size: f.metadata?.size || 0,
              created_at: f.created_at || f.updated_at || undefined,
              is_video: isVideo,
            });
          }
        }
      });
    }

    return results;
  } catch (err) {
    console.error('Error listing assets:', err);
    return [];
  }
}
