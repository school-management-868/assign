import React, { useContext } from "react";
import UserContext from "./context/userContext";

export default function home() {
  const a = useContext(UserContext);

  if (a.user) {
    return <>{a.session}</>;
  }

}
