const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// 1. Add import for html2pdf
if (!code.includes('html2pdf.js')) {
  code = code.replace(/import \{ Filter,/, "import html2pdf from 'html2pdf.js';\nimport { FileDown, Filter,");
}

// 2. Add ref
if (!code.includes('const dashboardRef = useRef<HTMLDivElement>(null);')) {
  code = code.replace('const dropdownRef = useRef<HTMLDivElement>(null);', 'const dropdownRef = useRef<HTMLDivElement>(null);\n  const dashboardRef = useRef<HTMLDivElement>(null);');
}

// 3. Add PDF generation function
const pdfFunc = `
  const handleExportPDF = () => {
    if (!dashboardRef.current) return;
    const opt = {
      margin: 10,
      filename: selectedIntegradoIds.length === 1 ? \`relatorio_\${filteredIntegrados[0]?.name || 'lote'}.pdf\` : 'relatorio_dashboard.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(dashboardRef.current).save();
  };
`;
if (!code.includes('handleExportPDF')) {
  code = code.replace('return (', pdfFunc + '\n  return (');
}

// 4. Add dashboardRef to root div
code = code.replace('<div className="space-y-6">', '<div className="space-y-6" ref={dashboardRef}>');

// 5. Add Export Button
const exportBtn = `
          {selectedIntegradoIds.length === 1 && (
            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg shadow-sm w-full md:w-auto font-medium transition-colors"
            >
              <FileDown className="w-4 h-4" />
              Gerar Relatório PDF
            </button>
          )}
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm w-full md:w-auto">
`;
if (!code.includes('handleExportPDF}')) {
  code = code.replace('<div className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm w-full md:w-auto">', exportBtn);
}

fs.writeFileSync('src/components/Dashboard.tsx', code);
