import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../../firebase";

export const GetSessionList = async () => {
  const docRef = doc(db, "users", `${auth.currentUser.displayName}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }

};
