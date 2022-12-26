import React, { use, useEffect, useState } from "react";
import Nav from "../../components/navbar";
import Header from "../../components/dropdown";
import { auth, db } from "../../firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { async } from "@firebase/util";
import { onAuthStateChanged } from "firebase/auth";

export default function index() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sessionList, setSessionList] = useState([])
  const [sessionSelected,setSessionSelected] = useState()
  const [user, setUser] = useState();
  const GetSessionList = async () => {
    const docRef = collection(db, `users/${auth.currentUser.displayName}/sessions`);
    const docSnap = await getDocs(docRef);
    var list = []
    docSnap.forEach((doc)=>{
      list.push(doc.data())
      console.log(doc.data());
    })
    setSessionList(list);
  };

  // useEffect(() => {
  //   onAuthStateChanged(auth,()=>{
  //     setUser(auth.currentUser.displayName)
  //   })
   
  // }, [auth])
  
const setCurrentSession= async(value)=>{
  const ref = doc(db, "users", `${auth.currentUser.displayName}`);

  // Set the "capital" field of the city 'DC'
  await updateDoc(ref, {
    current_Session: value,
  });
}

const getCurrentSession = async()=>{
  const docref = doc(db,"users",`${auth.currentUser.displayName}`)
  const docSnap = await getDoc(docref);
  var fetchedSession;
  if(docSnap.exists){
    fetchedSession = docSnap.data().current_Session
    console.log(fetchedSession);
  }
}

  const createSession = async (fromdate, todate) => {
    try {
      await setDoc(
        doc(
          db,
          `users/${auth.currentUser.displayName}/sessions`,
          `${fromdate}-${todate}`
        ),
        {
          Name: `${fromdate}-${todate}`,
          From: fromdate,
          To: todate,
        }
      );
      
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };






  return (
    <>
      <Nav />
      <Header />
      
      <div className="w-screen">
        <div class="bg-gray-100 flex bg-local w-screen">
          <div class="bg-gray-100 mx-auto w-screen h-screen bg-white py-20 px-12 lg:px-24 shadow-xl mb-24">
            <div>
              <h1 className="text-center font-bold text-2xl">
                Add New Session
              </h1>
              <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <div class="-mx-3 md:flex mb-6">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="company"
                    >
                      From*
                    </label>
                    <input
                      onChange={(e) => {
                        setFrom(e.target.value);
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
                      To*
                    </label>
                    <input
                      onChange={(e) => {
                        setTo(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="title"
                      type="text"
                      placeholder="B.tech / cse / CSP242 "
                    />
                  </div>
                  <button
                    onClick={() => {
                      createSession(from, to);
                    }}
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-center font-bold text-2xl">
                Change Current Session
              </h1>
              <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <div class="-mx-3 md:flex mb-6">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="location"
                    >
                      Mode*
                    </label>
                    <div>
                      <select onClick={GetSessionList}
                        onChange={(e) => {
                          setSessionSelected(e.target.value);
                        }}
                        class="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="location"
                      >
                        {sessionList.map((e,index)=>{return(<option key={index}>{e.Name}</option>)})}<option>Online</option>
                      </select>
                    </div>
                  </div>

                  <button onClick={()=>{setCurrentSession(sessionSelected)}} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    Add
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
