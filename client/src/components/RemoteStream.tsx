import React, { useEffect, useRef } from "react";
import { RemoteStream as RemoteStreamType } from "../features/stream/streamSlice";

interface Props {
  remoteStream: RemoteStreamType;
}

const RemoteStream: React.FC<Props> = ({ remoteStream }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (remoteStream) {
      ref.current!.srcObject = remoteStream.stream;
    }
  }, [remoteStream]);

  return <video playsInline autoPlay ref={ref} />;
};

export default RemoteStream;
