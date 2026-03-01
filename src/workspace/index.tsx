import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import React, { useContext, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { firebaseDb } from "./../../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserDetailContext } from "./../../context/UserDetailContext";
import { set } from "date-fns";

function Workspace() {
  const { user, isLoaded } = useUser();
  const {userDetail, setUserDetail} = useContext(UserDetailContext);

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
      Workspace
      <Outlet />
    </div>
  );
}

export default Workspace;
