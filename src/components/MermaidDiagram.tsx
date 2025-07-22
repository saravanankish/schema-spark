import { useEffect, useRef } from 'react';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export const MermaidDiagram = ({ chart, className = "" }: MermaidDiagramProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current && chart) {
      // For now, display the mermaid syntax as text
      // In a real implementation, you would use the mermaid library
      elementRef.current.innerHTML = `
        <div class="bg-background rounded-lg p-4 border border-border">
          <div class="text-sm font-medium text-foreground mb-2">Entity Relationship Diagram</div>
          <div class="text-xs text-muted-foreground mb-4">Mermaid ERD Syntax (Ready for rendering)</div>
          <pre class="text-sm font-mono text-foreground whitespace-pre-wrap leading-relaxed">${chart}</pre>
          <div class="mt-4 p-3 bg-muted/50 rounded text-xs text-muted-foreground">
            💡 This ERD can be rendered in any Mermaid-compatible viewer or integrated with the Mermaid.js library for visual diagrams.
          </div>
        </div>
      `;
    }
  }, [chart]);

  return <div ref={elementRef} className={className} />;
};