import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Mineral } from '../schema/mineralSchema';

export const exportAsJson = async (mineral: Mineral) => {
  const data = {
    _meta: {
      generatedOn: new Date().toISOString(),
      source: "Critical Minerals Intelligence Platform"
    },
    ...mineral
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `${mineral.slug}-report.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const exportAsCsv = async (mineral: Mineral) => {
  const rows = [
    ['Data Type', 'Country', 'Share %', 'Amount (MT)'],
    ...mineral.production.map(p => ['Production', p.country, p.share, p.amount_mt || 'N/A']),
    ...mineral.reserves.map(r => ['Reserve', r.country, r.share, r.amount_mt || 'N/A'])
  ];
  
  const csvContent = rows.map(e => e.join(",")).join("\n");
  const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `${mineral.slug}-data.csv`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const exportAsMarkdown = async (mineral: Mineral) => {
  const generatedOn = new Date().toLocaleString();
  const md = `# ${mineral.name} (${mineral.symbol}) Report
  
*Generated on: ${generatedOn}*
*Source: Critical Minerals Intelligence Platform*

## Overview
- **Category:** ${mineral.category}
- **Risk Score:** ${mineral.riskScore}
- **Atomic Number:** ${mineral.atomicNumber}

${mineral.tagline}

## Uses
| Use Case | Share % |
|---|---|
${mineral.useCases.map(u => `| ${u.label} | ${u.share}% |`).join('\n')}

## Top Producers
| Country | Share % | Amount (MT) |
|---|---|---|
${mineral.production.map(p => `| ${p.country} | ${p.share}% | ${p.amount_mt ? p.amount_mt : 'N/A'} |`).join('\n')}

## Top Reserves
| Country | Share % | Amount (MT) |
|---|---|---|
${mineral.reserves.map(r => `| ${r.country} | ${r.share}% | ${r.amount_mt ? r.amount_mt : 'N/A'} |`).join('\n')}

## Choke Points
${mineral.chokePoints.length > 0 ? mineral.chokePoints.map(c => `### ${c.title} (${c.severity})\n${c.description}`).join('\n\n') : 'None reported.'}

## ESG Risks
| Country | Category | Severity | Summary |
|---|---|---|---|
${mineral.esgRisks && mineral.esgRisks.length > 0 ? mineral.esgRisks.map(e => `| **${e.country}** | ${e.category} | ${e.severity} | ${e.summary} |`).join('\n') : '| None reported | - | - | - |'}

---
*Market estimates subject to revision.*
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
  const generatedOn = new Date().toLocaleString();
  
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(`Generated on: ${generatedOn}`, 14, 10);
  doc.text(`Internal Use Only`, 170, 10);

  doc.setTextColor(0);
  doc.setFontSize(20);
  doc.text(`${mineral.name} (${mineral.symbol}) Report`, 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Category: ${mineral.category}`, 14, 30);
  doc.text(`Risk Score: ${mineral.riskScore}`, 14, 36);
  doc.text(`Description: ${mineral.tagline}`, 14, 42, { maxWidth: 180 });
  
  let yPos = 55;
  doc.text('Uses:', 14, yPos);
  autoTable(doc, {
    startY: yPos + 4,
    head: [['Use Case', 'Share %']],
    body: mineral.useCases.map(u => [u.label, u.share.toString()]),
  });
  // @ts-expect-error - jspdf-autotable adds lastAutoTable property to doc
  yPos = doc.lastAutoTable.finalY + 10;

  if (yPos > 240) { doc.addPage(); yPos = 20; }
  doc.text('Top Producers:', 14, yPos);
  autoTable(doc, {
    startY: yPos + 4,
    head: [['Country', 'Share %', 'Amount (MT)']],
    body: mineral.production.map(p => [p.country, p.share.toString(), p.amount_mt ? p.amount_mt.toString() : 'N/A']),
  });
  // @ts-expect-error - jspdf-autotable adds lastAutoTable property to doc
  yPos = doc.lastAutoTable.finalY + 10;

  if (yPos > 240) { doc.addPage(); yPos = 20; }
  doc.text('Top Reserves:', 14, yPos);
  autoTable(doc, {
    startY: yPos + 4,
    head: [['Country', 'Share %', 'Amount (MT)']],
    body: mineral.reserves.map(r => [r.country, r.share.toString(), r.amount_mt ? r.amount_mt.toString() : 'N/A']),
  });
  // @ts-expect-error - jspdf-autotable adds lastAutoTable property to doc
  yPos = doc.lastAutoTable.finalY + 10;
  
  if (mineral.chokePoints.length > 0) {
    if (yPos > 240) { doc.addPage(); yPos = 20; }
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
    if (yPos > 240) {
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

  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("Source: Critical Minerals Intelligence Platform | Market estimates subject to revision.", 14, 290);
  
  doc.save(`${mineral.slug}-report.pdf`);
};
