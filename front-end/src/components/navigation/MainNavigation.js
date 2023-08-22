import { Link, NavLink, useNavigate } from "react-router-dom";

import classes from "./MainNavigation.module.css";
import { useContext } from "react";
import { AuthContext } from "../../context/context";

function MainNavigation() {
  const authCtx = useContext(AuthContext);
  const user = (authCtx.user);
  const navigate = useNavigate();

  const logoutHandler = () => {
    // authCtx.onLogout();
    // console.log("logout");
    authCtx.dispatch({type:"LOGOUT"});
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate('/');
  }
  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <Link to="/">
          <img src="/images/logo.svg" alt=""></img>
        </Link>
        <nav>
          <ul className={classes.list}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/posts"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Posts
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                About
              </NavLink>
            </li>
          </ul>
        </nav>
        {!user && (
          <div>
            <Link to={"/auth/register"}>
              <button className={classes.button}>Sign Up</button>
            </Link>

            <Link to={"/auth/login"}>
              <button className={classes.button}>Log In</button>
            </Link>
          </div>
        )}
        {user && (
          <div>
            <span>Hi, {user.name}</span>

            {/* <Link to={"/auth/logout"}> */}
              <button className={classes.button} onClick={logoutHandler}>Log Out</button>
            {/* </Link> */}
          </div>
        )}
        {/* <NewsletterSignup /> */}
      </header>
    </div>
  );
}

export default MainNavigation;
