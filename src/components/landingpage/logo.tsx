import { BlocksIcon } from "lucide-react";

export default function Logo() {
  return (
    <>
      <BlocksIcon className="h-6 w-6" strokeWidth={2} />
      <span className="text-lg font-semibold">
        Switch <span className="font-normal">Jira FormBuilder</span>
        <sup className="text-xs text-muted-foreground font-normal ml-1">
          Beta
        </sup>
      </span>
    </>
  );
}
