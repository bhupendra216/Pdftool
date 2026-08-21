import { memo } from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import { Link } from 'wouter';
import styles from './ToolGrid.module.css';

const filters = ['All', 'Convert', 'Edit', 'Organize', 'Secure'];

function ToolGrid({ tools = [] }) {
  const toolList = tools.length ? tools : [
    { slug: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDFs into a single file.' },
    { slug: 'split-pdf', name: 'Split PDF', description: 'Extract only the pages you need.' },
    { slug: 'compress-pdf', name: 'Compress PDF', description: 'Reduce file size without losing readability.' },
    { slug: 'pdf-to-word', name: 'PDF to Word', description: 'Turn PDFs into editable Word files.' },
  ];

  return (
    <section className={styles.section} aria-labelledby="tool-grid-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 id="tool-grid-title">All free PDF tools</h2>
          <div className={styles.filters} aria-label="Tool categories">
            {filters.map((filter) => (
              <button key={filter} type="button" className={styles.filter} aria-pressed={filter === 'All'}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {toolList.map((tool) => (
            <Link key={tool.slug} href={`/${tool.slug}`} className={styles.card}>
              <div className={styles.iconWrap} aria-hidden="true"><FileText size={22} /></div>
              <div className={styles.titleRow}>
                <h3>{tool.name}</h3>
                <ArrowRight size={16} />
              </div>
              <p>{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(ToolGrid);
