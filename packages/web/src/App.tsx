import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import { history } from "./utils/history";
import { CreateSpacePage } from "./components/CreateSpacePage/CreateSpacePage";

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

export const App: React.FC = () => (
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
