import { cn } from "@/lib/utils";
import { ArrowRight, BlocksIcon, ExternalLink } from "lucide-react";
import {  buttonVariants } from "../ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <div
    className={cn(
      "fixed top-0 w-full flex flex-row gap-2 justify-between bg-white border-b z-30"
    )}
  >
    <Link href="/" className="flex flex-row gap-2 items-center justify-center md:justify-start p-2 px-4 border-r w-full md:w-[300px]">
      <BlocksIcon className="h-6 w-6" strokeWidth={2} />
      <span className="text-lg font-semibold">
        shadcn/ui <span className="font-normal">Builder</span>
        <sup className="text-xs text-muted-foreground font-normal ml-1">
          Beta
        </sup>
      </span>
    </Link>
    <div className="flex flex-1 gap-4 items-center justify-end pr-4">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/components" className="hover:underline">Components</Link>
        <Link href="/templates" className="hover:underline">Templates</Link>
        <Link href="/about" className="hover:underline">About</Link>
    </div>
    <div className="hidden md:flex flex-row gap-2 border-l py-2 px-4 w-[300px]">
           <Link
                href="/builder"
                className={cn(
                    buttonVariants({
                        variant: "default",
                      size: "lg",
                      className:
                        "rounded-full w-full",
                    })
                  )}
              >
                Open Builder  <ArrowRight className="size-4" />
              </Link>
    </div>
  </div>
  );
}
