import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import { history } from "./utils/history";
import { CreateSpace } from "./components/CreateSpace/CreateSpace";
import { JoinSpace } from "./components/Space/JoinSpace";
import { ScanSpace } from "./components/ScanSpace/ScanSpace";

export const App: React.FC = () => (
  <Router history={history}>
    <Switch>
      <Route
        path="/space/:spaceSlug"
        exact
        render={({ match }) => <JoinSpace spaceSlug={match.params.spaceSlug} />}
      />

      <Route path="/create" exact render={() => <CreateSpace />} />

      <Route path="/join" exact render={() => <ScanSpace />} />

      <Redirect to="/create" />
    </Switch>
  </Router>
);
