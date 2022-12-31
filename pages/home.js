import React, { useContext } from "react";
import UserContext from "./context/userContext";

export default function home() {
  
  const a = useContext(UserContext);

  return <>{a.session}</>;
}
