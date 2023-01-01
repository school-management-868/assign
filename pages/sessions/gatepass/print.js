import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { db } from "../../../firebase";
import UserContext from "../../context/userContext";

export default function print() {
  const router = useRouter();
  const [student, setStudent] = useState([]);
  const a = useContext(UserContext)
  const className = router.query.classes;
  const sectionName = router.query.section;



  const GetStudentList = async () => {
    const docRef = doc(
      db,
      `users/${a.user}/sessions/${a.session}/classes/${className}/sections/${sectionName}/students`,
      router.query.sid
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists) {
      setStudent(docSnap.data());
      console.log(docSnap.data());
    }
  };

  return (
    <><div>
          {router.query.sid}
          {router.query.classes}
          {router.query.section}
          <button
              onClick={() => {
                  GetStudentList();
              } }
              className="px-10 w-44 h-8 block bg-red-500"
          >
              akash
          </button>
      </div>
      {student.name &&<div>student is there somewhere</div>}</>
  );
}
