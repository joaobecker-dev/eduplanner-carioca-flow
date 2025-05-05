
import React from 'react';
import { extractVideoMetadata } from '@/lib/utils/extractVideoMetadata';

interface VideoEmbedProps {
  url: string;
  title?: string;
  className?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1';
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ 
  url, 
  title = 'Video', 
  className = '',
  aspectRatio = '16:9'
}) => {
  const { embedUrl } = extractVideoMetadata(url);
  
  if (!embedUrl) {
    return <div className="text-red-500">URL de vídeo inválida</div>;
  }

  // Define aspect ratio container classes
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '4:3':
        return 'pb-[75%]'; // 4:3 aspect ratio
      case '1:1':
        return 'pb-[100%]'; // square aspect ratio
      case '16:9':
      default:
        return 'pb-[56.25%]'; // 16:9 aspect ratio
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className={`relative w-full ${getAspectRatioClass()}`}>
        <iframe
          src={embedUrl}
          title={title}
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-md border border-gray-200"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
};

export default VideoEmbed;
