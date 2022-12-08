import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
import Nav from "../components/navbar";
import NewAssignment from "../components/newAssignment";
import { auth } from "../firebase";


export default function home() {
  return (
    <>
    <Nav />
    <NewAssignment/>
    </>
  );
}
