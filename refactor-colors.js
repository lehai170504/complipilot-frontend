const fs = require('fs');
const path = require('path');

const replaceMap = {
  // Backgrounds
  "bg-white": "bg-background",
  "bg-slate-50": "bg-muted/30",
  "bg-slate-100": "bg-muted",
  "bg-slate-800": "bg-card",
  "bg-slate-900": "bg-card",
  "bg-slate-950": "bg-background",
  
  // Texts
  "text-slate-950": "text-foreground",
  "text-slate-900": "text-foreground",
  "text-slate-800": "text-foreground",
  "text-slate-600": "text-muted-foreground",
  "text-slate-500": "text-muted-foreground",
  "text-slate-400": "text-muted-foreground",
  "text-slate-300": "text-muted-foreground",
  
  // Borders
  "border-slate-200": "border-border",
  "border-slate-300": "border-border",
  "border-slate-700": "border-border",
  "border-slate-800": "border-border",
  "border-white/10": "border-border/50",
  "border-white/15": "border-border/50",
  
  // Primary (Cyan)
  "bg-cyan-50": "bg-primary/5",
  "bg-cyan-100": "bg-primary/10",
  "bg-cyan-200": "bg-primary/20",
  "bg-cyan-300": "bg-primary",
  "bg-cyan-400": "bg-primary",
  "text-cyan-700": "text-primary",
  "text-cyan-800": "text-primary",
  "text-cyan-600": "text-primary",
  "text-cyan-300": "text-primary",
  "border-cyan-200": "border-primary/30",
  "border-cyan-300/10": "border-primary/20",
  "border-cyan-200/40": "border-primary/30",
  
  // Destructive (Red)
  "text-red-600": "text-destructive",
  "bg-red-50": "bg-destructive/10",
  "border-red-200": "border-destructive/30",
  
  // Success (Emerald/Green)
  "text-emerald-800": "text-success",
  "text-emerald-700": "text-success",
  "text-emerald-600": "text-success",
  "bg-emerald-50": "bg-success/10",
  "bg-emerald-100": "bg-success/20",
  "border-emerald-200": "border-success/30",

  // Warning (Amber/Yellow)
  "text-amber-800": "text-warning",
  "text-amber-700": "text-warning",
  "bg-amber-50": "bg-warning/10",
  "border-amber-200": "border-warning/30",
};

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Simple Regex to replace whole words that match our tailwind classes
      for (const [oldClass, newClass] of Object.entries(replaceMap)) {
        const escapedOldClass = oldClass.split('/').join('\\/');
        const regex = new RegExp(`(?<=[\\s"'\`])${escapedOldClass}(?=[\\s"'\`])`, 'g');
        content = content.replace(regex, newClass);
      }
      
      // Auto upgrade Card components to compliance-surface
      content = content.replace(/<Card className="([^"]*)"/g, (match, classes) => {
        if (!classes.includes('compliance-surface')) {
          const newClasses = classes.split(' ').filter(c => !['border-border/50', 'bg-card', 'bg-background', 'text-card-foreground', 'shadow-sm', 'border'].includes(c)).join(' ');
          return `<Card className="compliance-surface ${newClasses}"`;
        }
        return match;
      });
      content = content.replace(/<Card>/g, `<Card className="compliance-surface">`);
      
      // Wrap mains in compliance-page-shell if not already
      // if (content.includes('<main') && !content.includes('compliance-page-shell') && directory.includes('app\\(app)')) {
      //  content = content.replace(/<main className="([^"]*)"/g, `<main className="compliance-page-shell $1"`);
      // }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Refactoring completed!');
