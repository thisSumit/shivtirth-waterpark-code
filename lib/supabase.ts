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
  
  // Extract file path from Supabase storage URL
  // Format: https://[project].supabase.co/storage/v1/object/public/assets/[filePath]
  const bucketMarker = "/storage/v1/object/public/assets/";
  if (url.includes(bucketMarker)) {
    const filePath = url.split(bucketMarker)[1];
    if (filePath) {
      const { error } = await supabase.storage
        .from("assets")
        .remove([filePath]);
      if (error) {
        console.error("Failed to delete asset from storage:", error);
        return false;
      }
      return true;
    }
  }
  return false;
}
