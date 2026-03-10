import React, { use, useContext } from "react";
import logo from "../../assets/logo.png";
import { Button } from "../ui/button";
import { SignInButton, useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import { Diamond, Gem } from "lucide-react";
import { UserDetailContext } from "./../../../context/UserDetailContext";

const MenuOptions = [
  {
    name: "Workspace",
    path: "/workspace",
  },
  {
    name: "Pricing",
    path: "/workspace/pricing",
  },
];

function Header() {
  const { user } = useUser();
  const location = useLocation();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  console.log(location.pathname);
  const { has } = useAuth();
  const hasUnlimitedAccess = has && has({ plan: "unlimited" });
  console.log("hasUnlimitedAccess", hasUnlimitedAccess);
  return (
    <div className="flex items-center justify-between px-10 shadow-md fixed top-0 w-full left-0 z-50 backdrop-blur-md bg-white/70 border-amber-600 h-16">
      {/* Logo */}
      <img src={logo} alt="Logo" width={120} />

      {/* Center Menu */}
      <div className="flex gap-8">
        {MenuOptions.map((menu, index) => (
          <Link key={index} to={menu.path}>
            <h2
              className={`cursor-pointer hover:text-primary transition ${
                location.pathname === menu.path
                  ? "text-primary font-semibold"
                  : "text-gray-700"
              }`}
            >
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>

      {/* Right Section */}
      {!user ? (
        <SignInButton mode="modal">
          <Button>Get Started</Button>
        </SignInButton>
      ) : (
        <div className="flex gap-5 items-center">
          <UserButton />

          {location.pathname.includes("workspace") ? (
            !hasUnlimitedAccess && (
              <div className="flex gap-2 items-center p-2 px-3 bg-orange-100 rounded-full">
                <Gem /> {userDetail?.credits ?? 0}
              </div>
            )
          ) : (
            <Link to="/workspace">
              <Button>Go To Workspace</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
