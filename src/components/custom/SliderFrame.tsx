import { GeminiAiModel } from "./../../../config/FirebaseConfig";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowRight, Loader2, Sparkles, X } from "lucide-react";

const HTML_DEFAULT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
  <title>AI Website Builder</title>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Custom Tailwind Config for Colors -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {colorCodes},
          backgroundImage: {
            gradient: 'linear-gradient(90deg, #6366F1 0%, #10B981 100%)', // Primary → Secondary
          },
        },
      },
    };
  </script>

  <!-- Flowbite CSS & JS -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
  integrity="sha512-SnH5WK+bZx1mJ7pVk8E5x29nLNX6j+cWen/Xg7fGqOpM8R1+a5/fQ1fJb01Tz2uE5wP5yQ5uI5UaA=="
  crossorigin="anonymous" referrerpolicy="no-referrer" />

  <!-- Chart.js for charts & graphs -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- AOS (Animate On Scroll) for scroll animations -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

  <!-- GSAP (GreenSock) for advanced animations -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

  <!-- Lottie for JSON-based animations -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

  <!-- Swiper.js for sliders/carousels -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

  <!-- Optional: Tooltip & Popover Library (Tippy.js) -->
  <script src="https://unpkg.com/@popperjs/core@2"></script>
  <script src="https://unpkg.com/tippy.js@6/dist/tippy.css"></script>
  <script src="https://unpkg.com/tippy.js@6"></script>

</head>

{code}

</html>
`;

type props = {
  slide: { code: string };
  colors: any;
  setUpdateSlider: any;
};

function SliderFrame({ slide, colors, setUpdateSlider }: props) {
  const FINAL_CODE = HTML_DEFAULT.replace(
    "{colorCodes}",
    JSON.stringify(colors),
  ).replace("{code}", slide?.code);

  const iframeRef = useRef<any>(null);
  const selectedELRef = useRef<HTMLElement | null>(null);
  const [cardPosition, setCardPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    // Write the HTML inside the iframe
    doc.open();
    doc.write(FINAL_CODE);
    doc.close();

    // Allow iframe to capture keyboard events
    //doc.body.setAttribute("tabindex", "0");

    let hoverEl: HTMLElement | null = null;
    let selectedEL: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      if (selectedEL) return;
      const target = e.target as HTMLElement;
      if (hoverEl && hoverEl !== target) hoverEl.style.outline = "";
      hoverEl = target;
      hoverEl.style.outline = "2px dotted blue";
    };

    const handleMouseOut = () => {
      if (selectedEL) return;
      if (hoverEl) {
        hoverEl.style.outline = "";
        hoverEl = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();

      const target = (e.target as HTMLElement).closest(
        "h1,h2,h3,p,span,li,img",
      ) as HTMLElement;

      // ❗ remove previous selection
      if (selectedEL) {
        selectedEL.style.outline = "";
        selectedEL.removeAttribute("contenteditable");
      }

      // ❗ if clicking empty area → remove toolbar and exit
      if (!target) {
        selectedEL = null;
        selectedELRef.current = null;
        setCardPosition(null);
        return;
      }

      // set new selected element
      selectedEL = target;
      selectedELRef.current = target;

      selectedEL.style.outline = "2px solid blue";
      selectedEL.setAttribute("contenteditable", "true");
      selectedEL.focus();

      const rect = target.getBoundingClientRect();
      const iframeRect = iframe.getBoundingClientRect();

      setCardPosition({
        x: iframeRect.left + rect.left + rect.width / 2,
        y: iframeRect.top + rect.bottom + 2,
      });
    };

    // const handleBlur = () => {
    //   if (selectedEL) {
    //     console.log("Final edited element:", selectedEL.outerHTML);
    //     const slideRoot = iframe.contentDocument?.querySelector(
    //       "div.w-\\[800px\\].h-\\[500px\\]",
    //     );

    //     const updatedSliderCode = slideRoot?.outerHTML || selectedEL.outerHTML;

    //     if (updatedSliderCode) {
    //       setUpdateSlider(updatedSliderCode);
    //     }
    //   }
    // };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedEL) {
        selectedEL.style.outline = "";
        selectedEL.removeAttribute("contenteditable");

        selectedEL = null;
        selectedELRef.current = null;
        setCardPosition(null);
      }
    };

    // ✅ Wait for DOM content to be ready
    doc.addEventListener("DOMContentLoaded", () => {
      doc.body?.addEventListener("mouseover", handleMouseOver);
      doc.body?.addEventListener("mouseout", handleMouseOut);
      doc.body?.addEventListener("click", handleClick);
      doc.body?.addEventListener("keydown", handleKeyDown);
      doc.body?.addEventListener("click", (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest(
          "h1,h2,h3,p,span,li,img",
        );

        if (!target) {
          if (selectedEL) {
            selectedEL.style.outline = "";
            selectedEL.removeAttribute("contenteditable");
          }

          selectedEL = null;
          selectedELRef.current = null;
          setCardPosition(null);
        }
      });
    });

    // ✅ Cleanup listeners on unmount
    return () => {
      doc.body?.removeEventListener("mouseover", handleMouseOver);
      doc.body?.removeEventListener("mouseout", handleMouseOut);
      doc.body?.removeEventListener("click", handleClick);
      doc.body?.removeEventListener("keydown", handleKeyDown);
    };
  }, [slide?.code]);

  const handleAiSectionChange = async (userAiPrompt: string) => {
    setAiLoading(true);
    const selectedEL = selectedELRef.current;
    const iframe = iframeRef.current;

    if (!selectedEL || !iframe) return;

    // Get the current HTML of the selected element
    const oldHTML = selectedEL.outerHTML;

    // Build AI prompt
    const prompt = `
