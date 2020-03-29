import React from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import { history } from "./utils/history";
import { CreateSpaceView } from "./components/CreateSpace/CreateSpaceView";
import {JoinSpaceView} from "./components/JoinSpace/JoinSpaceView";

export const App: React.FC = () => (
  <Router history={history}>
    <Switch>
      <Route
        path="/space/:spaceSlug"
        exact
        render={({ match }) => <JoinSpaceView spaceSlug={match.params.spaceSlug} />}
      />

      <Route path="/create" exact render={() => <CreateSpaceView />} />

      <Redirect to="/create" />
    </Switch>
  </Router>
);
