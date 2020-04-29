import "reset.css";
import "react-toastify/dist/ReactToastify.css";
import "@reach/tooltip/styles.css";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";

import { App } from "./App";
import * as serviceWorker from "./serviceWorker";
import { AnonymousClient } from "./components/AnonymousClient/AnonymousClient";

ReactDOM.render(
  <React.StrictMode>
    <AnonymousClient>
      <App />
    </AnonymousClient>
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
