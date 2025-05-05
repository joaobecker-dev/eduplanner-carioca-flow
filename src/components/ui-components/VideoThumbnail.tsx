
import React from 'react';
import { Play } from 'lucide-react';

interface VideoThumbnailProps {
  thumbnailUrl: string;
  title: string;
  onClick?: () => void;
  className?: string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  thumbnailUrl,
  title,
  onClick,
  className = ''
}) => {
  return (
    <div 
      className={`relative cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-md aspect-video">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black bg-opacity-60 text-white group-hover:bg-edu-blue-600 group-hover:bg-opacity-90 transition-colors">
            <Play size={24} fill="white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoThumbnail;
