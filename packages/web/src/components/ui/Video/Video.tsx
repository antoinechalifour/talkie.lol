import React, {
  forwardRef,
  HTMLProps,
  Ref,
  useCallback,
  useState,
} from "react";

export type VideoProps = HTMLProps<HTMLVideoElement>;

export const Video = forwardRef(
  (props: VideoProps, ref: Ref<HTMLVideoElement>) => {
    const [isCoverMode, setCoverMode] = useState(true);
    const style = {
      ...props.style,
      objectFit: isCoverMode ? ("cover" as const) : ("contain" as const),
    };

    const onDoubleClick = useCallback(() => {
      setCoverMode((isCoverMode) => !isCoverMode);
    }, []);

    return (
      <video {...props} style={style} onDoubleClick={onDoubleClick} ref={ref} />
    );
  }
);
