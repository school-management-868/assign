import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Nav from "../../../components/navbar";
import Header from "../../../components/dropdown";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { auth, db, storage } from "../../../firebase";
import {
  GetClassList,
  curUser,
  currentSession,
  getCurrentSession,
} from "../../firebase/functions";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

export default function NewStudent() {
  const router = useRouter();
  const [sr, setSr] = useState("");
  const [name, setName] = useState("");
  const [fName, setFName] = useState("");
  const [mName, setMName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [fmobile, setFMobile] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [className, setClassName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [transportStatus, setTransportStatus] = useState("");
  const [busStopName, setBusStopName] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [category, setCategory] = useState("");
  const [caste, setCaste] = useState("");
  const [place, setPlace] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [gender, setGender] = useState("");
  const [lSchool, setLSchool] = useState("");
  const [lSchoolAdd, setLSchoolAdd] = useState("");
  const [lSchoolBoard, setLSchoolBoard] = useState("");
  const [lSchoolResult, setLSchoolResult] = useState("");
  const [tcStatus, setTcStatus] = useState("");
  const [rteStatus, setRteStatus] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [aadharStatus, setAadharStatus] = useState("");

  const [tcFile, setTcFile] = useState("");
  const [aadharFile, setAadharFile] = useState("");
  const [image, setImage] = useState();

  const [imgUrl, setImgUrl] = useState(`url("https://picsum.photos/200")`);
  const [percent, setPercent] = useState();

  const [currentSession, setCureentSession] = useState();
  const [curUser, setCurUser] = useState();
  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [stor, setStor] = useState("");

  useEffect(() => {
    getCurrentSession();
    GetClassList();
    GetSectionList();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const currentUser = user.displayName;
        setCurUser(currentUser);
        setStor(`${currentSession}/${currentUser}/file.jpg`);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, [currentSession, auth, classList, className]);

  const getCurrentSession = async () => {
    const docref = doc(db, "users", `${curUser}`);
    const docSnap = await getDoc(docref);
    var fetchedSession;
    if (docSnap.exists) {
      try {
        fetchedSession = docSnap.data().current_Session;
      } catch (e) {}
    }
    setCureentSession(fetchedSession);
  };

  const GetClassList = async () => {
    const docRef = collection(
      db,
      `users/${curUser}/sessions/${currentSession}/classes`
    );
    const docSnap = await getDocs(docRef);
    var list = [];
    docSnap.forEach((doc) => {
      list.push(doc.data());
    });
    setClassList(list);
  };

  const GetSectionList = async () => {
    try {
      const docRef = collection(
        db,
        `users/${curUser}/sessions/${currentSession}/classes/${className}/sections`
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

  const handleUpload = (img) => {
    const storageRef = ref(
      storage,
      `${curUser}/${currentSession}/${className}/${sectionName}/${name}.jpg`
    );
    const file = img;
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercent(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
        });
      }
    );
  };

  const handleUploadDoc = (docs, nam) => {
    const storageRef = ref(
      storage,
      `${curUser}/${currentSession}/${className}/${sectionName}/${name}/${nam}.jpg`
    );
    const file = docs;
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercent(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
        });
      }
    );
  };

  const submitForm = async () => {
    if (
      !sr ||
      !name ||
      !fName ||
      !mName ||
      !dob ||
      !mobile ||
      !fmobile ||
      !age ||
      !address ||
      !transportStatus ||
      !busStopName ||
      !busNumber ||
      !category ||
      !caste ||
      !place ||
      !city ||
      !pincode ||
      !gender ||
      !lSchool ||
      !lSchoolAdd ||
      !lSchoolBoard ||
      !lSchoolResult ||
      !tcStatus ||
      !aadharStatus
    ) {
      alert("some information is missing");
    } else {
      try {
        await setDoc(
          doc(db, `users/${curUser}/sessions/${currentSession}/classes/${className}/sections/${sectionName}/students`, name),
          {
            Sr_Number: sr,
            name: name,
            Father_Name: fName,
            Mother_Name: mName,
            Date_Of_Birth: dob,
            Mobile_Number: mobile,
            Father_Mobile_Number: fmobile,
            Age: age,
            Address: address,
            Transport_Status: transportStatus,
            BusStop_Name: busStopName,
            Bus_Number: busNumber,
            Category: category,
            Caste: caste,
            Place: place,
            City: city,
            PinCode: pincode,
            Gender: gender,
            Last_School: lSchool,
            Last_School_Address: lSchoolAdd,
            Last_School_Board: lSchoolBoard,
            Last_School_Result: lSchoolResult,
            Tc_Available: tcStatus,
            Aadhar_Available: aadharStatus,
          }
        );
        
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  return (
    <div className="h-auto">
      <Nav />
      <Header />
      <div className="w-screen">
        <div class="bg-gray-100 flex bg-local w-screen">
          <div class="bg-gray-100 mx-auto w-screen  bg-white py-20 px-12 lg:px-24 shadow-xl mb-24">
            <div>
              <h1 className="text-center font-bold text-2xl">
                New Student Details
              </h1>
              <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <section class="flex items-center justify-center max-w-fit mx-auto pb-10">
                  <input
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                    }}
                    id="company"
                    type="file"
                    placeholder="1111"
                  />
                  {curUser && (
                    <button
                      onClick={() => {
                        handleUpload(image);
                      }}
                      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                      Upload
                    </button>
                  )}
                </section>
                <div className="flex items-center justify-center max-w-fit mx-auto pb-10">
                  <img className="w-52 h-52 rounded-full" src={imgUrl} />
                </div>
                <div class="-mx-3 md:flex mb-6">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="company"
                    >
                      SR Number *
                    </label>
                    <input
                      onChange={(e) => {
                        setSr(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="company"
                      type="text"
                      placeholder="1111"
                    />
                  </div>
                  <div class="md:w-1/2 px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="title"
                    >
                      Student Name
                    </label>
                    <input
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="title"
                      type="text"
                      placeholder="student name"
                    />
                  </div>
                </div>
                <div class="-mx-3 md:flex mb-6">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="company"
                    >
                      Student Father's Name
                    </label>
                    <input
                      onChange={(e) => {
                        setFName(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="company"
                      type="text"
                      placeholder="father's "
                    />
                  </div>
                  <div class="md:w-1/2 px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="title"
                    >
                      Student Mother's Name
                    </label>
                    <input
                      onChange={(e) => {
                        setMName(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="title"
                      type="text"
                      placeholder="mother's Name"
                    />
                  </div>
                </div>
                <div class="-mx-3 md:flex mb-6">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="company"
                    >
                      Student Date Of Birth
                    </label>
                    <input
                      onChange={(e) => {
                        setDob(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="company"
                      type="text"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  <div class="md:w-1/2 px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="title"
                    >
                      Student's Mobile Number
                    </label>
                    <input
                      onChange={(e) => {
                        setMobile(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="title"
                      type="text"
                      placeholder="Whatsapp Number"
                    />
                  </div>
                </div>
                <div class="-mx-3 md:flex mb-6">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="company"
                    >
                      Father's Mobile Number
                    </label>
                    <input
                      onChange={(e) => {
                        setFMobile(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="company"
                      type="text"
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  <div class="md:w-1/2 px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="title"
                    >
                      Student's Age
                    </label>
                    <input
                      onChange={(e) => {
                        setAge(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="title"
                      type="text"
                      placeholder="Whatsapp Number"
                    />
                  </div>
                </div>

                <div class="-mx-3 md:flex mb-6">
                  <div class="md:w-full px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="application-link"
                    >
                      Address
                    </label>
                    <input
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="application-link"
                      type="text"
                      placeholder="address"
                    />
                  </div>
                </div>

                <div class="-mx-3 md:flex mb-2">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="location"
                    >
                      Class*
                    </label>
                    <div>
                      <select
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
                </div>
                <div class="-mx-3 md:flex mb-2">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="location"
                    >
                      Transport Status*
                    </label>
                    <div>
                      <select
                        onChange={(e) => {
                          setTransportStatus(e.target.value);
                        }}
                        class="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="location"
                      >
                        <option>Please Select</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                  </div>

                  <div class="md:w-1/2 px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="department"
                    >
                      Bus Stop Name
                    </label>
                    <div>
                      <select
                        onChange={(e) => {
                          setBusStopName(e.target.value);
                        }}
                        class="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="department"
                      >
                        <option>Please Select</option>
                        <option>1 Day</option>
                        <option>3 Days</option>
                        <option>1 Week</option>
                      </select>
                    </div>
                  </div>
                  <div class="md:w-1/2 px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="department"
                    >
                      Bus Number
                    </label>
                    <div>
                      <select
                        onChange={(e) => {
                          setBusNumber(e.target.value);
                        }}
                        class="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="department"
                      >
                        <option>Please Select</option>
                        <option>1 Day</option>
                        <option>3 Days</option>
                        <option>1 Week</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="-mx-3 md:flex mb-6">
                  <div class="md:w-full px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="application-link"
                    >
                      Category
                    </label>
                    <input
                      onChange={(e) => {
                        setCategory(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="application-link"
                      type="text"
                      placeholder="Priorities etc"
                    />
                  </div>
                  <div class="md:w-full px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="application-link"
                    >
                      Caste
                    </label>
                    <input
                      onChange={(e) => {
                        setCaste(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="application-link"
                      type="text"
                      placeholder="Priorities etc"
                    />
                  </div>
                </div>
                <div class="-mx-3 md:flex mb-6">
                  <div class="md:w-full px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="application-link"
                    >
                      Village / Town
                    </label>
                    <input
                      onChange={(e) => {
                        setPlace(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="application-link"
                      type="text"
                      placeholder="Priorities etc"
                    />
                  </div>
                  <div class="md:w-full px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="application-link"
                    >
                      City
                    </label>
                    <input
                      onChange={(e) => {
                        setCity(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="application-link"
                      type="text"
                      placeholder="Priorities etc"
                    />
                  </div>
                </div>
                <div class="-mx-3 md:flex mb-2">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="location"
                    >
                      Pin-Code
                    </label>
                    <input
                      onChange={(e) => {
                        setPincode(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="application-link"
                      type="text"
                      placeholder="Priorities etc"
                    />
                  </div>

                  <div class="md:w-1/2 px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="department"
                    >
                      Gender
                    </label>
                    <div>
                      <select
                        onChange={(e) => {
                          setGender(e.target.value);
                        }}
                        class="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="department"
                      >
                        <option>Please Select</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="-mx-3 md:flex mb-6">
                  <div class="md:w-full px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="application-link"
                    >
                      Last School
                    </label>
                    <input
                      onChange={(e) => {
                        setLSchool(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="application-link"
                      type="text"
                      placeholder="Priorities etc"
                    />
                  </div>
                  <div class="md:w-full px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="application-link"
                    >
                      Last School Address
                    </label>
                    <input
                      onChange={(e) => {
                        setLSchoolAdd(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="application-link"
                      type="text"
                      placeholder="Priorities etc"
                    />
                  </div>
                </div>
                <div class="-mx-3 md:flex mb-6">
                  <div class="md:w-full px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="application-link"
                    >
                      Last School Board
                    </label>
                    <input
                      onChange={(e) => {
                        setLSchoolBoard(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="application-link"
                      type="text"
                      placeholder="Priorities etc"
                    />
                  </div>
                  <div class="md:w-full px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="application-link"
                    >
                      Last School Result
                    </label>
                    <input
                      onChange={(e) => {
                        setLSchoolResult(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="application-link"
                      type="text"
                      placeholder="Pass / Fail"
                    />
                  </div>
                </div>

                <div class="-mx-3 md:flex mb-2">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="location"
                    >
                      TC Status*
                    </label>
                    <div>
                      <select
                        onChange={(e) => {
                          setTcStatus(e.target.value);
                        }}
                        class="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="location"
                      >
                        <option>Please Select</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                  </div>

                  <div class="md:w-1/2 px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="department"
                    >
                      RTE Status
                    </label>
                    <div>
                      <select
                        onChange={(e) => {
                          setRteStatus(e.target.value);
                        }}
                        class="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="department"
                      >
                        <option>Please Select</option>
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                  </div>
                  <div class="md:w-1/2 px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="department"
                    >
                      Admission Date
                    </label>
                    <input
                      onChange={(e) => {
                        setAdmissionDate(e.target.value);
                      }}
                      class="w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3"
                      id="application-link"
                      type="text"
                      placeholder={"Pass / Fail"}
                    />
                  </div>
                </div>

                <div class="-mx-3 md:flex mb-2">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="location"
                    >
                      Upload TC*
                    </label>
                    <div>
                      <input
                        onChange={(e) => {
                          setTcFile(e.target.files[0]);
                        }}
                        type="file"
                        class="w-auto bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="location"
                      />
                      <button
                        onClick={(e) => {
                          handleUploadDoc(tcFile, "TC");
                        }}
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                  <div class="md:w-1/2 px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="job-type"
                    >
                      Aadhar Available
                    </label>
                    <div>
                      <select
                        onChange={(e) => {
                          setAadharStatus(e.target.value);
                        }}
                        class="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="job-type"
                      >
                        <option>Yes</option>
                        <option>No</option>
                      </select>
                    </div>
                  </div>
                  <div class="md:w-1/2 px-3">
                    <label
                      class="uppercase tracking-wide text-black text-xs font-bold mb-2"
                      for="department"
                    >
                      Upload Aadhar*
                    </label>
                    <div>
                      <input
                        onChange={(e) => {
                          setAadharFile(e.target.files[0]);
                        }}
                        type="file"
                        class="w-auto bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                        id="location"
                      />
                      <button
                        onClick={(e) => {
                          handleUploadDoc(aadharFile, "Aadhar");
                        }}
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>

                <div class="-mx-3 md:flex mb-2">
                  <div class="md:w-1/2 px-3 mb-6 md:mb-0"></div>

                  <div class="md:w-1/2 px-3">
                    {/* class="w-full bg-gray-200 border border-gray-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded" */}
                    <div>
                      <button onClick={()=>{submitForm()}} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full  border border-gray-200  text-sm  pr-8 mb-3 hover:scale-105">
                        Submit
                      </button>
                    </div>
                  </div>
                  <div class="md:w-1/2 px-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <div class="-mx-3 md:flex mt-2">
                
              </div> */
}
