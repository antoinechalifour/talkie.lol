import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import { history } from "./utils/history";
import { JoinSpacePage } from "./components/JoinSpacePage/JoinSpacePage";
import { CreateSpacePage } from "./components/CreateSpacePage/CreateSpacePage";
import { ScanSpacePage } from "./components/ScanSpacePage/ScanSpacePage";

export const App: React.FC = () => (
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
);
