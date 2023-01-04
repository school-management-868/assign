import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Input } from "postcss";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../context/userContext";
import { db } from "../../../firebase";
import { async } from "@firebase/util";

export default function Account() {
  const months = [
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
  ];

  const [students, setStudents] = useState([]);
  const [dues, setDues] = useState([]);

  const [month, setMonth] = useState();
  const calculate = () => {
    months.map(async (e) => {
      if (e == month) {
        const docRef = collection(
          db,
          `users/${a.user}/sessions/${a.session}/classes/${className}/sections/${sectionName}/students`
        );
        const docSnap = await getDocs(docRef).then((doc) => {
          var list = [];
          doc.forEach(async (d) => {
            list.push(d.data());
          });

          setStudents(list);
        }).then(()=>{getDue()});
      }
    });
  };

  const getDue = async () => {
    students.map(async(e)=>{

        try{
            const docRef = doc(
            db,
            `users/${a.user}/sessions/${a.session}/classes/${className}/sections/${sectionName}/students/${e.Sr_Number}/dues`,
            month
            );
            const docSnap = await getDoc(docRef);
            if (docSnap.exists) {
                dues.push(docSnap.data().month_Fee)
                // console.log(docSnap.data().month_Fee);
            }
        }catch{}
        })
  };

  useEffect(() => {

    console.log(dues);
  
    
  }, [dues])
  

  const [classFee, setClassFee] = useState();
  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const a = useContext(UserContext);
  const [className, setClassName] = useState();
  const [sectionName, setSectionName] = useState("");

  const GetClassFee = async () => {
    const docRef = doc(
      db,
      `users/${a.user}/sessions/${a.session}/classes`,
      className
    );
    const docSnap = await getDoc(docRef);
    if (docSnap.exists) {
      setClassFee(docSnap.data().Class_Fee);
    }
  };

  const GetClassList = async () => {
    try {
      const docRef = collection(
        db,
        `users/${a.user}/sessions/${a.session}/classes`
      );
      const docSnap = await getDocs(docRef);
      var list = [];
      docSnap.forEach((doc) => {
        list.push(doc.data());
      });
      setClassList(list);
    } catch (e) {
      console.log(e);
    }
  };

  const GetSectionList = async () => {
    try {
      const docRef = collection(
        db,
        `users/${a.user}/sessions/${a.session}/classes/${className}/sections`
      );
      const docSnap = await getDocs(docRef);
      var list = [];
      docSnap.forEach((doc) => {
        list.push(doc.data());
      });
      setSectionList(list);
    } catch {
      (e) => {
        if (!className) {
          alert("select class first");
        }
      };
    }
  };

  return (
    <>
      <div class="md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          class="uppercase tracking-wide text-black text-xs font-bold mb-2"
          for="location"
        >
          Class*
        </label>
        <div>
          <select
            onClick={() => {
              GetClassList();
            }}
            onChange={(e) => {
              setClassName(e.target.value);
            }}
            class="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
            id="location"
          >
            <option>Please Select</option>
            {classList.map((e) => {
              return <option>{e.Name}</option>;
            })}
          </select>
        </div>
      </div>
      <div class="md:w-1/2 px-3">
        <label
          class="uppercase tracking-wide text-black text-xs font-bold mb-2"
          for="department"
        >
          Section
        </label>
        <div>
          <select
            onClick={() => {
              GetSectionList();
              GetClassFee();
            }}
            onChange={(e) => {
              setSectionName(e.target.value);
            }}
            class="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
            id="department"
          >
            <option>Please Select</option>
            {sectionList.map((e) => {
              return <option>{e.Name}</option>;
            })}
          </select>
        </div>
      </div>
      <div class="md:w-1/2 px-3">
        <label
          class="uppercase tracking-wide text-black text-xs font-bold mb-2"
          for="department"
        >
          Section
        </label>
        <div>
          <select
            onClick={() => {
              getDue();
            }}
            onChange={(e) => {
              setMonth(e.target.value);
            }}
            class="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
            id="department"
          >
            <option>Please Select</option>
            {months.map((e) => {
              return <option>{e}</option>;
            })}
          </select>
        </div>
      </div>
      <button
        onClick={() => {
          calculate();
        }}
      >
        Calculate
      </button>

      {students.map((e) => {
        return <h1>{e.name}</h1>;
      })}
      


      <div>jkhgfgkjfgugfgfgfg000</div>
      {dues.map((e) => {
        return (<h1>{e}</h1>);
      })}

      
    </>
  );
}
