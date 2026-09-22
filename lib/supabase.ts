import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project-id.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function uploadAsset(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const rawFileName = file.name || "uploaded-file";
  const nameParts = rawFileName.split('.');
  const ext = nameParts.length > 1 ? nameParts.pop() : '';
  const baseName = nameParts.join('.').replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const fileName = ext ? `${baseName}_${timestamp}.${ext}` : `${baseName}_${timestamp}`;
  const filePath = `uploads/${fileName}`;

  // 1. Direct Client Upload to Supabase Storage (Fastest: Browser -> Supabase direct)
  try {
    const { data, error } = await supabase.storage
      .from('assets')
      .upload(filePath, file, {
        contentType: file.type || 'video/mp4',
        cacheControl: '3600',
        upsert: true,
      })

    if (!error && data) {
      if (onProgress) onProgress(100);
      const { data: urlData } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath)
      return urlData.publicUrl
    }

    if (error) {
      console.warn("Direct upload error, trying signed URL upload:", error.message)
    }
  } catch (e: any) {
    console.warn("Direct upload failed, trying signed URL fallback...", e)
  }

  // 2. Fast Signed URL Upload (Direct browser upload using admin-generated signed token)
  try {
    const signedRes = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName }),
    })

    const signedJson = await signedRes.json()

    if (signedRes.status === 409 || (signedJson.error && signedJson.error.includes("already exists"))) {
      throw new Error(signedJson.error || `A file named "${fileName}" already exists in storage. Please rename your file before uploading.`)
    }

    if (signedRes.ok && signedJson.signedUrl) {
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', signedJson.signedUrl)
        if (file.type) {
          xhr.setRequestHeader('Content-Type', file.type)
        }

        if (xhr.upload && onProgress) {
          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable) {
              const percent = Math.round((evt.loaded / evt.total) * 100)
              onProgress(percent)
            }
          }
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error(`Signed upload failed with status ${xhr.status}`))
          }
        }
        xhr.onerror = () => reject(new Error('Network error during signed upload'))
        xhr.send(file)
      })

      if (onProgress) onProgress(100);
      return signedJson.publicUrl
    }
  } catch (e: any) {
    if (e.message && (e.message.includes("already exists") || e.message.includes("Please rename"))) {
      throw e;
    }
    console.warn("Signed URL upload failed, trying server endpoint fallback...", e)
  }

  // 3. Fallback: Next.js API FormData upload with XHR progress
  return new Promise<string>((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/upload')

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const percent = Math.round((evt.loaded / evt.total) * 100)
          onProgress(percent)
        }
      }
    }

    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText)
        if (xhr.status === 409 || (json.error && json.error.includes("already exists"))) {
          reject(new Error(json.error || `A file named "${fileName}" already exists in storage.`))
        } else if (xhr.status >= 200 && xhr.status < 300 && json.url) {
          if (onProgress) onProgress(100)
          resolve(json.url)
        } else {
          reject(new Error(json.error || 'Server upload failed'))
        }
      } catch (err) {
        reject(new Error('Invalid response from upload server'))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(formData)
  })
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
