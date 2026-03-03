import SlidersStyle from "@/components/custom/SlidersStyle";
import { firebaseDb } from "./../../../../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OutlineSection from "@/components/custom/OutlineSection";

type Project = {
  userInputPrompt: string;
  projectId: string;
  createdAt: string;
};

function Outline() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project | null>();

  useEffect(() => {
    projectId && GetProjectDetail();
  }, [projectId]);

  const GetProjectDetail = async () => {
    const docRef = doc(firebaseDb, "projects", projectId ?? "");
    const docSnap: any = await getDoc(docRef);
    if (!docSnap.exists()) {
      return;
    }
    console.log("Document data:", docSnap.data());
    setProjectDetail(docSnap.data());
  };
  return ( 
    <div className="flex justify-center mt-20">
      <div className="max-w-3xl w-full ">
        <h2 className="font-bold text-2xl">Settings and Slider Outline</h2>
        <SlidersStyle/>
        <OutlineSection/>
      </div>
    </div>
  );
}

export default Outline;
