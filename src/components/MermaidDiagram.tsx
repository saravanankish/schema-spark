import { cn } from '@/lib/utils';
import mermaid from 'mermaid';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from './ui/skeleton';

interface MermaidDiagramProps {
	chart: string;
	className?: string;
}

export const MermaidDiagram = ({
	chart,
	className = '',
}: MermaidDiagramProps) => {
	const elementRef = useRef<HTMLDivElement>(null);
	const [isRendering, setRendering] = useState<boolean>(false);

	useEffect(() => {
		// Initialize mermaid
		mermaid.initialize({
			startOnLoad: true,
			theme: 'dark',
			themeVariables: {
				primaryColor: '#8b5cf6',
				primaryTextColor: '#ffffff',
				primaryBorderColor: '#a855f7',
				lineColor: '#6b7280',
				secondaryColor: '#1f2937',
				tertiaryColor: '#374151',
				background: '#0f172a',
				mainBkg: '#1e293b',
				secondBkg: '#334155',
				tertiaryBkg: '#475569',
			},
		});
	}, []);

	useEffect(() => {
		if (elementRef.current && chart) {
			// Clear previous content
			elementRef.current.innerHTML = '';

			// Create a unique ID for this diagram
			const id = `mermaid-${Date.now()}`;

			try {
				// Render the mermaid diagram
				setRendering(true);
				setTimeout(() => {
					mermaid
						.render(id, chart)
						.then(({ svg }) => {
							if (elementRef.current) {
								setRendering(false);
								elementRef.current.innerHTML = svg;
							}
						})
						.catch(error => {
							console.error('Mermaid rendering error:', error);
							// Fallback to text display
							if (elementRef.current) {
								elementRef.current.innerHTML = `
              <div class="bg-muted/50 rounded-lg p-4 border border-border">
                <div class="text-sm font-medium text-foreground mb-2">Entity Relationship Diagram</div>
                <div class="text-xs text-muted-foreground mb-4">Mermaid ERD Syntax (Rendering Error)</div>
                <pre class="text-sm font-mono text-foreground whitespace-pre-wrap leading-relaxed">${chart}</pre>
                <div class="mt-4 p-3 bg-destructive/10 rounded text-xs text-destructive">
                  ⚠️ Could not render diagram visually. Showing syntax instead.
                </div>
              </div>
            `;
							}
						});
				}, 500);
			} catch (error) {
				console.error('Mermaid error:', error);
				// Fallback to text display
				if (elementRef.current) {
					elementRef.current.innerHTML = `
            <div class="bg-muted/50 rounded-lg p-4 border border-border">
              <div class="text-sm font-medium text-foreground mb-2">Entity Relationship Diagram</div>
              <div class="text-xs text-muted-foreground mb-4">Mermaid ERD Syntax</div>
              <pre class="text-sm font-mono text-foreground whitespace-pre-wrap leading-relaxed">${chart}</pre>
            </div>
          `;
				}
			}
		}
	}, [chart]);

	return (
		<>
			<Skeleton
				className={cn(
					'h-full w-full',
					isRendering ? 'block' : 'hidden'
				)}
			/>
			<div
				ref={elementRef}
				className={cn(
					`mermaid-container overflow-auto scrollbar h-full w-full p-4 ${className} bg-transparent`,
					isRendering ? 'hidden' : 'block'
				)}
			/>
		</>
	);
};
