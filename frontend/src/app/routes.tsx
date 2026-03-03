import { createBrowserRouter, redirect } from "react-router";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Profile } from "./pages/Profile";
import { EditProfile } from "./pages/EditProfile";

const requireAuth = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    throw redirect("/login");
  }

  return null;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/",
    Component: Profile,
    loader: requireAuth,
  },
  {
    path: "/profile",
    Component: Profile,
    loader: requireAuth,
  },
  {
    path: "/edit-profile",
    Component: EditProfile,
    loader: requireAuth,
  },
]);