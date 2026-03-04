import SlidersStyle from "@/components/custom/SlidersStyle";
import { firebaseDb, GeminiAiModel } from "./../../../../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OutlineSection from "@/components/custom/OutlineSection";
import { set } from "date-fns";

const OUTLINE_PROMPT = `Generate a PowerPoint slide outline for the topic {userInput}". 
Create {noOfSliders} slides in total. Each slide should include a topic name and a 2-line descriptive outline that clearly explains what content the slide will cover.
Include the following structure:
The first slide should be a Welcome screen.
The second slide should be an Agenda screen.
The final slide should be a Thank You screen.
Return the response only in JSON format, following this schema:
[
 {
  "slideNo": "",
  "slidePoint": "",
  "outline": ""
 }
]`;

const DUMMY_OUTLINE = [
  {
    "slideNo": "1",
    "slidePoint": "Welcome to AI-Powered Presentations",
    "outline": "Explore the revolutionary landscape of artificial intelligence tools designed to streamline the creation of professional slide decks. This presentation will demonstrate how AI can transform your ideas into visually stunning presentations in minutes."
  },
  {
    "slideNo": "2",
    "slidePoint": "Presentation Agenda",
    "outline": "This session covers the current state of AI in presentation design, a review of top industry tools, and practical benefits of automation. We will conclude with best practices for integrating AI into your existing creative workflow."
  },
  {
    "slideNo": "3",
    "slidePoint": "The Evolution of Slide Creation",
    "outline": "Understand the shift from manual layout design to prompt-based generation that leverages Large Language Models and generative art. Learn how these technologies reduce the technical barrier for creating high-quality visual content."
  },
  {
    "slideNo": "4",
    "slidePoint": "Top AI Tools for PPT Generation",
    "outline": "Deep dive into leading platforms such as Gamma, Tome, and Beautiful.ai to understand their unique features and output styles. Compare these tools based on their ability to handle data visualization, image generation, and template variety."
  },
  {
    "slideNo": "5",
    "slidePoint": "Key Benefits: Speed and Consistency",
    "outline": "Identify how AI-driven tools significantly cut down production time while ensuring brand consistency and design harmony across all slides. Focus on the automation of repetitive tasks like formatting, alignment, and color palette selection."
  },
  {
    "slideNo": "6",
    "slidePoint": "Future Trends in AI Presentations",
    "outline": "Preview upcoming advancements such as real-time voice-to-presentation conversion and hyper-personalized content adjustments for different audiences. Discuss the potential for interactive and dynamic AI elements that respond to live feedback."
  },
  {
    "slideNo": "7",
    "slidePoint": "Thank You and Q&A",
    "outline": "We appreciate your time and interest in the future of AI-enhanced presentation tools. Please feel free to reach out with questions or for further resources on implementing these technologies."
  }
]

type Project = {
  userInputPrompt: string;
  projectId: string;
  createdAt: string;
  noOfSliders: string;
  outline: Outline[];
};

export type Outline={
  slideNo: string,
  slidePoint: string,
  outline: string
}



function Outline() {
  const { projectId } = useParams();
  const [projectDetail, setProjectDetail] = useState<Project | null>();
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState<Outline[]>(DUMMY_OUTLINE);

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
    if (!docSnap.data()?.outline) {
     // GenerateSLidersOutline(docSnap.data());
    }
  };

  const GenerateSLidersOutline = async (projectData: Project) => {
    setLoading(true);
    // Provide a prompt that contains text
    const prompt = OUTLINE_PROMPT
    .replace("{userInput}",projectData?.userInputPrompt)
    .replace("{noOfSliders}", projectData?.noOfSliders);

    // To generate text output, call generateContent with the text input
    const result = await GeminiAiModel.generateContent(prompt);

    const response = result.response;
    const text = response.text();
    console.log(text);
    const rawJson = text.replace('```json', '').replace('```', '');
    const JSONData = JSON.parse(rawJson);
    setOutline(JSONData);
    setLoading(false);
  };
  return (
    <div className="flex justify-center mt-20">
      <div className="max-w-3xl w-full ">
        <h2 className="font-bold text-2xl">Settings and Slider Outline</h2>
        <SlidersStyle />
        <OutlineSection loading={loading} outline={outline || []} />
      </div>
    </div>
  );
}

export default Outline;
