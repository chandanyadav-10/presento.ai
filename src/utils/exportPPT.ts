import PptxGenJS from "pptxgenjs";
import html2canvas from "html2canvas";

export const exportSlidesToPPT = async (slideElements: HTMLElement[]) => {

const pptx = new PptxGenJS();
pptx.defineLayout({ name: "CUSTOM", width: 10, height: 5.625 });
pptx.layout = "CUSTOM";

for (let i = 0; i < slideElements.length; i++) {


const iframe = slideElements[i].querySelector("iframe") as HTMLIFrameElement;
if (!iframe) continue;

const iframeDoc = iframe.contentDocument;
if (!iframeDoc) continue;

const slideBody = iframeDoc.body;

console.log("Exporting slide:", i + 1);

const canvas = await html2canvas(slideBody, {
  scale: 2,
  backgroundColor: null,
  useCORS: true
});

const imgData = canvas.toDataURL("image/png");

const slide = pptx.addSlide();

slide.addImage({
  data: imgData,
  x: 0,
  y: 0,
  w: 10,
  h: 5.625
});


}

await pptx.writeFile({
fileName: "AI-Presentation.pptx"
});

};
