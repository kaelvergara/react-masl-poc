import React from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { InteractionStatus } from "@azure/msal-browser";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

import { loginRequest } from "./authConfig";

const Login = () => {
  const { instance, inProgress } = useMsal();
  const navigate = useNavigate();

  const handleLogin = (loginType) => {
    // don't open another popup or link if one is already opened
    if (inProgress == InteractionStatus.None) {
      if (loginType === "popup") {
        instance
          .loginPopup(loginRequest)
          .then((resp) => {
            console.log(resp);
            navigate("/home");
          })
          .catch((e) => {});
      } else if (loginType === "redirect") {
        instance
          .loginRedirect(loginRequest)
          .then((resp) => {
            navigate("/home");
          })
          .catch((e) => {});
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>Login Page</div>
      <DropdownButton
        variant="secondary"
        className="ml-auto"
        drop="start"
        title="Sign In"
      >
        <Dropdown.Item as="button" onClick={() => handleLogin("popup")}>
          Sign in using Popup
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={() => handleLogin("redirect")}>
          Sign in using Redirect
        </Dropdown.Item>
      </DropdownButton>
    </div>
  );
};

const Home = () => {
  const { instance, accounts, inProgress } = useMsal();
  const navigate = useNavigate();

  const handleLogout = (logoutType) => {
    if (logoutType === "popup") {
      instance.logoutPopup({
        postLogoutRedirectUri: "/",
        mainWindowRedirectUri: "/",
      });
    } else if (logoutType === "redirect") {
      instance.logoutRedirect({
        postLogoutRedirectUri: "/",
      });
    }
  };
  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <AuthenticatedTemplate>Hi {accounts[0]?.name}</AuthenticatedTemplate>
      </div>

      <DropdownButton
        variant="secondary"
        className="ml-auto"
        drop="start"
        title="Sign Out"
      >
        <Dropdown.Item as="button" onClick={() => handleLogout("popup")}>
          Sign out using Popup
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={() => handleLogout("redirect")}>
          Sign out using Redirect
        </Dropdown.Item>
      </DropdownButton>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div
        style={{ margin: "0 auto", width: "fit-content", marginTop: "80px" }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}
