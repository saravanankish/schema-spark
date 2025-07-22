import { useState } from "react";
import { ChatInterface } from "./ChatInterface";
import { SchemaDisplay } from "./SchemaDisplay";
import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "./ui/resizable";

export const SchemaPilot = () => {
  const [schema, setSchema] = useState("");
  const [erd, setErd] = useState("");
  const [queries, setQueries] = useState<string[]>([]);

  const handleSchemaGenerated = (newSchema: string, newErd: string, newQueries: string[]) => {
    setSchema(newSchema);
    setErd(newErd);
    setQueries(newQueries);
  };

  return (
    <div className="h-screen bg-gradient-background overflow-hidden">
      <div className="h-full">
        {/* Chat Interface */}
        <ResizablePanelGroup
          direction="horizontal"
          className="w-full"
        >
          <ResizablePanel defaultSize={45} minSize={25} maxSize={60} className="border-r border-border h-full overflow-hidden">
            <ChatInterface onSchemaGenerated={handleSchemaGenerated} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel className="hidden lg:block h-full overflow-hidden">
            <SchemaDisplay schema={schema} erd={erd} queries={queries} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Mobile Schema Display */}
      <div className="lg:hidden">
        {schema && (
          <div className="fixed inset-0 bg-background z-50 p-4">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Generated Schema</h2>
                <button 
                  onClick={() => setSchema("")}
                  className="p-2 hover:bg-muted rounded-md"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <SchemaDisplay schema={schema} erd={erd} queries={queries} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};