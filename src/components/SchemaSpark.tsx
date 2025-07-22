import { useState } from "react";
import { ChatInterface } from "./ChatInterface";
import { SchemaDisplay } from "./SchemaDisplay";

export const SchemaSpark = () => {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
        {/* Chat Interface */}
        <div className="border-r border-border h-full overflow-hidden">
          <ChatInterface onSchemaGenerated={handleSchemaGenerated} />
        </div>
        
        {/* Schema Display */}
        <div className="hidden lg:block h-full overflow-hidden">
          <SchemaDisplay schema={schema} erd={erd} queries={queries} />
        </div>
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