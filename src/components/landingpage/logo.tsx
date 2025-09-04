import { BlocksIcon } from "lucide-react";

export default function Logo() {
  return (
    <>
      <BlocksIcon className="h-8 w-8" strokeWidth={2} />
      <span className="text-lg font-semibold">
        shadcn/ui <span className="font-normal">Builder</span>
        <sup className="text-xs text-muted-foreground font-normal ml-1">
          Beta
        </sup>
      </span>
    </>
  );
}
