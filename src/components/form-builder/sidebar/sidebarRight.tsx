"use client";

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

import { useFormBuilderStore } from "@/stores/form-builder-store";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getComponentViews } from "@/config/available-components";
import { ReactNode, useEffect, useState } from "react";

interface PropertySectionProps {
  title: string;
  children: ReactNode;
  index: number;
}

function PropertySection({ title, children, index }: PropertySectionProps) {
  const [isOpenState, setIsOpenState] = useState(false);

  useEffect(() => {
    setIsOpenState(index < 3);
  }, [index]);

  return (
    <Collapsible className="border-b" open={isOpenState}>
      <CollapsibleTrigger
        className="flex items-center justify-between w-full p-4 cursor-pointer"
        onClick={() => setIsOpenState(!isOpenState)}
      >
        <span className="font-normal text-sm">{title}</span>
        {isOpenState ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 pt-0 space-y-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

const PROPERTY_SECTIONS = [
  { key: "options", title: "Data Options" },
  { key: "input", title: "Input" },
  { key: "label", title: "Label & Description" },
  { key: "grid", title: "Appearance" },
  { key: "html", title: "HTML Attributes" },
  { key: "validation", title: "Validation" },
] as const;

export function SidebarRight() {
  const { selectedComponent } = useFormBuilderStore();
  let sidebarContent;

  if (!selectedComponent) {
    sidebarContent = (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">
          Select a component to configure its properties
        </p>
      </div>
    );
  } else {
    const componentViews = getComponentViews(selectedComponent);

    if (!componentViews) {
      sidebarContent = (
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            No properties available for this component
          </p>
        </div>
      );
    } else {
      const filteredPropertySections = PROPERTY_SECTIONS.filter((section) => {
        return componentViews.renderDesignProperties[section.key] !== null;
      });

      sidebarContent = (
        <div>
          {filteredPropertySections.map(({ key, title }, index) => {
            const content = componentViews.renderDesignProperties[key];
            return (
              <PropertySection 
                key={key} 
                title={title} 
                index={index}
              >
                {content}
              </PropertySection>
            );
          })}
        </div>
      );
    }
  }

  return (
    <Sidebar side="right" className="border-l top-13">
      <SidebarContent>{sidebarContent}</SidebarContent>
    </Sidebar>
  );
}
