"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BlocksIcon,
  File,
  Zap,
  Plus,
  Users,
  Briefcase,
  Heart,
  Plane,
  User,
  GraduationCap,
  Home,
  Bug,
  X,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useLoadTemplates } from "@/hooks/useLoadTemplates";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertCircle } from "lucide-react";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("business");

  const {
    allTemplates: loadedTemplates,
    isLoading: isLoadingTemplates,
    error: loadError,
    hasData,
    retry,
    totalTemplates,
    categoriesLoaded,
  } = useLoadTemplates();

  const handleTemplateSelection = (template: string, key?: string) => {
    const url = key
      ? `/builder?template=${template}&key=${key}`
      : `/builder?template=${template}`;
    router.push(url);
    onOpenChange(false);
  };

  const handleStartFromScratch = () => {
    onOpenChange(false);
  };

      return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className="w-full lg:max-w-5xl lg:max-h-[85vh] overflow-y-auto pb-0 [&>button]:hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Welcome
          </DialogTitle>
          <DialogDescription className="text-base">
            Get started by choosing a template or create a form from scratch
          </DialogDescription>
        </DialogHeader>

        <div className="pt-4">
          {/* Start from scratch option */}
          <Card
            className="border border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer group mb-6"
            onClick={handleStartFromScratch}
          >
            <CardContent className="">
              <div className="flex items-center gap-4">
                <File  className="h-10 w-10 text-muted-foreground  " strokeWidth={1} />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Start with a blank form</h3>
                  <p className="text-muted-foreground">
                    Build your form from scratch with complete creative control
                  </p>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          {/* Separator */}
          <div className="flex items-center gap-4 my-10 max-w-xl mx-auto">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground font-medium">
              or start with a template
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Main content area with sidebar and templates */}
          <div className="flex gap-6 h-[800px]">
            {/* Left sidebar with categories */}
            <div className="w-48 flex-shrink-0">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              {isLoadingTemplates && (
                <div className="flex items-center mb-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Loading...
                  </span>
                </div>
              )}
              {loadError && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs">{loadError}</span>
                      <Button variant="outline" size="sm" onClick={retry}>
                        Retry
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-1 overflow-y-auto">
                {categoriesLoaded.sort().map((category) => {
                  const templateCount = loadedTemplates[category].length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md text-base transition-colors ${
                        selectedCategory === category
                          ? "font-bold underline"
                          : "hover:bg-muted cursor-pointer"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                      <span className="capitalize">
                          {category.replace("-", " ")}
                        </span>
                        {templateCount > 0 && (
                          <span className="text-sm opacity-70 font-normal">
                            ({templateCount})
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right content area with templates */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {loadedTemplates[selectedCategory]?.map((template) => {
                  return (
                    <Card
                      key={template.formId}
                      className="cursor-pointer hover:shadow-md transition-shadow group p-0 overflow-hidden"
                      onClick={() =>
                        handleTemplateSelection(
                          template.category,
                          template.formId
                        )
                      }
                    >
                      <div className="flex">
                        {/* Template info */}
                        <div className="flex-1 p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-base">
                              {template.formTitle}
                            </CardTitle>
                          </div>
                          <CardDescription className="text-sm mb-3">
                            {template.formDescription}
                          </CardDescription>

                          {/* Tags */}
                          {template.tags && template.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {template.tags.slice(0, 3).map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="rounded-full text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {template.tags.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="rounded-full text-xs"
                                >
                                  +{template.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Thumbnail */}
                        <div className="pt-4 pl-4 bg-dotted border-l ">
                          <div className="rounded-tl-xl rounded-br-xl border pt-6 pl-6 shadow-sm bg-white">
                            <div className="relative w-96 h-44 flex-shrink-0 overflow-hidden">
                              <Image
                                src={template.image}
                                alt={`${template.formTitle} thumbnail`}
                                fill
                                className="object-none object-top-left transition-transform duration-200"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
