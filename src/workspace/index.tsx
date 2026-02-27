import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { firebaseDb } from "./../../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

function Workspace() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    user&&CreateNewUser();
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
      } else {
        // insert new use
        await setDoc(
          doc(
            firebaseDb,
            "users",
            user?.primaryEmailAddress?.emailAddress ?? "",
          ),
          {
            fullName: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress,
            createdAt: new Date(),
            credits: 10,
          },
        );
      }
    }

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
  };
}

export default Workspace;
