"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLoadTemplates } from "@/hooks/useLoadTemplates";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/landingpage/header";
import Footer from "@/components/landingpage/footer";
export default function TemplatesPage() {
  const {
    allTemplates,
    isLoading,
    error: loadError,
    retry,
    categoriesLoaded,
  } = useLoadTemplates();

  const [selectedCategory, setSelectedCategory] = useState<string>("business");

  return (
    <div>
      <Header />
      <section id="templates" className="relative w-full my-24">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-medium tracking-tight">
              Over 100 pre-built Form templates
            </h1>
            <p className="text-muted-foreground mt-2 sm:mt-4 text-lg">
              Checkout our 100+ form templates organized by category, built with
              shadcn/ui builder.
            </p>
          </div>

          {/* Desktop layout with sidebar and templates */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left sidebar with categories */}
            <div className="w-full md:w-48 flex-shrink-0">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              {isLoading && (
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

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:hidden">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoaded.sort().map((category) => {
                    const templateCount = allTemplates[category]?.length || 0;
                    return (
                      <SelectItem key={category} value={category}>
                        <div className="flex justify-between items-center w-full">
                          <span className="capitalize">
                            {category.replace("-", " ")}
                          </span>
                          {templateCount > 0 && (
                            <span className="text-xs opacity-70 ml-2">
                              ({templateCount})
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <div className="space-y-1 overflow-y-auto hidden md:block">
                {categoriesLoaded.sort().map((category) => {
                  const templateCount = allTemplates[category]?.length || 0;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="capitalize">
                          {category.replace("-", " ")}
                        </span>
                        {templateCount > 0 && (
                          <span className="text-xs opacity-70">
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
                {allTemplates[selectedCategory]?.map((template) => (
                  <Card
                    key={template.formId}
                    className="cursor-pointer hover:shadow-md transition-shadow group p-0 overflow-hidden"
                  >
                    <a
                      href={`/template/${selectedCategory}/${template.formId}/preview`}
                      className="block"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Template info */}
                        <div className="flex-1 p-4">
                          <CardTitle className="text-base">
                            {template.formTitle}
                          </CardTitle>
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
                        <div className="pt-4 pl-4 bg-dotted border-t md:border-l md:border-t-0">
                          <div className="rounded-tl-xl rounded-br-xl border pt-6 pl-6 shadow-sm bg-white">
                            <div className="relative w-96 h-44 flex-shrink-0 overflow-hidden">
                              <Image
                                src={
                                  template.image ||
                                  "/templates/images/default_thumbnail.png"
                                }
                                alt={`${template.formTitle} thumbnail`}
                                fill
                                className="object-none object-top-left transition-transform duration-200"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Card>
                )) || (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No templates found in this category.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
