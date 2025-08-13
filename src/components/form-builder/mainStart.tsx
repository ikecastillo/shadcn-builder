import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import {
  CircleArrowDown,
  Zap,
  ExternalLink,
  BlocksIcon,
  ArrowRight,
  ArrowUpRight,
  CirclePlay,
  Search,
  Filter,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HTMLAttributes, useMemo, useEffect, useState } from "react";
import { FaDownload, FaGithub } from "react-icons/fa6";
import { FormComponentModel } from "@/models/FormComponent";
import Link from "next/link";
import Hero from "../landingpage/hero";
import FeatureSteps from "../landingpage/featureSteps";

interface ProjectCardProps {
  template: Template;
  category: string;
}

type Template = {
  formId: string;
  formTitle: string;
  formDescription: string;
  tags: string[];
  components: {}[];
  image: string;
  category: string;
};

type TemplateCategory = {
  name: string;
  templates: Template[];
};

const ProjectCard = ({ template, category }: ProjectCardProps) => {
  return (
    <Link
    target="_blank"
    href={`/builder?template=${category}&key=${template.formId}`} className="group relative flex flex-col overflow-hidden rounded-xl border border-accent transition-all hover:border-primary/50 hover:shadow-lg shadow">
      {/* Project Image */}
      <div className="bg-white pt-4 px-4 border-b border-accent">
        <div className="relative h-48 overflow-hidden ">
        <Image
          src={template.image}
          alt={template.formTitle}
          className=""
          width={768}
          height={314}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent flex items-center justify-center group-hover:bg-white/80" >
        <ExternalLink className="text-muted-foreground hidden group-hover:block" />
        </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">
          {template.formTitle}
        </h3>
        <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
          {template.formDescription}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1 mb-4">
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
            <Badge variant="outline" className="rounded-full text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
};

export function MainStart() {
  const router = useRouter();
  const updateComponents = useFormBuilderStore(
    (state) => state.updateComponents
  );
  const [isLoading, setIsLoading] = useState(true);
  const [allTemplates, setAllTemplates] = useState<Record<string, Template[]>>(
    {}
  );

  // Load all templates from category files
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const categoryFiles = [
          "user-account",
          "service",
          "event",
          "business",
          "education",
          "healthcare",
          "real-estate",
          "travel",
          "membership",
          "technical",
          "feedback",
          "notifications",
        ];

        const allTemplates: Record<string, Template[]> = {};

        for (const category of categoryFiles) {
          try {
            const response = await fetch(`/templates/${category}.json`);
            if (response.ok) {
              const categoryData = await response.json();
              const formIds = Object.keys(categoryData);
              const templates = formIds.map((formId) => {
                const template = categoryData[formId];
                return {
                  ...template,
                  formId: formId
                };
              });
              if (!allTemplates[category]) {
                allTemplates[category] = [];
              }
              allTemplates[category].push(...templates);
            }
          } catch (error) {
            console.warn(`Failed to load ${category}.json:`, error);
          }
        }
        setAllTemplates(allTemplates);
      } catch (error) {
        console.error("Failed to load templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, []);


  return (
    <div className="flex flex-col items-center mt-24 gap-24">
      <Hero />
      <FeatureSteps />

      <section id="templates" className="relative w-full">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Templates
            </h2>
            <p className="text-muted-foreground mt-2 sm:mt-4 text-lg">
              Showcasing form templates organized by category, built with
              shadcn/ui builder.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading templates...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {Object.entries(allTemplates).map(([category, templates]) => (
                <div key={category}>
                  <h3 className="text-2xl font-bold mb-5">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template, index) => (
                      <ProjectCard
                        key={`${category}-${index}`}
                        template={template}
                        category={category}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
