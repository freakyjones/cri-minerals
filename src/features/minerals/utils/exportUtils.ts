import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Mineral } from '../schema/mineralSchema';

export const exportAsJson = async (mineral: Mineral) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mineral, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `${mineral.slug}-report.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const exportAsMarkdown = async (mineral: Mineral) => {
  const md = `# ${mineral.name} (${mineral.symbol}) Report
  
## Overview
- **Category:** ${mineral.category}
- **Risk Score:** ${mineral.riskScore}
- **Atomic Number:** ${mineral.atomicNumber}

${mineral.tagline}

## Uses
${mineral.useCases.map(u => `- ${u.label}: ${u.share}%`).join('\n')}

## Top Producers
${mineral.production.map(p => `- ${p.country}: ${p.share}% ${p.amount_mt ? `(${p.amount_mt} MT)` : ''}`).join('\n')}

## Top Reserves
${mineral.reserves.map(r => `- ${r.country}: ${r.share}%`).join('\n')}

## Choke Points
${mineral.chokePoints.length > 0 ? mineral.chokePoints.map(c => `### ${c.title} (${c.severity})\n${c.description}`).join('\n\n') : 'None reported.'}

## ESG Risks
${mineral.esgRisks && mineral.esgRisks.length > 0 ? mineral.esgRisks.map(e => `- **${e.country}** (${e.category} - ${e.severity}): ${e.summary}`).join('\n') : 'None reported.'}
`;

  const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `${mineral.slug}-report.md`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const exportAsPdf = async (mineral: Mineral) => {
  // Adding artificial delay to show off the cool loading state UI 
  // since local generation is usually too fast to notice.
  await new Promise(resolve => setTimeout(resolve, 800));

  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text(`${mineral.name} (${mineral.symbol}) Report`, 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Category: ${mineral.category}`, 14, 30);
  doc.text(`Risk Score: ${mineral.riskScore}`, 14, 36);
  doc.text(`Description: ${mineral.tagline}`, 14, 42, { maxWidth: 180 });
  
  let yPos = 55;
  doc.text('Top Producers:', 14, yPos);
  
  autoTable(doc, {
    startY: yPos + 4,
    head: [['Country', 'Share %', 'Amount (MT)']],
    body: mineral.production.map(p => [p.country, p.share.toString(), p.amount_mt ? p.amount_mt.toString() : 'N/A']),
  });
  
  // @ts-expect-error - jspdf-autotable adds lastAutoTable property to doc
  yPos = doc.lastAutoTable.finalY + 10;
  
  if (mineral.chokePoints.length > 0) {
    doc.text('Choke Points:', 14, yPos);
    autoTable(doc, {
      startY: yPos + 4,
      head: [['Title', 'Severity', 'Description']],
      body: mineral.chokePoints.map(c => [c.title, c.severity, c.description]),
    });
    // @ts-expect-error - jspdf-autotable adds lastAutoTable property to doc
    yPos = doc.lastAutoTable.finalY + 10;
  }
  
  if (mineral.esgRisks && mineral.esgRisks.length > 0) {
    // Check if we need to add a new page to fit the ESG table
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text('ESG Risks:', 14, yPos);
    autoTable(doc, {
      startY: yPos + 4,
      head: [['Country', 'Category', 'Severity', 'Summary']],
      body: mineral.esgRisks.map(e => [e.country, e.category, e.severity, e.summary]),
    });
  }
  
  doc.save(`${mineral.slug}-report.pdf`);
};
