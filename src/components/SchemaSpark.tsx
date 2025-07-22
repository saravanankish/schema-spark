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
    <div className="h-screen bg-gradient-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
        {/* Chat Interface */}
        <div className="border-r border-border">
          <ChatInterface onSchemaGenerated={handleSchemaGenerated} />
        </div>
        
        {/* Schema Display */}
        <div className="hidden lg:block">
          <SchemaDisplay schema={schema} erd={erd} queries={queries} />
        </div>
      </div>
      
      {/* Mobile Schema Display */}
      <div className="lg:hidden">
        {schema && (
          <div className="fixed inset-0 bg-background z-50">
            <SchemaDisplay schema={schema} erd={erd} queries={queries} />
          </div>
        )}
      </div>
    </div>
  );
};