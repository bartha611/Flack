import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Nav,
  NavLink,
  Navbar,
  NavbarToggler,
  Collapse,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import { fetchAuth } from "../state/ducks/auth";

const Navigation = () => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const { teams } = useSelector((state) => state.teams);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(fetchAuth("/api/user/signup", "POST", "LOGOUT", null, history));
  };

  const guestLogin = () => {
    const data = {
      email: "adambarth@gmail.com",
      password: "a",
    };
    dispatch(fetchAuth("/api/user/login", "POST", "LOGIN", data, history));
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return exp > new Date().getTime() / 1000;
  };

  const isAuth = isAuthenticated();

  return (
    <div className="h-navigation">
      <Navbar className="h-full" id="navigation" color="dark" dark expand="md">
        <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto text-white">
            <NavLink href="/">Flack</NavLink>
          </Nav>
          <Nav className="ml-auto" navbar>
            {!isAuth && (
              <NavItem className="cursor-pointer">
                <NavLink href="/login">Login</NavLink>
              </NavItem>
            )}
            {!isAuth && (
              <NavItem className="cursor-pointer">
                <NavLink href="/signup">SignUp</NavLink>
              </NavItem>
            )}
            {!isAuth && (
              <NavItem className="cursor-pointer">
                <NavLink onClick={guestLogin}>Guest</NavLink>
              </NavItem>
            )}
            {isAuth && (
              <NavItem className="cursor-pointer">
                <NavLink
                  onClick={() => {
                    handleClick();
                  }}
                >
                  Logout
                </NavLink>
              </NavItem>
            )}
            {isAuth && (
              <NavItem>
                <NavLink href="/createteam">Create Team</NavLink>
              </NavItem>
            )}
            {isAuth && (
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Teams
                </DropdownToggle>
                <DropdownMenu right>
                  {teams.map((tm) => {
                    return (
                      <DropdownItem
                        onClick={() => history.push(`/${tm.shortid}`)}
                      >
                        {tm.name}
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </UncontrolledDropdown>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Navigation;
