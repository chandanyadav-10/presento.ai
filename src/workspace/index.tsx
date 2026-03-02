import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import React, { use, useContext, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { firebaseDb } from "./../../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserDetailContext } from "./../../context/UserDetailContext";
import { set } from "date-fns";
import Header from "@/components/custom/Header";
import PromptBox from "@/components/custom/PromptBox";
import MyProjects from "@/components/custom/MyProjects";

function Workspace() {
  const { user, isLoaded } = useUser();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const location = useLocation();

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);

  const CreateNewUser = async () => {
    if (user) {
      // If user already exists in the database, do not create a new user
      const docRef = doc(
        firebaseDb,
        "users",
        user?.primaryEmailAddress?.emailAddress ?? "",
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setUserDetail(docSnap.data());
      } else {
        const data = {
          fullName: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
          createdAt: new Date(),
          credits: 10,
        };
        // insert new user
        await setDoc(
          doc(
            firebaseDb,
            "users",
            user?.primaryEmailAddress?.emailAddress ?? "",
          ),
          {
            ...data,
          },
        );
        setUserDetail(data);
      }
    }
  };

  if (!user && isLoaded) {
    return (
      <div>
        Please sign in to access the workspace.
        <Link to={"/"}>
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }
  return (
    <div>
      <Header />
      {location.pathname === "/workspace" && <div>
        <PromptBox />
        <MyProjects />
        </div>}
      <Outlet />
    </div>
  );
}

export default Workspace;
