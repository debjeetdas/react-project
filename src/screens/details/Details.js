import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./Details.css";
import Header from "../../common/header/Header";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import YouTube from "react-youtube";

// Artist Grid List Styles
const artistStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: "wrap",
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
}));

export default function Details() {
  const classes = artistStyles();
  const [moviesBasedOnIdList, setMoviesBasedOnIdList] = useState({});
  const [rating] = useState([1, 2, 3, 4, 5]);
  const { id } = useParams();

  useEffect(() => {
    moviesBasedOnIdData();
  }, []);

  // Movie Details API Call Logic
  const moviesBasedOnIdData = () => {
    fetch(`http://localhost:8085/api/v1/movies/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.message) {
          setMoviesBasedOnIdList(data);
        } else {
          alert(data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getParams = (param) => {
    let url = new URL(param);
    return url.searchParams.get("v");
  };

  const onRatingClick = (rate) => {
    let i = 1;
    for (i = 1; i <= rate; i++) {
      document.getElementById(i).classList.remove("rating-black-color");
      document.getElementById(i).classList.add("rating-yellow-color");
    }
    for (i; i <= rating.length; i++) {
      document.getElementById(i).classList.remove("rating-yellow-color");
      document.getElementById(i).classList.add("rating-black-color");
    }
  };

  return (
    <Fragment>
      {/* Header Component */}
      <Router>
        <div>
          <Route render={() => <Header movieId={id} />} />
        </div>
      </Router>
      {/* Back to Home Button */}
      <div className="back-to-home-text">
        <Link to="/">
          <Button>
            <Typography style={{ textTransform: "none" }}>
              <ArrowBackIosIcon style={{ fontSize: "10px" }} />
              Back to Home
            </Typography>
          </Button>
        </Link>
      </div>
      <br />
      <div className="details-container">
        {/* Left Container with Movie Poster */}
        <div className="details-left-container">
          <img
            src={moviesBasedOnIdList && moviesBasedOnIdList.poster_url}
            alt="poster"
          />
        </div>
        {/* Middle Container with Movie Details */}
        <div className="details-middle-container">
          <Typography variant="h5" component="h2">
            {moviesBasedOnIdList && moviesBasedOnIdList.title}
          </Typography>
          <Typography>
            <b>Genres:</b>&nbsp;
            {moviesBasedOnIdList &&
              moviesBasedOnIdList.genres &&
              moviesBasedOnIdList.genres.join(",")}
          </Typography>
          <Typography>
            <b>Duration:</b>&nbsp;
            {moviesBasedOnIdList && moviesBasedOnIdList.duration}
          </Typography>
          <Typography>
            <b>Release Date:</b>&nbsp;
            {moviesBasedOnIdList &&
              moviesBasedOnIdList.release_date &&
              new Date(moviesBasedOnIdList.release_date).toDateString()}
          </Typography>
          <Typography>
            <b>Rating:</b>&nbsp;
            {moviesBasedOnIdList && moviesBasedOnIdList.rating}
          </Typography>
          <Typography style={{ marginTop: "16px" }}>
            <b>Plot:</b>
            <a href={moviesBasedOnIdList.wiki_url} target="_blank">
              (Wiki_Link)
            </a>
            &nbsp;{moviesBasedOnIdList && moviesBasedOnIdList.storyline}
          </Typography>
          <Typography style={{ marginTop: "16px" }}>
            <b>Trailer:</b>
          </Typography>
          {moviesBasedOnIdList && moviesBasedOnIdList.trailer_url && (
            <YouTube videoId={getParams(moviesBasedOnIdList.trailer_url)} />
          )}
        </div>
        {/* Right Container with Rate this movie and Artists */}
        <div className="details-right-container">
          <Typography>
            <b>Rate this movie:</b>
          </Typography>
          <Typography>
            {rating &&
              rating.map((v, i) => {
                return (
                  <StarBorderIcon id={v} onClick={() => onRatingClick(v)} />
                );
              })}
          </Typography>
          <Typography style={{ marginTop: "16px", marginBottom: "16px" }}>
            <b>Artists:</b>
          </Typography>
          <div className={classes.root}>
            <GridList className={classes.gridList} cols={2}>
              {moviesBasedOnIdList &&
                moviesBasedOnIdList.artists &&
                moviesBasedOnIdList.artists.map((crew) => (
                  <GridListTile key={crew.id}>
                    <img
                      src={crew.profile_url}
                      alt={crew.first_name + " " + crew.last_name}
                    />
                    <GridListTileBar
                      title={crew.first_name + " " + crew.last_name}
                      classes={{
                        root: classes.titleBar,
                      }}
                    />
                  </GridListTile>
                ))}
            </GridList>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
