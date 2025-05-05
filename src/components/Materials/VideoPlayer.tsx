
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  embedUrl: string;
  title?: string;
}

/**
 * VideoPlayer component for displaying embedded videos
 * Uses an iframe with proper accessibility and security settings
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({ embedUrl, title = 'Video content' }) => {
  // Validate URL before rendering to prevent security issues
  const isValidUrl = React.useMemo(() => {
    try {
      // Basic validation for YouTube and Vimeo URLs
      const url = new URL(embedUrl);
      return (
        url.protocol === 'https:' &&
        (url.hostname.includes('youtube.com') ||
         url.hostname.includes('youtu.be') ||
         url.hostname.includes('vimeo.com') ||
         url.hostname.includes('player.vimeo.com'))
      );
    } catch (e) {
      return false;
    }
  }, [embedUrl]);

  if (!embedUrl || !isValidUrl) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Invalid video URL. Please check the material source.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="aspect-video rounded-md overflow-hidden w-full bg-black">
      <iframe 
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer"
        aria-label={`Embedded video: ${title}`}
      />
    </div>
  );
};

export default VideoPlayer;
