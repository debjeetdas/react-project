import React, { Fragment, useState, useEffect } from "react";
import "./ReleasedMovies.css";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  FormControl,
  InputLabel,
  Input,
  Select,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

// Released Movies Styles
const releasedMoviesStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: "wrap",
    cursor: "pointer",
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
}));

// Filters Styles
const filtersStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.primary.light,
  },
  cardcomp: {
    margin: theme.spacing.unit,
    minWidth: "240px",
    maxWidth: "240px",
  },
}));

export default function ReleasedMovies() {
  const classes = releasedMoviesStyles();
  const filterClasses = filtersStyles();
  const [releasedMoviesList, setReleasedMoviesList] = useState([]);
  const [genreList, setGenreList] = useState([]);
  const [artistList, setArtistList] = useState([]);
  const [filterObject, setFilterObject] = useState({
    movie_name: "",
    genre_name: "",
    artist_name: "",
    release_date_start: "",
    release_date_end: "",
  });
  const history = useHistory();

  useEffect(() => {
    releasedMoviesData();
    genreData();
    artistData();
  }, []);

  // Released Movies API Call Logic
  const releasedMoviesData = () => {
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
          setReleasedMoviesList(data.movies);
        } else {
          alert(data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  // Genre Data for Filters API Call Logic
  const genreData = () => {
    fetch("http://localhost:8085/api/v1/genres", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.message) {
          setGenreList(data.genres);
        } else {
          alert(data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  // Artists Data for Filters API Call Logic
  const artistData = () => {
    fetch("http://localhost:8085/api/v1/artists", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.message) {
          setArtistList(data.artists);
        } else {
          alert(data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const checkReleaseDate = (releaseDate) => {
    var fromDate = new Date(filterObject.release_date_start)
      .toISOString()
      .split("T")[0];
    var todate =
      filterObject.release_date_end !== ""
        ? new Date(filterObject.release_date_end).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
    return releaseDate >= fromDate && releaseDate <= todate;
  };

  const onApplyClick = () => {
    let response = releasedMoviesList.filter((mve) => {
      return (
        (filterObject.movie_name !== ""
          ? mve["title"]
              .toLowerCase()
              .includes(filterObject.movie_name.toLowerCase())
          : "") ||
        (filterObject.genre_name !== ""
          ? mve["genres"] &&
            mve["genres"].find(
              (gene) =>
                gene.toLowerCase() === filterObject.genre_name.toLowerCase()
            )
          : "") ||
        (filterObject.artist_name !== ""
          ? mve["artists"] &&
            mve["artists"].find((art) =>
              (art.first_name + " " + art.last_name)
                .toLowerCase()
                .includes(filterObject.artist_name.toLowerCase())
            )
          : "") ||
        (filterObject.release_date_start !== ""
          ? checkReleaseDate(mve["release_date"])
          : "")
      );
    });
    setReleasedMoviesList(response);
  };

  const handleChange = (e) => {
    setFilterObject({ ...filterObject, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <div className="releasedmovies-flex-container">
        <div className="releasedmovies-container">
          {/* Released Movies Grid List*/}
          <div className={classes.root}>
            <GridList className={classes.gridList} cellHeight={350} cols={4}>
              {releasedMoviesList &&
                releasedMoviesList.map((released) => (
                  <GridListTile
                    key={released.id}
                    onClick={() => history.push(`/movie/${released.id}`)}
                  >
                    <img src={released.poster_url} alt={released.title} />
                    <GridListTileBar
                      title={released.title}
                      subtitle={
                        <span>
                          Release Date:{" "}
                          {new Date(released.release_date).toDateString()}
                        </span>
                      }
                      classes={{
                        root: classes.titleBar,
                      }}
                    />
                  </GridListTile>
                ))}
            </GridList>
          </div>
        </div>
        {/* Filters */}
        <div className="filters-container">
          <Card>
            <CardContent>
              <Typography className={filterClasses.title}>
                FIND MOVIES BY:
              </Typography>
              <FormControl className={filterClasses.cardcomp}>
                <InputLabel htmlFor="movie_name">Movie Name</InputLabel>
                <Input
                  type="text"
                  id="movie_name"
                  name="movie_name"
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl className={filterClasses.cardcomp}>
                <InputLabel htmlFor="genres">Genres</InputLabel>
                <Select value={filterObject && filterObject.genre_name}>
                  {genreList &&
                    genreList.map((gen) => (
                      <MenuItem key={gen.id} value={gen.genre}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="genre_name"
                              onChange={handleChange}
                              value={gen.genre}
                            />
                          }
                          label={gen.genre}
                        />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl className={filterClasses.cardcomp}>
                <InputLabel htmlFor="artists">Artists</InputLabel>
                <Select value={filterObject && filterObject.artist_name}>
                  {artistList &&
                    artistList.map((art) => (
                      <MenuItem
                        key={art.id}
                        value={art.first_name + " " + art.last_name}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="artist_name"
                              onChange={handleChange}
                              value={art.first_name + " " + art.last_name}
                            />
                          }
                          label={art.first_name + " " + art.last_name}
                        />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl className={filterClasses.cardcomp}>
                <InputLabel htmlFor="release_date_start" shrink>
                  Release Date Start
                </InputLabel>
                <Input
                  type="date"
                  id="release_date_start"
                  name="release_date_start"
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl className={filterClasses.cardcomp}>
                <InputLabel htmlFor="release_date_start" shrink>
                  Release Date End
                </InputLabel>
                <Input
                  type="date"
                  id="release_date_end"
                  name="release_date_end"
                  onChange={handleChange}
                />
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className={filterClasses.cardcomp}
                onClick={onApplyClick}
              >
                APPLY
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Fragment>
  );
}
