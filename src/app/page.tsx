"use client";

import FeatureSteps from "@/components/landingpage/featureSteps";
import Header from "@/components/landingpage/header";
import Footer from "@/components/landingpage/footer";
import { Grid, Loader2, Zap } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

export default function FormBuilderPage() {
  const {
    allTemplates,
    isLoading,
    error: loadError,
    retry,
    categoriesLoaded,
    totalTemplates,
  } = useLoadTemplates();

  const [selectedCategory, setSelectedCategory] = useState<string>("business");

  return (
    <div>
      <Header />
      <main className="mt-24">
        <FeatureSteps />
        
        <section
          id="current-forms"
          className="container mx-auto px-4 py-20 md:py-32 max-w-7xl"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">Current Forms</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose from our collection of form templates organized by category, built with shadcn/ui builder.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm md:text-base text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>
                  <strong className="text-foreground">{totalTemplates}</strong> total templates
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Grid className="h-5 w-5 text-primary" />
                <span>
                  <strong className="text-foreground">{categoriesLoaded.length}</strong> form categories
                </span>
              </div>
            </div>
          </div>

          <div className="mx-auto mb-12 w-24 h-px bg-foreground/20"></div>

          {/* Desktop layout with sidebar and templates */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left sidebar with categories */}
            <div className="w-full lg:w-56 flex-shrink-0">
              <h3 className="text-xl font-semibold mb-6">Categories</h3>
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
                <SelectTrigger className="w-full lg:hidden">
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
              <div className="space-y-2 overflow-y-auto hidden lg:block">
                {categoriesLoaded.sort().map((category) => {
                  const templateCount = allTemplates[category]?.length || 0;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-base transition-colors ${
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
              <div className="space-y-6">
                {allTemplates[selectedCategory]?.map((template) => (
                  <Card
                    key={template.formId}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 group p-0 overflow-hidden border-foreground/10"
                  >
                    <a
                      href={`/template/${selectedCategory}/${template.formId}`}
                      className="block"
                    >
                      <div className="flex flex-col lg:flex-row">
                        {/* Template info */}
                        <div className="flex-1 p-6">
                          <CardTitle className="text-lg mb-3">
                            {template.formTitle}
                          </CardTitle>
                          <CardDescription className="text-base mb-4 leading-relaxed">
                            {template.formDescription}
                          </CardDescription>

                          {/* Tags */}
                          {template.tags && template.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {template.tags.slice(0, 3).map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="rounded-full text-sm px-3 py-1"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {template.tags.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="rounded-full text-sm px-3 py-1"
                                >
                                  +{template.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Thumbnail */}
                        <div className="pt-6 pl-6 bg-dotted border-t lg:border-l lg:border-t-0 lg:pt-4">
                          <div className="rounded-tl-xl rounded-br-xl border pt-6 pl-6 shadow-sm bg-white">
                            <div className="relative w-full lg:w-96 h-48 lg:h-44 flex-shrink-0 overflow-hidden">
                              <Image
                                src={
                                  template.image ||
                                  "/templates/images/default_thumbnail.png"
                                }
                                alt={`${template.formTitle} thumbnail`}
                                fill
                                className="object-none object-top-left transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Card>
                )) || (
                  <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">
                      No templates found in this category.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
