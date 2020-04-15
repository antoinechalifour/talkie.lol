import React from "react";
import { PageLayout, VideoArea, ChatArea, VideoGrid } from "./styles";

export interface PocLayoutProps {}

export const PocLayout: React.FC<PocLayoutProps> = () => {
  return (
    <PageLayout>
      <VideoArea>
        <VideoGrid>
          <div>
            <div>video1</div>
          </div>
          <div>
            <div>video2</div>
          </div>
          <div>
            <div>video3</div>
          </div>
          <div>
            <div>video4</div>
          </div>
        </VideoGrid>
      </VideoArea>

      <ChatArea />
    </PageLayout>
  );
};