Regenerate or rewrite the following HTML code based on this user instruction.
If user asked to change the image/regenerate the image then make sure to use
ImageKit:
'https://ik.imagekit.io/ikmedia/ik-genimg-prompt-{imagePrompt}/{altImageName}.jpg'
Replace {imagePrompt} with relevant image prompt and altImageName with a random image name.
if user want to crop image, or remove background or scale image or optimize image then add image kit ai transformation
by providing ?tr=fo-auto,<other transformation> etc.
"User Instruction is :${userAiPrompt}"
HTML code:
${oldHTML}
`;

    try {
      const result = await GeminiAiModel.generateContent(prompt);
      const newHTML = (await result.response.text()).trim();

      // ✅ Replace only the selected element
      const tempDiv = iframe.contentDocument?.createElement("div");
      if (tempDiv) {
        tempDiv.innerHTML = newHTML;
        const newNode = tempDiv.firstElementChild;

        if (newNode && selectedEL.parentNode) {
          selectedEL.parentNode.replaceChild(newNode, selectedEL);
          selectedELRef.current = newNode as HTMLElement;
          console.log("✅ Element replaced successfully");

          const slideRoot = iframe.contentDocument?.querySelector(
            "div.w-\\[800px\\].h-\\[500px\\]",
          );

          const updatedSliderCode = slideRoot?.outerHTML;

          if (updatedSliderCode) {
            setUpdateSlider(updatedSliderCode);
          }
        }
      }
    } catch (err) {
      console.error("AI generation failed:", err);
    }
    setAiLoading(false);
    setAiPrompt("");
  };

  return (
    <div className="mb-8 flex justify-center relative">
      <div className="relative w-full max-w-[900px] aspect-video bg-white rounded-2xl shadow-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          className="absolute top-0 left-0 w-[800px] h-[500px] border-0 scale-[0.9] origin-top-left"
          sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"
        />
      </div>

      {/* AI INLINE TOOLBAR */}
      {cardPosition && (
        <div
          className="fixed flex items-center gap-2 bg-white rounded-xl shadow-lg px-3 py-2"
          style={{
            top: cardPosition.y - 17,
            left: cardPosition.x - 140,
            zIndex: 9999,
          }}
        >
          <Sparkles size={16} className="text-gray-500" />

          <input
            className="outline-none text-sm w-28"
            placeholder="Edit with AI"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />

          {aiLoading ? (
            <Loader2 size={18} className="animate-spin text-gray-500" />
          ) : (
            <ArrowRight
              size={18}
              className="cursor-pointer text-black"
              onClick={() => handleAiSectionChange(aiPrompt)}
            />
          )}

          <X
            size={18}
            className="cursor-pointer text-gray-500"
            onClick={() => {
              setAiPrompt("");
              setCardPosition(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default SliderFrame;
