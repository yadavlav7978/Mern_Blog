import React from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Navbar,
  NavbarCollapse,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toogleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        navigate("/signin");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm
         sm:text-xl font-semibold dark:text-white"
      >
        <span
          className="px-2 py-1 bg-gradient-to-r from-indigo-500
             via-purple-500 to-pink-500 rounded-lg text-black"
        >
          Lav's
        </span>
        Blog
      </Link>

      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>

      <Button className="w-12 h-10" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toogleTheme())}
        >
          {theme == "light" ? <FaSun /> : <FaMoon />}
        </Button>

        {currentUser ? ( // If currentUser exists
          <Dropdown
            arrowIcon={false} // Disable arrow icon for the dropdown
            inline // Display the dropdown inline
            label={
              // Label of the dropdown
              <Avatar
                alt="user"
                img={currentUser.profilePicture} // Display current user's profile picture
                rounded // Make the avatar rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          // If currentUser does not exist , add this signIn button
          <Link to="/signin">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>

        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>

        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
