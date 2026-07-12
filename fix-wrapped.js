const fs = require('fs');
let code = fs.readFileSync('app/wrapped/page.tsx', 'utf8');

// 1. Add missing lucide icons (ChevronLeft)
code = code.replace(
  'import { Sparkles, TreePine, Car, Zap, Droplets, Share2, Download, ChevronRight } from "lucide-react";',
  'import { Sparkles, TreePine, Car, Zap, Droplets, Share2, Download, ChevronRight, ChevronLeft } from "lucide-react";'
);

// 2. Import html2canvas and jspdf
code = code.replace(
  'import { toast } from "sonner";',
  'import { toast } from "sonner";\nimport html2canvas from "html2canvas";\nimport { jsPDF } from "jspdf";'
);

// 3. Add slideRef and prev function
code = code.replace(
  'const [loading, setLoading] = useState(true);',
  'const [loading, setLoading] = useState(true);\n  const slideRef = useRef<HTMLDivElement>(null);'
);

code = code.replace(
  'const next = () => {',
  'const prev = () => {\n    if (currentSlide > 0) goTo(currentSlide - 1);\n  };\n\n  const next = () => {'
);

// 4. Update handleShare to use Web Share API
code = code.replace(
  /const handleShare = \(\) => {[\s\S]*?toast\.success\("Link copied to clipboard!".*?\n.*?\n.*?\n  };/,
  `const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({ title: 'EcoSphere Wrapped', text: 'Check out my sustainability impact!', url });
        return;
      } catch (e) {
        // Fallback
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    toast.success("Link copied to clipboard!", { description: "Share your quarterly impact summary with your team." });
  };`
);

// 5. Update handleDownload to generate real PDF
code = code.replace(
  /const handleDownload = \(\) => {[\s\S]*?setTimeout\(\(\) => window\.print\(\), 500\);\n  };/,
  `const handleDownload = async () => {
    if (!slideRef.current) return;
    toast.info("Generating PDF report...", { description: "Your EcoSphere Wrapped PDF will be ready shortly." });
    try {
      const canvas = await html2canvas(slideRef.current, { scale: 2, backgroundColor: '#020617' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('EcoSphere-Wrapped-Q2-2026.pdf');
      toast.success("Download complete!");
    } catch (e) {
      toast.error("Failed to generate PDF");
      setTimeout(() => window.print(), 500); // Fallback
    }
  };`
);

// 6. Attach ref to Slide Container
code = code.replace(
  'className={`relative rounded-2xl bg-gradient-to-br ${gradients[currentSlide]}',
  'ref={slideRef}\n        className={`relative rounded-2xl bg-gradient-to-br ${gradients[currentSlide]}'
);

// 7. Add Previous button before Next button
code = code.replace(
  '{/* Next button */}',
  `{/* Previous button */}
        {currentSlide > 0 && (
          <button
            onClick={prev}
            className="absolute left-6 bottom-6 p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-all hover:scale-110 z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        {/* Next button */}`
);

fs.writeFileSync('app/wrapped/page.tsx', code);
