import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowRight, FolderIcon } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firebaseDb } from "./../../../config/FirebaseConfig";
import pptIcon from "@/assets/ppt.png";
import { Trash2 } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";

function MyProjects() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      GetProjects();
    }
  }, [user]);

  const GetProjects = async () => {
    try {
      const q = query(
        collection(firebaseDb, "projects"),
        where("createdBy", "==", user?.primaryEmailAddress?.emailAddress),
      );

      const querySnapshot = await getDocs(q);

      const projectList: any[] = [];

      querySnapshot.forEach((doc) => {
        projectList.push(doc.data());
      });

      setProjects(projectList);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteDoc(doc(firebaseDb, "projects", projectId));

      // remove deleted project from UI
      setProjects((prev) => prev.filter((p) => p.projectId !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="mx-32 mt-20">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">
          My <span className="text-primary">AI Presentations</span>
        </h2>
        <Button
          onClick={() => {
            document
              .getElementById("create-project")
              ?.scrollIntoView({ behavior: "smooth" });

            setTimeout(() => {
              const input = document.getElementById(
                "prompt-input",
              ) as HTMLTextAreaElement;
              input?.focus();
            }, 400);
          }}
        >
          + Create New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">No Projects Yet</div>
      ) : (
        <div className="grid grid-cols-4 gap-6 mt-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl shadow-sm p-5 mb-6 cursor-pointer hover:shadow-gray-500 transition group"
              onClick={() =>
                navigate(`/workspace/project/${project.projectId}/editor`)
              }
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project.projectId);
                }}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition bg-white rounded-full p-2 shadow-md hover:bg-red-100"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>
              
              <img src={pptIcon} className="w-14 mb-3" />

              <h3 className="font-semibold text-lg line-clamp-2">
                {project.userInputPrompt}
              </h3>

              <p className="text-red-500 text-sm mt-2">
                Total {project.noOfSlider} Slides
              </p>

              <p className="text-gray-400 text-sm mt-1">
                {new Date(project.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProjects;
