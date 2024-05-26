import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ResultProps {
  result: string;
}

const Result: React.FC<ResultProps> = ({ result }) => {
  return (
    <ScrollArea className="w-full rounded-md bg-slate-950 p-4 shadow-lg">
      <h3 className="text-white">Resulting intervals:</h3>
      <pre className="mt-2 rounded-md bg-slate-950 p-4">
        <code className="text-white">{result}</code>
      </pre>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default Result;
