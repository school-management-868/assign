import React, { use, useEffect, useState } from "react";
import Nav from "../../../components/navbar";
import Header from "../../../components/dropdown";
import { auth, db } from "../../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { async } from "@firebase/util";
import { onAuthStateChanged } from "firebase/auth";
import Table from "../../../components/table";
import { list } from "firebase/storage";

export default function Classes() {
  const [currentSession, setCureentSession] = useState();
  const [curUser, setCurUser] = useState()
  const [className, setClassName] = useState("");
  const [noSections, setNoSections] = useState("");
  const [classList, setClassList] = useState([])
  useEffect(() => {
    getCurrentSession();
    GetClassList();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const currentUser = user.displayName;
        setCurUser(currentUser)
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, [currentSession, auth,classList]);

  //   onAuthStateChanged(auth,()=>{
  //     setUser(auth.currentUser.displayName)
  //   })

  // }, [auth])

  const getCurrentSession = async () => {
    const docref = doc(db, "users", `${curUser}`);
    const docSnap = await getDoc(docref);
    var fetchedSession;
    if (docSnap.exists) {
      try{
        fetchedSession = docSnap.data().current_Session;}
      catch(e){

      }
    }
    setCureentSession(fetchedSession);
  };

  const createSections = async (nam, num) => {
    for (let i = 1; i <= num; i++) {
      try {
        const docRef = `users/${curUser}/sessions/${currentSession}/classes/${nam}/sections`;

        await setDoc(doc(db, docRef, `Section-${i}`), {
          Name: `Section-${i}`,
          Parent_Class: nam,
          Strength: 0,
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  const createClass = async (name, sections) => {
    try {
      const docRef = `users/${curUser}/sessions/${currentSession}/classes`;
      await setDoc(doc(db, docRef, `${name}`), {
        Name: `${name}`,
        No_Of_Sections: sections,
      });
      createSections(name, sections);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };



  const GetClassList = async () => {
    const docRef = collection(db, `users/${curUser}/sessions/${currentSession}/classes`);
    const docSnap = await getDocs(docRef);
    var list = []
    docSnap.forEach((doc)=>{
      list.push(doc.data())
      
    })
    setClassList(list);
  };

  return (
    <>
      <Nav />
      <Header />

      <div className="w-screen">
        <div class="bg-gray-100 flex bg-local w-screen">
          <div class="bg-gray-100 mx-auto w-screen h-screen bg-white py-20 px-12 lg:px-24 shadow-xl mb-24">
            <div>
              <h1 className="text-center font-bold text-2xl">Add New Class</h1>
              <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <div class="-mx-3 md:flex mb-6">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="company"
                    >
                      Name*
                    </label>
                    <input
                      onChange={(e) => {
                        setClassName(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="company"
                      type="text"
                      placeholder="Netboard"
                    />
                  </div>
                  <div class="md:w-1/2 px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="title"
                    >
                      No. Of Sections*
                    </label>
                    <input
                      onChange={(e) => {
                        setNoSections(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="title"
                      type="text"
                      placeholder="B.tech / cse / CSP242 "
                    />
                  </div>
                  <button
                    onClick={() => {
                      createClass(className, noSections);
                    }}
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div>
      <table class="min-w-full border-collapse block md:table">
        <thead class="block md:table-header-group">
          <tr class="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto  md:relative ">
            <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
              Classs Name
            </th>
            <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
              Sections
            </th>
            <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
              Class Teacher
            </th>
            <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
              Strength
            </th>
            <th class="bg-gray-600 p-2 text-white font-bold md:border md:border-grey-500 text-left block md:table-cell">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="block md:table-row-group">
          {classList.map((e,index)=>{return(<tr key={index} class="bg-gray-300 border border-grey-500 md:border-none block md:table-row">
            <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
              <span class="inline-block w-1/3 md:hidden font-bold">Name</span>
              {e.Name}
            </td>
            <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
              <span class="inline-block w-1/3 md:hidden font-bold">
                sections
              </span>
              {e.No_Of_Sections}
            </td>
            <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
              <span class="inline-block w-1/3 md:hidden font-bold">
                Email Address
              </span>
              jrios@icloud.com
            </td>
            <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
              <span class="inline-block w-1/3 md:hidden font-bold">Mobile</span>
              582-3X2-6233
            </td>
            <td class="p-2 md:border md:border-grey-500 text-left block md:table-cell">
              <span class="inline-block w-1/3 md:hidden font-bold">
                Actions
              </span>
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 border border-blue-500 rounded">
                Edit
              </button>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-500 rounded">
                Delete
              </button>
            </td>
          </tr>)})}
          
        </tbody>
      </table>
    </div>


          </div>
        </div>
      </div>
    </>
  );
}
