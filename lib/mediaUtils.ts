/**
 * Utility for accelerating Supabase media & web assets
 */

export function checkIsVideoUrl(url?: string): boolean {
  if (!url) return false;
  const clean = url.toLowerCase().split('?')[0];
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.m4v') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.avi') ||
    clean.endsWith('.mkv') ||
    clean.includes('/video/')
  );
}

export function getOptimizedMediaUrl(
  url?: string,
  options?: { width?: number; quality?: number }
): string {
  if (!url) return '';
  const cleanUrl = url.trim();

  // Supabase Image Transformation route optimization
  if (cleanUrl.includes('.supabase.co/storage/v1/object/public/')) {
    if (!checkIsVideoUrl(cleanUrl)) {
      const width = options?.width || 800;
      const quality = options?.quality || 75;
      const transformed = cleanUrl.replace(
        '/storage/v1/object/public/',
        '/storage/v1/render/image/public/'
      );
      return `${transformed}?width=${width}&quality=${quality}`;
    }
  }

  return cleanUrl;
}
