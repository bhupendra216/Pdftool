import { memo } from 'react';
import styles from './ToolComparisonTable.module.css';

function ToolComparisonTable({ toolName = 'PDFKira Tool', competitors = [
  { name: 'Smallpdf', hasFeature: '⚠️ Limited', isFree: '⚠️ Limited', hasAds: '❌', requiresSignup: '❌' },
  { name: 'Adobe', hasFeature: '❌', isFree: '❌', hasAds: '✅', requiresSignup: '✅' },
] }) {
  const rows = [
    { label: 'Free', values: ['✅', '⚠️ Limited', '❌'] },
    { label: 'No ads', values: ['✅', '❌', '✅'] },
    { label: 'No signup', values: ['✅', '❌', '❌'] },
    { label: 'Fast workflow', values: ['✅', '⚠️', '✅'] },
  ];

  return (
    <section className={styles.section} aria-labelledby="comparison-title">
      <div className={styles.container}>
        <h2 id="comparison-title">Why {toolName} is better than the alternatives</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Feature</th>
                <th className={styles.highlight}>PDFKira</th>
                <th>{competitors[0]?.name || 'Other Tool'}</th>
                <th>{competitors[1]?.name || 'Competitor'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ label, values }) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td className={styles.highlight}>{values[0]}</td>
                  <td>{values[1]}</td>
                  <td>{values[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default memo(ToolComparisonTable);
