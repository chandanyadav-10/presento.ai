import React from "react";
import { Outlet } from "react-router-dom";

function Workspace() {
  return (
    <div>
      Workspace
      <Outlet />
    </div>
  );
}

export default Workspace;
