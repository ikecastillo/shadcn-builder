import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HTMLAttributes, useMemo } from "react";
import { FaDownload, FaGithub } from "react-icons/fa6";
import templates from "../../../public/templates.json";
import { FormComponentModel } from "@/models/FormComponent";

interface ProjectCardProps {
  template: Template;
  onLoad: (template: Template) => void;
}

type Template = {
  formTitle: string;
  formDescription: string;
  tags: string[];
  components: {}[];
  image: string;
};

const ProjectCard = ({ template, onLoad }: ProjectCardProps) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-accent transition-all hover:border-primary/50">
      {/* Project Image */}
      <div className="relative h-64 overflow-hidden bg-accent">
        <Image
          src={template.image}
          alt={template.formTitle}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6">
        <h3 className="text-xl font-semibold mb-2">{template.formTitle}</h3>
        <p className="text-muted-foreground mb-4">{template.formDescription}</p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-6">
          {template.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-auto">
          <Button
            variant="default"
            className="rounded-full"
            onClick={() => onLoad(template)}
          >
            <ExternalLink className="mr-1 h-4 w-4" />
            See in Builder
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProfileImage = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-10 w-48 h-48 md:w-64 md:h-64", className)} {...props}>
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-accent">
      <Image src="/placeholder.svg" alt="" className="object-cover" fill />
    </div>
  </div>
);

export function MainStart() {
  const router = useRouter();
  const updateComponents = useFormBuilderStore(
    (state) => state.updateComponents
  );

  const loadedTemplates: Template[] = useMemo(() => {
    return Object.values(templates);
  }, []);

  const loadTemplate = (template: Template) => {
    const components: FormComponentModel[] = template.components.map(
      (comp: any) => new FormComponentModel(comp)
    );

    updateComponents(components);
    router.push(`/builder?template=${template.formTitle}`);
  };

  return (
    <div className="flex flex-col items-center mt-24 gap-24">
      <div className="w-full flex items-center justify-center overflow-hidden border-b border-accent pb-24">
        <div className="max-w-screen-xl w-full flex flex-col lg:flex-row mx-auto items-center justify-between gap-y-14 gap-x-10 px-6 py-12 lg:py-0">
          <div className="max-w-xl">
            <Badge className="rounded-full py-1 border-none">
              Just released v1.0.0
            </Badge>
            <h1 className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2] tracking-tight">
              Build your own forms with ease.
            </h1>
            <p className="mt-6 max-w-[60ch] xs:text-lg">
              Shadcn Builder is a powerful, no-code form builder for the
              shadcn/ui component library. It helps developers visually create
              beautiful, accessible forms and export clean, production-ready
              React + Tailwind CSS code in seconds.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full text-base"
                onClick={() => router.push("/builder")}
              >
                Get Started <ArrowUpRight className="!h-5 !w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-full text-base shadow-none"
                asChild
              >
                <a
                  href="https://github.com/iduspara/shadcn-builder"
                  target="_blank"
                >
                  <FaGithub />
                  View Github
                </a>
              </Button>
            </div>
          </div>
          <div className="relative lg:max-w-lg xl:max-w-xl w-full bg-accent rounded-xl aspect-square">
            <Image
              src="/placeholder.svg"
              fill
              alt=""
              className="object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
      <section id="templates" className="relative">
        <div className="max-w-screen-xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Templates
            </h2>
            <p className="text-muted-foreground mt-2 sm:mt-4 text-lg">
              Showcasing some of form templates built with shadcn/ui builder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {loadedTemplates.map((template, index) => (
              <ProjectCard
                key={index}
                template={template}
                onLoad={loadTemplate}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
