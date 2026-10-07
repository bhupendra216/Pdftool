// Platform shape: edit, add, or remove one object here to maintain the directory.
// The first category listed is the platform's primary section; later categories are cross-references.
export type GigCategory =
  | "translation"
  | "video-recording"
  | "photo-collection"
  | "handwriting"
  | "problem-solving"
  | "data-annotation"
  | "speech-audio";

export interface GigPlatform {
  name: string;
  categories: GigCategory[];
  description: string;
  taskExamples: string[];
  payRange: string;
  signupUrl: string;
  referralUrl?: string;
  ratingNote?: string;
  beginnerFriendly: boolean;
}

export const gigCategorySections: Array<{ id: GigCategory; title: string }> = [
  { id: "translation", title: "🌐 Translation & Language Jobs" },
  { id: "video-recording", title: "🎥 Video Recording & AI Training" },
  { id: "photo-collection", title: "📸 Photo Collection Gigs" },
  { id: "handwriting", title: "✍️ Handwriting Tasks" },
  { id: "problem-solving", title: "📝 Problem-Solving & AI Training Tasks" },
  { id: "data-annotation", title: "🏷️ General Data Annotation" },
];

export const gigPlatforms: GigPlatform[] = [
  {
    name: "OneForma",
    categories: ["translation", "photo-collection", "handwriting", "data-annotation"],
    description: "A global project marketplace offering language, data collection, and AI data tasks. Available work and qualification requirements vary by project and location.",
    taskExamples: ["Translate short text and search queries", "Photograph everyday objects for dataset collection", "Write words or sentences by hand for OCR datasets", "Label images and review search results"],
    payRange: "Varies by project",
    signupUrl: "https://www.oneforma.com/jobs/",
    beginnerFriendly: true,
  },
  {
    name: "TELUS Digital AI Community",
    categories: ["translation", "photo-collection", "handwriting"],
    description: "A community marketplace for language, online-content evaluation, and data collection projects. Some roles require language tests, local knowledge, or other qualifications.",
    taskExamples: ["Review or translate short language samples", "Take requested photos for local data projects", "Handwrite prompts for text-recognition tasks", "Rate search results or online content"],
    payRange: "Varies by role and location",
    signupUrl: "https://www.telusdigital.com/careers/ai-community",
    beginnerFriendly: true,
  },
  {
    name: "TransPerfect DataForce",
    categories: ["translation"],
    description: "TransPerfect's DataForce community recruits contributors for language and AI data projects. Tasks depend on the active project and can require particular languages or locales.",
    taskExamples: ["Translate short passages", "Check translated text for natural phrasing", "Review localized product descriptions", "Evaluate language samples"],
    payRange: "Varies by project",
    signupUrl: "https://dataforcecommunity.transperfect.com/",
    beginnerFriendly: true,
  },
  {
    name: "Welocalize",
    categories: ["translation"],
    description: "A language-services company that hires freelance linguists and remote contributors for localization and AI-related projects. Requirements differ across contract openings.",
    taskExamples: ["Translate or edit short content", "Review localized search results", "Check subtitles for language quality", "Rate text for relevance and fluency"],
    payRange: "Varies by role",
    signupUrl: "https://jobs.lever.co/welocalize",
    beginnerFriendly: false,
  },
  {
    name: "Gengo",
    categories: ["translation"],
    description: "An online translation marketplace where qualified translators can complete customer translation orders. A language test is required before accepting work.",
    taskExamples: ["Translate short customer messages", "Translate product descriptions", "Localize website text", "Review translated passages for accuracy"],
    payRange: "Typically about $0.03–$0.08 per source word; varies by language and order",
    signupUrl: "https://gengo.com/translators/",
    beginnerFriendly: false,
  },
  {
    name: "Unbabel",
    categories: ["translation"],
    description: "A language-operations platform combining AI with human review for multilingual content. Contributor openings and language pairs vary.",
    taskExamples: ["Post-edit machine-translated text", "Review customer-support messages", "Correct grammar and terminology", "Check short translations for meaning"],
    payRange: "Varies by project",
    signupUrl: "https://unbabel.com/careers/",
    beginnerFriendly: false,
  },
  {
    name: "Appen / CrowdGen",
    categories: ["translation", "data-annotation"],
    description: "CrowdGen by Appen connects contributors with remote data projects, including multilingual evaluation and data labeling. Projects have their own screening and availability.",
    taskExamples: ["Judge translated sentences", "Review short text for meaning and quality", "Categorize images or text", "Check search results against guidelines"],
    payRange: "Varies by project and country",
    signupUrl: "https://crowdgen.com/",
    beginnerFriendly: true,
  },
  {
    name: "OpenTrain.ai",
    categories: ["video-recording"],
    description: "A contributor platform for supplying human-created data used in AI training, including video and other real-world recordings when projects are available.",
    taskExamples: ["Record household activities for AI training", "Capture short clips following a project brief", "Demonstrate everyday object interactions", "Submit consented footage that meets recording guidelines"],
    payRange: "Varies by project",
    signupUrl: "https://opentrain.ai/",
    beginnerFriendly: true,
  },
  {
    name: "Outlier (Scale AI)",
    categories: ["video-recording", "problem-solving"],
    description: "A Scale AI contributor platform with AI evaluation and training projects; some projects include video data, while others require subject knowledge and written reasoning.",
    taskExamples: ["Record video responses for a project", "Assess an AI answer for accuracy", "Explain how to solve a subject-specific problem", "Compare responses and give written feedback"],
    payRange: "Some roles advertise roughly $15–$50/hour; rates and availability vary",
    signupUrl: "https://outlier.ai/",
    beginnerFriendly: false,
  },
  {
    name: "Remoter.me",
    categories: ["video-recording"],
    description: "A remote-work marketplace that lists paid AI data collection opportunities, including video-recording tasks when projects are open.",
    taskExamples: ["Record short everyday-action videos", "Capture clips from requested viewpoints", "Follow instructions for lighting and framing", "Upload project footage with the required consent"],
    payRange: "Varies by project",
    signupUrl: "https://remoter.me/",
    beginnerFriendly: true,
  },
  {
    name: "Clickworker",
    categories: ["photo-collection", "handwriting", "data-annotation"],
    description: "A microtask platform with short online tasks and occasional data collection projects. Task availability depends on your profile, location, and assessments.",
    taskExamples: ["Photograph products or places when invited to a project", "Handwrite text for image-based collection tasks", "Categorize short text or images", "Check product data for completeness"],
    payRange: "Varies by task",
    signupUrl: "https://www.clickworker.com/clickworker/",
    beginnerFriendly: true,
  },
  {
    name: "Neevo (Defined.ai)",
    categories: ["photo-collection", "data-annotation"],
    description: "Defined.ai's Neevo contributor platform offers occasional crowdsourced data tasks. Projects can include images, language, and other AI-training data, subject to eligibility.",
    taskExamples: ["Submit requested photos for a dataset", "Check labels on images", "Review short text or audio samples", "Validate example data against instructions"],
    payRange: "Varies by task",
    signupUrl: "https://neevo.ai/",
    beginnerFriendly: true,
  },
  {
    name: "Mindrift",
    categories: ["handwriting", "data-annotation"],
    description: "A remote AI training platform offering text evaluation and data tasks through project-based contributor opportunities. Screening and subject-matter requirements vary.",
    taskExamples: ["Handwrite requested samples for text recognition", "Compare AI-generated answers", "Check text for clarity and factual errors", "Label or review examples using project guidelines"],
    payRange: "Varies by project",
    signupUrl: "https://mindrift.ai/",
    beginnerFriendly: false,
  },
  {
    name: "Alignerr",
    categories: ["problem-solving"],
    description: "A specialist contributor network for evaluating and improving AI systems. Many assignments require relevant subject expertise and successful qualification.",
    taskExamples: ["Solve and explain subject-specific questions", "Review an AI-generated solution for errors", "Write example questions and answers", "Compare two responses using a rubric"],
    payRange: "Varies by role and project",
    signupUrl: "https://www.alignerr.com/",
    beginnerFriendly: false,
  },
  {
    name: "Mercor",
    categories: ["problem-solving"],
    description: "A talent marketplace that matches qualified professionals with AI-related contract work, including expert evaluation and problem-solving assignments.",
    taskExamples: ["Complete a role-specific skills assessment", "Review AI answers in your area of expertise", "Explain or verify a worked solution", "Provide structured feedback on model responses"],
    payRange: "Varies by contract",
    signupUrl: "https://www.mercor.com/",
    beginnerFriendly: false,
  },
  {
    name: "Prolific",
    categories: ["problem-solving", "data-annotation"],
    description: "A research-participant platform with studies from academic and commercial researchers, including studies about AI. Study availability depends on your profile and eligibility.",
    taskExamples: ["Answer questions in an AI research study", "Compare or rate written responses", "Complete a short reasoning exercise", "Review text or images as a research participant"],
    payRange: "Study-dependent; minimum £6/$8 per hour under Prolific's participant-pay guidance",
    signupUrl: "https://www.prolific.com/participants",
    beginnerFriendly: true,
  },
];
