import { useCallback, useReducer } from "react";

import { RemotePeer } from "../RemotePeer";
import { useSignaling } from "./useSignaling";
import { useMedia } from "./useMedia";

interface State {
  localMediaStream: MediaStream | null;
  remotePeers: RemotePeer[];
}

type Action =
  | {
      type: "PEER_CONNECTED";
      peer: RemotePeer;
    }
  | {
      type: "PEER_DISCONNECTED";
      peer: RemotePeer;
    }
  | {
      type: "LOCAL_MEDIA_STREAM_ADDED";
      mediaStream: MediaStream;
    }
  | {
      type: "LOCAL_MEDIA_STREAM_REMOVED";
    };

const initialState: State = {
  localMediaStream: null,
  remotePeers: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "PEER_CONNECTED":
      if (state.remotePeers.find((peer) => peer.id() === action.peer.id())) {
        return state;
      }

      return {
        ...state,
        remotePeers: [...state.remotePeers, action.peer],
      };

    case "PEER_DISCONNECTED":
      return {
        ...state,
        remotePeers: state.remotePeers.filter((peer) => !peer.is(action.peer)),
      };

    case "LOCAL_MEDIA_STREAM_ADDED":
      return {
        ...state,
        localMediaStream: action.mediaStream,
      };

    case "LOCAL_MEDIA_STREAM_REMOVED":
      return {
        ...state,
        localMediaStream: null,
      };
  }
};

export const useRtc = (slug: string) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // @ts-ignore
  window.DEBUG = () => console.log(state);

  const addLocalStream = useCallback(
    (mediaStream: MediaStream) =>
      dispatch({
        type: "LOCAL_MEDIA_STREAM_ADDED",
        mediaStream,
      }),
    []
  );

  const removeLocalStream = useCallback(
    () => dispatch({ type: "LOCAL_MEDIA_STREAM_REMOVED" }),
    []
  );

  const onRemotePeerConnected = useCallback(
    (peer: RemotePeer) => dispatch({ type: "PEER_CONNECTED", peer }),
    []
  );
  const onRemotePeerDisconnected = useCallback(
    (peer: RemotePeer) => dispatch({ type: "PEER_DISCONNECTED", peer }),
    []
  );

  useMedia({
    remotePeers: state.remotePeers,
    localMediaStream: state.localMediaStream,
  });

  useSignaling({
    spaceSlug: slug,
    remotePeers: state.remotePeers,
    onRemotePeerConnected,
    onRemotePeerDisconnected,
  });

  return {
    localStream: state.localMediaStream,
    remotePeers: state.remotePeers,
    addLocalStream,
    removeLocalStream,
  };
};
