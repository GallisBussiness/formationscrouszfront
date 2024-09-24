import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import DataTables from "views/admin/tables";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdLock,
} from "react-icons/md";
import { FaUserGraduate, FaUsers } from "react-icons/fa";

const routes = [
  {
    name: "FORMATIONS",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "CONSULTANTS",
    layout: "/admin",
    path: "consultants",
    icon: <FaUserGraduate className="h-6 w-6" />,
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: "AGENTS",
    layout: "/admin",
    icon: <FaUsers className="h-6 w-6" />,
    path: "agents",
    component: <DataTables />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
];
export default routes;
