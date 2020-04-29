import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi } from "@fortawesome/free-solid-svg-icons";

import { useConnectionType } from "../../../hooks/useConnectionType";
import { getLabelForConnectionType } from "../../../utils/connectionType";
import { HeaderLayout, ConnectionTypeIcon } from "./styles";

export const Header: React.FC = () => {
  const { connectionType } = useConnectionType();

  return (
    <HeaderLayout>
      <h1>Talkie.LOL</h1>

      {connectionType !== "unknown" && (
        <ConnectionTypeIcon
          aria-label={getLabelForConnectionType(connectionType)}
          connectionType={connectionType}
        >
          <FontAwesomeIcon icon={faWifi} />
        </ConnectionTypeIcon>
      )}
    </HeaderLayout>
  );
};
