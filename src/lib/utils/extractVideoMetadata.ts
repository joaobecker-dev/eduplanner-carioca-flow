
/**
 * Utility to extract metadata from video URLs (YouTube and Vimeo)
 */

export type VideoMetadata = {
  platform: 'youtube' | 'vimeo' | 'unknown';
  embedUrl: string | null;
  thumbnailUrl: string | null;
};

/**
 * Extract video metadata from a URL
 * @param url The video URL
 * @returns VideoMetadata object with platform, embedUrl, and thumbnailUrl
 */
export function extractVideoMetadata(url: string): VideoMetadata {
  if (!url) {
    return { platform: 'unknown', embedUrl: null, thumbnailUrl: null };
  }

  // YouTube detection
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const youtubeMatch = url.match(youtubeRegex);
  
  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    return {
      platform: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // Vimeo detection
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?))/i;
  const vimeoMatch = url.match(vimeoRegex);
  
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      platform: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
      // Vimeo requires API access for thumbnails, but we can use a service that doesn't require authentication
      thumbnailUrl: `https://vumbnail.com/${videoId}.jpg`,
    };
  }

  return { platform: 'unknown', embedUrl: null, thumbnailUrl: null };
}
