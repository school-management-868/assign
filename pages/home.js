import React, { useEffect, useState } from "react";
import Nav from "../components/navbar";
import NewAssignment from "../components/newAssignment";
import { auth, db } from "../firebase";
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Header from "../components/dropdown";
import { async } from "@firebase/util";
import { onAuthStateChanged } from "firebase/auth";

export default function home() {
  

  return (
    <>
      <Nav />
      <Header />
    </>
  );
}




