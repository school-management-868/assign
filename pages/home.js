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

export default function home() {
  const [users, setUsers] = useState([]);
  const print = async () => {
    const docRef = doc(db, "users", "Akash Gandhar");
    const docSnap = await getDoc(docRef);
    const q = query(
      collection(db, `users/${auth.currentUser.displayName}/assignments`)
    );

    const querySnapshot = await getDocs(q);
    var list1 = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      list1.push(doc.data());
    });
    setUsers(list1);
  };

  return (
    <>
      <Nav />
      <Header />
    </>
  );
}
