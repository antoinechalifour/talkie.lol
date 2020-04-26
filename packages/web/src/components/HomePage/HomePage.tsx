import React from "react";
import { Switch, Route } from "react-router-dom";

import { HomeLayout } from "../HomeLayout/HomeLayout";

const ScanSpaceView = React.lazy(() =>
  import("./ScanSpaceView/ScanSpaceView").then((mod) => ({
    default: mod.ScanSpaceView,
  }))
);

const CreateSpaceView = React.lazy(() =>
  import("./CreateSpaceView/CreateSpaceView").then((mod) => ({
    default: mod.CreateSpaceView,
  }))
);

export const HomePage: React.FC = () => (
  <HomeLayout>
    <React.Suspense fallback={null}>
      <Switch>
        <Route exact path="/home/join" render={() => <ScanSpaceView />} />

        <Route render={() => <CreateSpaceView />} />
      </Switch>
    </React.Suspense>
  </HomeLayout>
);
