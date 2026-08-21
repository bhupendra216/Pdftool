import { memo } from 'react';
import { ArrowRight, Download, Move, ShieldCheck, Sparkles, Upload, Wand2 } from 'lucide-react';
import styles from './HowToUseSection.module.css';
import HowToSchema from '@/components/SchemaMarkup/HowToSchema';

const iconMap = {
  Upload,
  Move,
  Download,
  Wand2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
};

const defaultSteps = [
  { title: 'Upload Your File(s)', description: 'Drag and drop or click to upload your PDF files and start in seconds.', icon: 'Upload' },
  { title: 'Configure Settings', description: 'Choose the options you need and verify the preview before continuing.', icon: 'Wand2' },
  { title: 'Download Result', description: 'Download your finished file instantly with no email required.', icon: 'Download' },
];

function HowToUseSection({ toolName = 'PDF Tool', toolSlug = 'tools', steps = defaultSteps }) {
  const normalizedSteps = steps?.length ? steps : defaultSteps;
  const schemaSteps = normalizedSteps.map((step) => ({
    name: step.title,
    text: step.description,
  }));

  return (
    <section className={styles.section} aria-labelledby="how-to-use-title">
      <HowToSchema
        toolName={toolName}
        description={`Learn how to ${toolName.toLowerCase()} with PDFKira in a few simple steps.`}
        steps={schemaSteps}
      />
      <div className={styles.container}>
        <div className={styles.headingWrap}>
          <p className={styles.kicker}>Simple workflow</p>
          <h2 id="how-to-use-title">How to {toolName} with PDFKira</h2>
        </div>
        <p className={styles.intro}>
          Follow this quick three-step process to {toolName.toLowerCase()} without touching complicated software.
        </p>

        <div className={styles.grid}>
          {normalizedSteps.map((step, index) => {
            const Icon = iconMap[step.icon] || Wand2;
            return (
              <article className={styles.card} key={`${toolSlug}-step-${index}`}>
                <div className={styles.stepHeader}>
                  <span className={styles.number}>{index + 1}</span>
                  <span className={styles.iconWrap} aria-hidden="true">
                    <Icon size={24} />
                  </span>
                </div>
                <div className={styles.content}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                <div className={styles.placeholder} aria-label={`Screenshot: ${step.title}`}>
                  Screenshot: {step.title}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(HowToUseSection);
