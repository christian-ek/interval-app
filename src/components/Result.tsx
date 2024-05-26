import React from "react";

interface ResultProps {
  result: string;
}

const Result: React.FC<ResultProps> = ({ result }) => {
  return (
    <div className="w-full rounded-md bg-slate-950 p-4 shadow-lg">
      <h3 className="text-white">Resulting intervals:</h3>
      <p className="mt-2 rounded-md bg-slate-950 p-4 whitespace-pre-line break-words">
        <code className="text-white">{result}</code>
      </p>
    </div>
  );
};

export default Result;
