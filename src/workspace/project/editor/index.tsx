import OutlineSection from "@/components/custom/OutlineSection";
import { firebaseDb, GeminiAiModel } from "./../../../../config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { Project } from "../outline";
import SliderFrame from "@/components/custom/SliderFrame";
import { exportSlidesToPPT } from "@/utils/exportPPT";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const SLIDER_PROMPT = ` Generate HTML (TailwindCSS + Flowbite UI + Lucide Icons)
code for a 16:9 ppt slider in Modern Dark style.
{DESIGN_STYLE}. No responsive design; use a fixed 16:9 layout for slides.
Use Flowbite component structure. Use different layouts depending on content and style.
Use TailwindCSS colors like primary, accent, gradients, background, etc., and include colors from {COLORS_CODE}.
MetaData for Slider: {METADATA}

- Ensure images are optimized to fit within their container div and do not overflow.
- Use proper width/height constraints on images so they scale down if needed to remain inside the slide.
- Maintain 16:9 aspect ratio for all slides and all media.
- Use CSS classes like 'object-cover' or 'object-contain' for images to prevent stretching or overflow.
- Use grid or flex layouts to properly divide the slide so elements do not overlap.

Generate Image if needed using:
'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg'
Replace {imagePrompt} with relevant image prompt and altImageName with a random image name.

<!-- Slide Content Wrapper (Fixed 16:9 Aspect Ratio) -->
<div class="w-[800px] h-[500px] relative overflow-hidden">
<!-- Slide content here -->
</div>

Also do not add any overlay : Avoid this :
<div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20">
</div>

Just provide body content for 1 slider. Make sure all content, including images, stays within the main slide div and preserves the 16:9 ratio.

IMPORTANT RULES:
- Return ONLY pure HTML code.
- Do NOT include explanations.
- Do NOT include notes.
- Do NOT include markdown like ### or **.
- Do NOT include headings like "Key Design Notes".
- Do NOT include comments.
- Your response MUST start with <div
- Your response MUST end with </div>
`;

const DUMMY_SLIDER = `
<!-- Slide Content Wrapper (Fixed 16:9 Aspect Ratio) -->
<div class="w-[800px] h-[500px] relative bg-[#0D0D0D] text-white overflow-hidden">
<div class="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] to-[#1F1F1F] opacity-70"></div>
<div class="grid grid-cols-2 grid-rows-2 h-full relative z-10">
<div class="col-span-1 row-span-1 p-8 flex flex-col justify-start items-start">
<h1 class="text-4xl font-serif font-bold text-accent mb-4">
Welcome to Kravix Studio: The Future of Film
</h1>
<p class="text-sm text-gray-300 leading-relaxed">
Welcome to our investor pitch for [App Name], an innovative AI Short Film Generator.
</p>
</div>
</div>
</div>
`;

function Editor() {
  const { projectId } = useParams();

  const [projectDetail, setProjectDetail] = useState<Project>();
  const [loading, setLoading] = useState(false);
  const [sliders, setSliders] = useState<any[]>([{ code: DUMMY_SLIDER }]);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (projectId) GetProjectDetail();
  }, [projectId]);

  const GetProjectDetail = async () => {
    setLoading(true);

    const docRef = doc(firebaseDb, "projects", projectId ?? "");
    const docSnap: any = await getDoc(docRef);

    if (!docSnap.exists()) {
      setLoading(false);
      return;
    }
    const data = docSnap.data();

    setProjectDetail(data);

    // ✅ Load saved slides if they exist
    if (data?.slides && data.slides.length > 0) {
      setSliders(data.slides);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!projectDetail) return;

    // ❗ Only generate if slides do not exist
    if (!projectDetail.slides || projectDetail.slides.length === 0) {
      // GenerateSlides();
    }
  }, [projectDetail]);

  const GenerateSlides = async () => {
    if (!projectDetail?.outline || projectDetail.outline.length === 0) return;

    const slidesToGenerate = projectDetail.outline;

    setSliders([]);

    for (let index = 0; index < slidesToGenerate.length; index++) {
      const metaData = slidesToGenerate[index];

      const prompt = SLIDER_PROMPT.replace(
        "{DESIGN_STYLE}",
        projectDetail?.designStyle?.designGuide ?? "",
      )
        .replace(
          "{COLORS_CODE}",
          JSON.stringify(projectDetail?.designStyle?.colors),
        )
        .replace("{METADATA}", JSON.stringify(metaData));

      await GeminiSlideCall(prompt, index);
    }
  };

  const GeminiSlideCall = async (prompt: string, index: number) => {
    try {
      const result = await GeminiAiModel.generateContentStream(prompt);

      let text = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        text += chunkText;

        const finalText = text
          .replace(/```html/g, "")
          .replace(/```/g, "")
          .replace(/###.*$/gm, "") // remove headings
          .replace(/\*\*.*?\*\*/g, "") // remove markdown bold notes
          .replace(/Key Design.*$/gm, "")
          .trim();

        setSliders((prev: any[]) => {
          const updated = [...(prev || [])];

          while (updated.length <= index) {
            updated.push({ code: "" });
          }

          updated[index] = { code: finalText };

          return updated;
        });
      }

      console.log("Slide generated:", index + 1);
    } catch (err) {
      console.error("Slide generation error:", err);
    }
  };

  const updateSliderCode = async (updatedHTML: string, index: number) => {
    const updatedSlides = [...sliders];
    console.log("Saving slides:", updatedSlides);

    updatedSlides[index] = {
      ...updatedSlides[index],
      code: updatedHTML,
    };

    // update UI
    setSliders(updatedSlides);

    // save to firebase
    if (!projectId) return;

    await setDoc(
      doc(firebaseDb, "projects", projectId),
      {
        slides: updatedSlides,
      },
      { merge: true },
    );
  };

  const handleUpdateOutline = async (slideNo: string, value: any) => {
    const updatedOutline = projectDetail?.outline?.map((item: any) =>
      item.slideNo === slideNo ? { ...item, ...value } : item,
    );

    setProjectDetail((prev: any) => ({
      ...prev,
      outline: updatedOutline,
    }));

    // update firebase
    await setDoc(
      doc(firebaseDb, "projects", projectId ?? ""),
      { outline: updatedOutline },
      { merge: true },
    );
  };

  return (
    <div className="flex flex-col pt-24">
      {/* MAIN CONTENT */}
      <div className="grid grid-cols-5 px-10 pb-10 gap-10 hide-scrollbar">
        <div className="col-span-2 h-[90vh] overflow-auto hide-scrollbar">
          <OutlineSection
            outline={projectDetail?.outline ?? []}
            handleUpdateOutline={handleUpdateOutline}
            loading={loading}
          />
        </div>

        <div className="col-span-3 h-screen overflow-auto hide-scrollbar">
          {sliders?.map((slide: any, index: number) => (
            <div
              key={index}
              ref={(el: HTMLDivElement | null) => {
                slideRefs.current[index] = el;
              }}
            >
              <SliderFrame
                key={index}
                slide={slide}
                colors={projectDetail?.designStyle?.colors}
                setUpdateSlider={(code: string) =>
                  updateSliderCode(code, index)
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* FIXED EXPORT BUTTON */}
      <Button
        className="fixed bottom-6 right-8 z-50 shadow-lg"
        onClick={() =>
          exportSlidesToPPT(slideRefs.current.filter(Boolean) as HTMLElement[])
        }
      >
        <Download className="mr-2 h-4 w-4" />
        Export PPT
      </Button>
    </div>
  );
}

export default Editor;
