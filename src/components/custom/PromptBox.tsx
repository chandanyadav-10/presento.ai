import React, { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp, Loader2Icon, PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { firebaseDb } from "./../../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-react";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function PromptBox() {
  const [userInput, setUserInput] = useState<string>();
  const [noOfSlider, setNoOfSlider] = useState<string>("4 to 6");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const CreateAndSaveProject = async () => {
    //Save Project to DB
    const projectId = uuidv4(); // generate a unique ID for the project
    setLoading(true);
    await setDoc(doc(firebaseDb, "projects", projectId), {
      projectId: projectId,
      userInputPrompt: userInput,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      createdAt: Date.now(),
      noOfSlider: noOfSlider,
    });
    setLoading(false);
    navigate("/workspace/project/" + projectId + "/outline");
  };

  return (
    <div
      id="create-project"
      className="w-full flex items-center justify-center mt-28"
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="font-bold text-4xl">
          Describe your topic, we’ll design the{" "}
          <span className="text-primary">PPT </span> slides!
        </h2>
        <p className="text-xl text-gray-500">
          Your design will be saved as new project
        </p>
        <InputGroup>
          <InputGroupTextarea
            id="prompt-input"
            placeholder="Enter what kind of slider do you want to create?"
            className="min-h-36"
            onChange={(event) => setUserInput(event.target.value)}
          />
          <InputGroupAddon align={"block-end"}>
            {/* <InputGroupButton>
              <PlusIcon />
            </InputGroupButton> */}
            <Select onValueChange={(value) => setNoOfSlider(value)}>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select No Of Sliders" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>No. Of Slider</SelectLabel>
                  <SelectItem value="4 to 6">4-6 Sliders</SelectItem>
                  <SelectItem value="6 to 8">6-8 Sliders</SelectItem>
                  <SelectItem value="8 to 12">8-12 Sliders</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <InputGroupButton
              variant={"default"}
              className="rounded-full ml-auto"
              size={"icon-sm"}
              onClick={() => CreateAndSaveProject()}
              disabled={!userInput}
            >
              {loading ? <Loader2Icon className="animate-spin" /> : <ArrowUp />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}

export default PromptBox;
