import React, { Fragment, useState } from "react";
import "./Header.css";
import logo from "../../assets/logo.svg";
import Button from "@material-ui/core/Button";
import Modal from "react-modal";
import {
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const modalCustomStyles = {
  content: {
    top: "20%",
    left: "36%",
    right: "36%",
    bottom: "auto",
  },
};

export default function Header(props) {
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState(0);
  const [addNewUserForm, setAddNewUserForm] = useState({
    email_address: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    password: "",
  });
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);
  const [loginUser, setLoginUser] = useState({
    email: "",
    passwords: "",
  });
  const [reqFirstName, setReqFirstName] = useState("dispNone");
  const [reqLastName, setReqLastName] = useState("dispNone");
  const [reqEmail, setReqEmail] = useState("dispNone");
  const [reqPassword, setReqPassword] = useState("dispNone");
  const [reqContactNumber, setReqContactNumber] = useState("dispNone");

  const history = useHistory();

  function openLoginSignupModal() {
    setOpenModal(true);
  }

  function closeLoginSignupModal() {
    setOpenModal(false);
  }

  const handleTabs = (e, val) => {
    setValue(val);
  };

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }

  const inputChangedHandler = (e) => {
    setAddNewUserForm({ ...addNewUserForm, [e.target.name]: e.target.value });
  };

  const onFormSubmitted = (e) => {
    e.preventDefault();
    fetch("http://localhost:8085/api/v1/signup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(addNewUserForm),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.message) {
          setAddNewUserForm({
            email_address: "",
            first_name: "",
            last_name: "",
            mobile_number: "",
            password: "",
          });
          setIsSuccessfullySubmitted(addNewUserForm);
        } else {
          alert(data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const registerButtonHandler = () => {
    email_address === "" ? setReqEmail("dispBlock") : setReqEmail("dispNone");
    first_name === ""
      ? setReqFirstName("dispBlock")
      : setReqFirstName("dispNone");
    last_name === "" ? setReqLastName("dispBlock") : setReqLastName("dispNone");
    mobile_number === ""
      ? setReqContactNumber("dispBlock")
      : setReqContactNumber("dispNone");
    password === "" ? setReqPassword("dispBlock") : setReqPassword("dispNone");

    if (
      email_address === "" ||
      first_name === "" ||
      last_name === "" ||
      mobile_number === "" ||
      password === ""
    ) {
      return;
    }
  };
  const {
    email_address,
    first_name,
    last_name,
    mobile_number,
    password,
  } = addNewUserForm;

  const loginInputChangedHandler = (e) => {
    const state = loginUser;
    state[e.target.name] = e.target.value;
    setLoginUser({ ...state });
  };

  const onLoginFormSubmitted = (e) => {
    e.preventDefault();
    const param = window.btoa(`${loginUser.email}:${loginUser.passwords}`);
    fetch("http://localhost:8085/api/v1/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Basic ${param}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.message) {
          closeLoginSignupModal();
          setLoginUser({
            email: "",
            passwords: "",
          });
          sessionStorage.setItem("user-token", data.id);
          window.location.reload(true);
        } else {
          alert(data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const { email, passwords } = loginUser;

  const onLogoutButtonClick = (e) => {
    e.preventDefault();
    const param = sessionStorage.getItem("user-token");
    fetch("http://localhost:8085/api/v1/auth/logout", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${param}`,
      },
    })
      .then((data) => {
        if (!data.message) {
          sessionStorage.clear();
          window.location.reload();
        } else {
          alert(data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const onBookShowClick = () => {
    if (sessionStorage.getItem("user-token")) {
      history.push(`/bookshow/${props.movieId}`);
      window.location.reload();
    } else {
      openLoginSignupModal();
    }
  };

  return (
    <Fragment>
      <div className="header">
        {/* Logo Container with Logo */}
        <div className="header-logo-container">
          <img src={logo} alt="movies-project-logo" className="header-logo" />
        </div>
        {/* Book Show, Login & Logout Buttons */}
        <div className="header-login-button">
          {props.movieId && (
            <Button
              variant="contained"
              color="primary"
              onClick={onBookShowClick}
            >
              Book Show
            </Button>
          )}
          &nbsp;&nbsp;
          {sessionStorage.getItem("user-token") ? (
            <Button
              variant="contained"
              color="default"
              onClick={onLogoutButtonClick}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="contained"
              color="default"
              onClick={openLoginSignupModal}
            >
              Login
            </Button>
          )}
          {/* Login & Register Modal */}
          <Modal
            isOpen={openModal}
            onRequestClose={closeLoginSignupModal}
            contentLabel="Login/Signup Modal"
            ariaHideApp={false}
            style={modalCustomStyles}
          >
            <Tabs value={value} onChange={handleTabs} centered>
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
            {/* Login Tab */}
            <TabPanel value={value} index={0}>
              <div className="login-form-container">
                <form onSubmit={onLoginFormSubmitted}>
                  <div className="login-fields-alignment">
                    <FormControl required className="fields-formcontrol">
                      <InputLabel htmlFor="email_address">Username</InputLabel>
                      <Input
                        type="text"
                        id="email_address"
                        name="email"
                        onChange={loginInputChangedHandler}
                        value={email}
                      />
                    </FormControl>
                  </div>
                  <div className="login-fields-alignment">
                    <FormControl required className="fields-formcontrol">
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <Input
                        type="password"
                        id="password"
                        name="passwords"
                        onChange={loginInputChangedHandler}
                        value={passwords}
                      />
                    </FormControl>
                  </div>
                  <br />
                  <div className="login-button">
                    <Button variant="contained" color="primary" type="submit">
                      Login
                    </Button>
                  </div>
                </form>
              </div>
            </TabPanel>
            {/* Register Tab */}
            <TabPanel value={value} index={1}>
              <div className="register-form-container">
                <form onSubmit={onFormSubmitted} noValidate>
                  <div className="register-fields-alignment">
                    <FormControl required className="fields-formcontrol">
                      <InputLabel htmlFor="first_name">First Name</InputLabel>
                      <Input
                        type="text"
                        id="first_name"
                        name="first_name"
                        onChange={inputChangedHandler}
                        value={addNewUserForm.first_name}
                      />
                      <FormHelperText className={reqFirstName}>
                        <span className="error-color">required</span>
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div className="register-fields-alignment">
                    <FormControl required className="fields-formcontrol">
                      <InputLabel htmlFor="last_name">Last Name</InputLabel>
                      <Input
                        type="text"
                        id="last_name"
                        name="last_name"
                        onChange={(e) => inputChangedHandler(e)}
                        value={addNewUserForm.last_name}
                      />
                      <FormHelperText className={reqLastName}>
                        <span className="error-color">required</span>
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div className="register-fields-alignment">
                    <FormControl required className="fields-formcontrol">
                      <InputLabel htmlFor="email_address">Email</InputLabel>
                      <Input
                        type="text"
                        id="email_address"
                        name="email_address"
                        onChange={(e) => inputChangedHandler(e)}
                        value={addNewUserForm.email_address}
                      />
                      <FormHelperText className={reqEmail}>
                        <span className="error-color">required</span>
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div className="register-fields-alignment">
                    <FormControl required className="fields-formcontrol">
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        onChange={(e) => inputChangedHandler(e)}
                        value={addNewUserForm.password}
                      />
                      <FormHelperText className={reqPassword}>
                        <span className="error-color">required</span>
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div className="register-fields-alignment">
                    <FormControl required className="fields-formcontrol">
                      <InputLabel htmlFor="mobile_number">
                        Contact No
                      </InputLabel>
                      <Input
                        type="text"
                        id="mobile_number"
                        name="mobile_number"
                        onChange={(e) => inputChangedHandler(e)}
                        value={addNewUserForm.mobile_number}
                      />
                      <FormHelperText className={reqContactNumber}>
                        <span className="error-color">required</span>
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <br />
                  {isSuccessfullySubmitted && (
                    <div className="register-success-message">
                      <span style={{ fontSize: "13px" }}>
                        Registration Successful. Please Login!
                      </span>
                    </div>
                  )}
                  <br />
                  <div className="register-button">
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      onClick={registerButtonHandler}
                    >
                      Register
                    </Button>
                  </div>
                </form>
              </div>
            </TabPanel>
          </Modal>
        </div>
      </div>
    </Fragment>
  );
}
