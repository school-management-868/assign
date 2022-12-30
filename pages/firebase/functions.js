import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useEffect } from "react";



// export var currentSession;
// export var curUser;

// useEffect(() => {
//     getCurrentSession();
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const currentUser = user.displayName;
//         curUser =currentUser;
//       } else {
        
//       }
//     });
//   }, [currentSession, auth]);



export const getCurrentSession = async (currentSession) => {
    const docref = doc(db, "users", `Akash Gandhar`);
    const docSnap = await getDoc(docref);
    var fetchedSession;
    if (docSnap.exists) {
      try{
        fetchedSession = docSnap.data().current_Session;}
      catch(e){

      }
    }
    currentSession = fetchedSession
  };

//   export const GetClassList = async () => {
//     const docRef = collection(db, `users/${curUser}/sessions/${currentSession}/classes`);
//     const docSnap = await getDocs(docRef);
//     var list = []
//     docSnap.forEach((doc)=>{
//       list.push(doc.data())
      
//     })
//     return(list)
//   };