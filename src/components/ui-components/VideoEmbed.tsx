
import React from 'react';

interface VideoEmbedProps {
  url: string;
  title: string;
  className?: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({
  url,
  title,
  className = ''
}) => {
  return (
    <div className={`aspect-video rounded-md overflow-hidden ${className}`}>
      <iframe 
        src={url}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default VideoEmbed;
