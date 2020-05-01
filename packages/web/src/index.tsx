import "reset.css";
import "react-toastify/dist/ReactToastify.css";
import "@reach/tooltip/styles.css";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

import { App } from "./App";
import { AnonymousClient } from "./components/AnonymousClient/AnonymousClient";
import { Theme } from "./components/Theme/Theme";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <Theme>
      <AnonymousClient>
        <App />
      </AnonymousClient>
    </Theme>
  </React.StrictMode>,
  document.getElementById("root")
);

toast.configure({
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: () =>
    toast.info(
      "An update is available! Please refresh this site to get the latest features.",
      {
        onClick: () => window.location.reload(),
      }
    ),
});
