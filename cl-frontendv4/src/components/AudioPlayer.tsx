import React, { useRef, useState } from "react";

interface AudioPlayerProps {
  signedUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ signedUrl }) => {
  return (
    <div>
      <audio controls>
        <source src={signedUrl} type="audio/ogg" />
      </audio>
    </div>
  );
};

export default AudioPlayer;
