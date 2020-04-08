import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeadphones } from "@fortawesome/free-solid-svg-icons";

import { SoundIcon } from "./styles";

export interface AudioStreamBoxProps {
  mediaStream: MediaStream;
}

export const AudioStreamBox: React.FC<AudioStreamBoxProps> = ({
  mediaStream,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.srcObject = mediaStream;
  }, [mediaStream]);

  return (
    <SoundIcon>
      <FontAwesomeIcon icon={faHeadphones} />
      <audio autoPlay={true} />
    </SoundIcon>
  );
};
