
/**
 * Utility to extract and process YouTube and Vimeo video metadata
 */

export type VideoMetadata = {
  platform: 'youtube' | 'vimeo' | 'unknown';
  embedUrl: string | null;
  thumbnailUrl: string | null;
};

/**
 * Extracts video metadata from YouTube or Vimeo URLs
 * @param url The original video URL
 * @returns VideoMetadata object with platform, embedUrl and thumbnailUrl
 */
export function extractVideoMetadata(url: string): VideoMetadata {
  // Default return value
  const defaultMetadata: VideoMetadata = {
    platform: 'unknown',
    embedUrl: null,
    thumbnailUrl: null
  };

  if (!url) return defaultMetadata;

  // Try to extract YouTube video ID
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const youtubeMatch = url.match(youtubeRegex);

  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    return {
      platform: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  // Try to extract Vimeo video ID
  const vimeoRegex = /(?:vimeo\.com\/(?:video\/|)(\d+))/i;
  const vimeoMatch = url.match(vimeoRegex);

  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      platform: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
      thumbnailUrl: `https://vumbnail.com/${videoId}.jpg` // Vimeo thumbnail service
    };
  }

  // If no match, return original URL as is
  return {
    ...defaultMetadata,
    embedUrl: url
  };
}
