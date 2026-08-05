export type ImageConversionPageConfig = {
  slug: string;
  source: string;
  target: string;
  title: string;
  description: string;
  whatIs: string;
  whyConvert: string;
  howTo: string[];
  features: string[];
  faqs: { question: string; answer: string }[];
  related: { label: string; href: string }[];
};

export const IMAGE_CONVERSION_PAGES: Record<string, ImageConversionPageConfig> = {
  "svg-to-png": {
    slug: "svg-to-png", source: "SVG", target: "PNG",
    title: "Convert SVG to PNG Online",
    description: "Turn SVG files into crisp PNG images online with PDFKira. Upload, preview, and download without installing software.",
    whatIs: "SVG is a vector image format that stays sharp at any size. PNG is a pixel-based format supported by browsers, editors, and everyday sharing tools.",
    whyConvert: "Converting SVG to PNG is useful when a website, presentation, marketplace, or design app needs a ready-to-use raster image. PNG also preserves transparency for logos, icons, and illustrations.",
    howTo: ["Upload an SVG by dragging it into the converter or choosing it from your device.", "Check the preview and select PNG as the output format.", "Choose Convert, then download the finished PNG."],
    features: ["Transparent backgrounds are supported", "Preview the image before downloading", "Works on desktop, tablet, and mobile"],
    faqs: [
      { question: "Will my SVG transparency be preserved?", answer: "Yes. Transparent areas remain transparent in the PNG whenever the source SVG supports them." },
      { question: "Can I convert an SVG on my phone?", answer: "Yes. The converter works in a modern mobile browser without an app installation." },
    ],
    related: [{ label: "SVG to JPG", href: "/convert/svg-to-jpg" }, { label: "SVG to WebP", href: "/convert/svg-to-webp" }, { label: "PNG to SVG", href: "/convert/png-to-svg" }],
  },
  "svg-to-jpg": {
    slug: "svg-to-jpg", source: "SVG", target: "JPG",
    title: "Convert SVG to JPG Online",
    description: "Convert SVG graphics to JPG images online with a simple upload and download workflow from PDFKira.",
    whatIs: "SVG stores artwork as scalable paths, while JPG stores a compact raster image. JPG is widely accepted by photo sites, email tools, and document editors.",
    whyConvert: "SVG to JPG conversion is helpful when you need a broadly compatible image with a smaller file size and no need for transparency.",
    howTo: ["Drop your SVG into the image converter.", "Select JPG as the output format and review the preview.", "Convert the file and download the JPG."],
    features: ["Fast browser-based conversion", "Useful for websites and documents", "No account required"],
    faqs: [
      { question: "Does JPG support transparent backgrounds?", answer: "No. JPG does not support transparency, so transparent SVG areas are rendered against a solid background." },
      { question: "Is the original SVG changed?", answer: "No. Your original file stays on your device and the converter creates a separate JPG download." },
    ],
    related: [{ label: "SVG to PNG", href: "/convert/svg-to-png" }, { label: "SVG to WebP", href: "/convert/svg-to-webp" }, { label: "JPG to PNG", href: "/convert/jpg-to-png" }],
  },
  "svg-to-webp": {
    slug: "svg-to-webp", source: "SVG", target: "WebP",
    title: "Convert SVG to WebP Online",
    description: "Create a lightweight WebP image from an SVG online. PDFKira keeps the workflow quick and easy to preview.",
    whatIs: "SVG is a scalable vector format. WebP is a modern web image format designed for efficient delivery while supporting transparency and strong visual quality.",
    whyConvert: "WebP can help reduce image weight on websites and web apps while keeping logos and illustrations looking clean.",
    howTo: ["Upload your SVG with drag and drop or Browse.", "Set the output format to WebP and inspect the preview.", "Start the conversion and download the WebP file."],
    features: ["Modern format for web delivery", "Keeps transparent artwork usable", "Simple preview and download flow"],
    faqs: [
      { question: "Is WebP supported by modern browsers?", answer: "Yes. WebP is supported by current major browsers and is a practical choice for many websites." },
      { question: "Can I use the converted WebP commercially?", answer: "The conversion tool creates a new file, but you remain responsible for having the rights to use the original artwork." },
    ],
    related: [{ label: "SVG to PNG", href: "/convert/svg-to-png" }, { label: "WebP to PNG", href: "/convert/webp-to-png" }, { label: "PNG to WebP", href: "/convert/png-to-webp" }],
  },
  "png-to-svg": {
    slug: "png-to-svg", source: "PNG", target: "SVG",
    title: "Convert PNG to SVG Online",
    description: "Convert PNG images to SVG online for scalable use. Upload your image and download the result from PDFKira.",
    whatIs: "PNG is a raster format made from pixels. SVG is a vector format that describes shapes and paths, making it useful for scalable graphics.",
    whyConvert: "PNG to SVG conversion can make simple logos, icons, and line artwork easier to resize. Detailed photographs may need dedicated vector-tracing software for the best result.",
    howTo: ["Upload a PNG image to the converter.", "Choose SVG as the output format and review the preview.", "Convert the image and download the SVG."],
    features: ["Convenient browser workflow", "Good fit for simple graphics", "Original upload is not overwritten"],
    faqs: [
      { question: "Will every PNG become a perfect vector?", answer: "Raster-to-vector conversion works best for clean, high-contrast artwork. Photos and complex textures may need manual refinement." },
      { question: "Can I resize the resulting SVG?", answer: "Yes. SVG graphics can be scaled without the same pixelation as the original PNG." },
    ],
    related: [{ label: "SVG to PNG", href: "/convert/svg-to-png" }, { label: "PNG to WebP", href: "/convert/png-to-webp" }, { label: "WebP to PNG", href: "/convert/webp-to-png" }],
  },
  "webp-to-png": {
    slug: "webp-to-png", source: "WebP", target: "PNG",
    title: "Convert WebP to PNG Online",
    description: "Convert WebP images to PNG files online for compatibility with editors, documents, and design workflows.",
    whatIs: "WebP is an efficient modern web format. PNG is a widely supported lossless format that works well when transparency and editing compatibility matter.",
    whyConvert: "WebP to PNG conversion is useful when an editor or upload form does not accept WebP, or when you need a lossless working copy.",
    howTo: ["Upload your WebP image.", "Select PNG as the output format and check the preview.", "Convert and download the PNG file."],
    features: ["Preserves supported transparency", "Easy compatibility handoff", "Works without desktop software"],
    faqs: [
      { question: "Will converting WebP to PNG improve image quality?", answer: "It cannot restore detail already lost in the WebP, but PNG avoids adding another lossy compression step to the exported copy." },
      { question: "Are animated WebP files supported?", answer: "The converter is intended for still images. Animated files may be reduced to a single frame depending on the source." },
    ],
    related: [{ label: "PNG to WebP", href: "/convert/png-to-webp" }, { label: "WebP to JPG", href: "/convert/webp-to-jpg" }, { label: "SVG to WebP", href: "/convert/svg-to-webp" }],
  },
  "png-to-webp": {
    slug: "png-to-webp", source: "PNG", target: "WebP",
    title: "Convert PNG to WebP Online",
    description: "Convert PNG images to efficient WebP files online for faster websites and smaller downloads.",
    whatIs: "PNG is a dependable lossless image format. WebP is a newer format that can deliver similar visual quality at a smaller size in many cases.",
    whyConvert: "PNG to WebP conversion can reduce the weight of website images and make sharing or loading assets more efficient.",
    howTo: ["Upload a PNG image.", "Choose WebP as the output format and preview the result.", "Convert the image and download your WebP file."],
    features: ["Designed for modern web workflows", "Supports transparent PNG artwork", "No software installation needed"],
    faqs: [
      { question: "Does WebP support transparency?", answer: "Yes. WebP can preserve transparency from a PNG when the source and conversion settings support it." },
      { question: "Can I use WebP outside a website?", answer: "Yes. WebP is also useful for apps and sharing, although you should check that the destination supports it." },
    ],
    related: [{ label: "WebP to PNG", href: "/convert/webp-to-png" }, { label: "PNG to SVG", href: "/convert/png-to-svg" }, { label: "SVG to WebP", href: "/convert/svg-to-webp" }],
  },
};
