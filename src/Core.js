import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Address } from "./Address";

export const Core = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/:pasteAddress">
            {({ match }) =>
              match && <Address pasteAddress={match.params.pasteAddress} />
            }
          </Route>
          <Route path="/">
            <Address pasteAddress={""} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};
