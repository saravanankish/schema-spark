import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Eye, Code, Workflow, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MermaidDiagram } from "./MermaidDiagram";

interface SchemaDisplayProps {
  schema: string;
  erd: string;
  queries: string[];
}

export const SchemaDisplay = ({ schema, erd, queries }: SchemaDisplayProps) => {
  const [activeTab, setActiveTab] = useState("schema");

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `${filename} downloaded successfully`,
    });
  };

  if (!schema) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-primary/20 flex items-center justify-center">
            <Eye className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">No Schema Generated Yet</h3>
            <p className="text-muted-foreground">Start a conversation to generate your database schema</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-background overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Generated Schema</h2>
            <p className="text-sm text-muted-foreground">Your optimized database structure</p>
          </div>
          <div className="flex gap-2">
            {
              activeTab === 'schema' &&
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(schema, "Schema")}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(schema, "schema.sql")}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </>
            }
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 flex-shrink-0">
            <TabsTrigger value="schema" className="gap-2">
              <Code className="w-4 h-4" />
              SQL Schema
            </TabsTrigger>
            <TabsTrigger value="erd" className="gap-2">
              <Workflow className="w-4 h-4" />
              ERD
            </TabsTrigger>
            <TabsTrigger value="queries" className="gap-2">
              <Zap className="w-4 h-4" />
              Queries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schema" className="flex-1 mt-4 overflow-hidden">
            <Card className="h-full bg-code-background border-border overflow-hidden">
              <div className="h-full overflow-auto scrollbar p-4">
                <pre className="text-sm text-foreground font-mono leading-relaxed whitespace-pre-wrap">
                  {schema}
                </pre>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="erd" className="flex-1 mt-4 overflow-hidden">
            <Card className="h-full bg-card border-border overflow-hidden">
              <MermaidDiagram chart={erd} className="w-full h-full" />
            </Card>
          </TabsContent>

          <TabsContent value="queries" className="flex-1 mt-4 overflow-hidden">
            <div className="h-full overflow-auto scrollbar space-y-4 pr-2">
              {queries.map((query, index) => (
                <Card key={index} className="bg-code-background border-border">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground">
                        Query {index + 1}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(query, `Query ${index + 1}`)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <pre className="text-sm text-foreground font-mono leading-relaxed whitespace-pre-wrap">
                      {query}
                    </pre>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};