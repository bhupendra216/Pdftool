import { useSEO } from "@/hooks/use-seo";
import { ResumeBuilder } from "@/labs/resume-builder/ResumeBuilder";
import "@/labs/resume-builder/resume-builder.css";

export default function ResumeBuilderPage() {
  useSEO({
    title: "Resume & CV Builder",
    description: "Create and format a resume in your browser. Your resume stays on your device; print or save it as a PDF.",
  });

  return <ResumeBuilder />;
}
