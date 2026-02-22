import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className={`h-7 w-7 ${className}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}
