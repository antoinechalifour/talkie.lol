import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import { history } from "./utils/history";
import { isBrowserSupported } from "./utils/featureDetection";
import { CreateSpacePage } from "./components/CreateSpacePage/CreateSpacePage";
import { ErrorPage } from "./components/ErrorPage/ErrorPage";

const JoinSpacePage = React.lazy(() =>
  import("./components/JoinSpacePage/JoinSpacePage").then((mod) => ({
    default: mod.JoinSpacePage,
  }))
);

const ScanSpacePage = React.lazy(() =>
  import("./components/ScanSpacePage/ScanSpacePage").then((mod) => ({
    default: mod.ScanSpacePage,
  }))
);

export const App: React.FC = () => {
  const isSupported = isBrowserSupported();

  if (!isSupported) return <ErrorPage />;

  return (
    <React.Suspense fallback={null}>
      <Router history={history}>
        <Switch>
          <Route
            path="/space/:spaceSlug"
            exact
            render={({ match }) => (
              <JoinSpacePage spaceSlug={match.params.spaceSlug} />
            )}
          />

          <Route path="/create" exact render={() => <CreateSpacePage />} />

          <Route path="/join" exact render={() => <ScanSpacePage />} />

          <Redirect to="/create" />
        </Switch>
      </Router>
    </React.Suspense>
  );
};
