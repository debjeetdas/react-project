import React, { useState, useEffect } from "react";
import "./UpcomingMovies.css";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";

// Upcoming Movies Grid Styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    // Scroll Bar Logic
    overflow: "scroll",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: "nowrap",
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
}));

export default function UpcomingMovies() {
  const classes = useStyles();
  const [upComingMoviesList, setUpComingMoviesList] = useState([]);

  useEffect(() => {
    upComingMoviesData();
  }, []);

  // Upcoming Movies API Call Logic
  const upComingMoviesData = () => {
    fetch("http://localhost:8085/api/v1/movies", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.message) {
          setUpComingMoviesList(data.movies);
        } else {
          alert(data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    // Upcoming Movies Grid List
    <div className={classes.root}>
      <GridList className={classes.gridList} cellHeight={250} cols={6}>
        {upComingMoviesList &&
          upComingMoviesList.map((upComing) => (
            <GridListTile key={upComing.id}>
              <img src={upComing.poster_url} alt={upComing.title} />
              <GridListTileBar
                title={upComing.title}
                classes={{
                  root: classes.titleBar,
                }}
              />
            </GridListTile>
          ))}
      </GridList>
    </div>
  );
}
