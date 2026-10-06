export interface AiJobCompany {
  slug: string;
  name: string;
  description: string;
  categories: string[];
  url: string;
  logo?: string;
}

export const companies: AiJobCompany[] = [
  {
    slug: "micro1",
    name: "micro1",
    description: "AI training company hiring for data annotation, video annotation, transcription, and document review, including beginner-friendly work.",
    categories: ["Data Annotation", "Transcription", "Video Annotation"],
    url: "https://www.micro1.ai/experts/opportunities",
  },
  {
    slug: "rws-trainai",
    name: "RWS (TrainAI Community)",
    description: "Global language company running an AI data-annotation and transcription community.",
    categories: ["Data Annotation", "Transcription", "Translation"],
    url: "https://www.rws.com/about/careers/",
  },
  {
    slug: "outlier",
    name: "Outlier (Scale AI)",
    description: "Higher-paying, more complex annotation and model-evaluation projects for experienced contributors.",
    categories: ["Data Annotation", "Model Evaluation", "RLHF"],
    url: "https://outlier.ai",
  },
  {
    slug: "appen",
    name: "Appen (CrowdGen)",
    description: "One of the largest crowdsourced annotation platforms, with multilingual and translation work.",
    categories: ["Data Annotation", "Translation", "Transcription"],
    url: "https://crowdgen.com",
  },
  {
    slug: "telus-digital",
    name: "TELUS Digital (AI Community)",
    description: "Content evaluation, ad assessment, and search-quality rating tasks.",
    categories: ["Content Rating", "Data Annotation"],
    url: "https://www.telusdigital.com/careers/ai-community",
  },
  {
    slug: "welocalize",
    name: "Welocalize (Welo Data)",
    description: "Translation and localization company with an active AI data-annotation arm.",
    categories: ["Translation", "Localization", "Data Annotation"],
    url: "https://welodata.ai",
  },
  {
    slug: "clickworker",
    name: "Clickworker",
    description: "Microtask platform for quick annotation, surveys, and data labeling, good for getting started.",
    categories: ["Data Annotation", "Microtasks"],
    url: "https://www.clickworker.com/clickworker/",
  },
  {
    slug: "dataannotation",
    name: "DataAnnotation.tech",
    description: "LLM response ranking and evaluation, best suited for strong writers and coders.",
    categories: ["LLM Evaluation", "Writing Review"],
    url: "https://www.dataannotation.tech",
  },
  {
    slug: "surge-ai",
    name: "Surge AI",
    description: "RLHF and LLM-alignment focused annotation work.",
    categories: ["RLHF", "LLM Evaluation"],
    url: "https://surgehq.ai",
  },
  {
    slug: "toloka",
    name: "Toloka",
    description: "Flexible microtasks with broad geographic availability.",
    categories: ["Data Annotation", "Microtasks"],
    url: "https://toloka.ai",
  },
  {
    slug: "oneforma",
    name: "OneForma",
    description: "Translation, transcription, and search/ads judging tasks.",
    categories: ["Translation", "Transcription", "Judging"],
    url: "https://www.oneforma.com",
  },
  {
    slug: "remotasks",
    name: "Remotasks",
    description: "Image labeling and audio transcription, beginner-friendly entry point.",
    categories: ["Image Labeling", "Transcription"],
    url: "https://www.remotasks.com",
  },
  {
    slug: "imerit",
    name: "iMerit",
    description: "Image and video annotation, including content classification work.",
    categories: ["Image Annotation", "Video Annotation"],
    url: "https://imerit.ai/careers/",
  },
  {
    slug: "mercor",
    name: "Mercor",
    description: "Longer-term, contract-based AI training roles for experienced professionals.",
    categories: ["AI Training", "Contract Roles"],
    url: "https://www.mercor.com/careers/",
  },
];
