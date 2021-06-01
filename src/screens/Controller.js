import React, { Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "../screens/home/Home";
import Details from "../screens/details/Details";
import BookShow from "../screens/bookshow/BookShow";
import Confirmation from "../screens/confirmation/Confirmation";

export default function Controller() {
  const baseUrl = "/api/v1/";
  return (
    <Fragment>
      <Router>
        <div>
          <Route exact path="/" render={() => <Home />} />
          <Route path="/movie/:id" render={() => <Details />} />
          <Route
            path="/bookshow/:id"
            render={(props) => <BookShow {...props} baseUrl={baseUrl} />}
          />
          <Route
            path="/confirm/:id"
            render={(props) => <Confirmation {...props} baseUrl={baseUrl} />}
          />
        </div>
      </Router>
    </Fragment>
  );
}
