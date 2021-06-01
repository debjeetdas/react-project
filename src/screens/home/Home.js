import React, { Fragment } from "react";
import "./Home.css";
import Header from "../../common/header/Header";
import UpcomingMovies from "../upcomingmovies/UpcomingMovies";
import ReleasedMovies from "../releasedmovies/ReleasedMovies";

export default function Home() {
  return (
    <Fragment>
      {/* Header Component */}
      <div>
        <Header />
      </div>
      {/* Upcoming Movies Heading */}
      <div className="sub-header">
        <div className="sub-header-heading">Upcoming Movies</div>
      </div>
      {/* Upcoming Movies Component */}
      <div>
        <UpcomingMovies />
      </div>
      {/* Released Movies Component */}
      <div>
        <ReleasedMovies />
      </div>
    </Fragment>
  );
}
