import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import { history } from "./utils/history";
import { isBrowserSupported } from "./utils/featureDetection";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { BrowserNotSupportedPage } from "./components/BrowserNotSupportedPage/BrowserNotSupportedPage";
import { MobileNotSupportedPage } from "./components/MobileNotSupportedPage/MobileNotSupportedPage";

const JoinSpacePage = React.lazy(() =>
  import("./components/JoinSpacePage/JoinSpacePage").then((mod) => ({
    default: mod.JoinSpacePage,
  }))
);

const HomePage = React.lazy(() =>
  import("./components/HomePage/HomePage").then((mod) => ({
    default: mod.HomePage,
  }))
);

export const App: React.FC = () => {
  const isSupported = isBrowserSupported();
  const isLargeEnough = useMediaQuery("(min-width: 1024px)");

  if (!isSupported) return <BrowserNotSupportedPage />;
  if (!isLargeEnough) return <MobileNotSupportedPage />;

  return (
    <React.Suspense fallback={null}>
      <Router history={history}>
        <Switch>
          <Route path="/home" render={() => <HomePage />} />

          <Route
            path="/space/:spaceSlug"
            exact
            render={({ match }) => (
              <JoinSpacePage spaceSlug={match.params.spaceSlug} />
            )}
          />

          <Redirect to="/home" />
        </Switch>
      </Router>
    </React.Suspense>
  );
};
