import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  Trash2,
  Pipette,
  Save,
  SaveIcon,
  ListPlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FormComponentModelInput } from "@/types/FormComponent.types";

interface Option {
  label: string;
  labelDescription: string;
  value: string;
  checked: boolean;
}

interface OptionsDialogProps {
  options: FormComponentModelInput["options"];
  onOptionsChange: (options: FormComponentModelInput["options"]) => void;
  showCheckbox?: boolean;
}

export function OptionsDialog({
  options = [],
  onOptionsChange,
  showCheckbox = false,
}: OptionsDialogProps) {
  const [open, setOpen] = useState(false);
  const [loadedOptions, setLoadedOptions] = useState<FormComponentModelInput["options"]>([]);
  

  useEffect(() => {
    setLoadedOptions(options);
    console.log("options", options);
  }, [options]);

  const handleOptionChange = (
    index: number,
    field: keyof Option,
    value: any
  ) => {
    const newOptions = loadedOptions ? [
      ...loadedOptions.slice(0, index),
      { ...loadedOptions[index], [field]: value },
      ...loadedOptions.slice(index + 1),
    ] : [];

    setLoadedOptions(newOptions);
  };

  const handleAddOption = () => {
    setLoadedOptions(loadedOptions ? [
      ...loadedOptions,
      {
        label: `Option ${loadedOptions.length + 1}`,
        labelDescription: "",
        value: `option-${loadedOptions.length + 1}`,
        checked: false,
      },
    ] : []);
  };

  const handleDeleteOption = (index: number) => {
    setLoadedOptions(loadedOptions ? loadedOptions.filter((_, i) => i !== index) : []);
  };

  const onSaveOptions = () => {
    onOptionsChange(loadedOptions);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <ListPlusIcon className="mr-2 h-4 w-4" />
          Manage Options
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Options</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-12 text-sm text-gray-400 gap-4">
            {showCheckbox && <span className="col-span-1"></span>}
            <span className={`col-span-${showCheckbox ? 3 : 4}`}>Label</span>
            <span className="col-span-4">Label Description</span>
            <span className="col-span-3">Value</span>
            <span className="col-span-1"></span>
          </div>
          {options.map((option, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-center justify-items-center">
              {showCheckbox && (
                <Checkbox
                  id={`option-${index}-checked`}
                  checked={option.checked}
                  onCheckedChange={(checked) =>
                    handleOptionChange(index, "checked", checked)
                  }
                  className="col-span-1"
                />
              )}
              <Input
                defaultValue={option.label}
                onChange={(e) =>
                  handleOptionChange(index, "label", e.target.value)
                }
                placeholder="Option label"
                className={`col-span-${showCheckbox ? 3 : 4}`}
              />
              <Input
                defaultValue={option.labelDescription}
                onChange={(e) =>
                  handleOptionChange(index, "labelDescription", e.target.value)
                }
                placeholder="Label description"
                className="col-span-4"
              />
              <Input
                defaultValue={option.value}
                onChange={(e) =>
                  handleOptionChange(index, "value", e.target.value)
                }
                placeholder="Option value"
                className="col-span-3"
              />
              <Trash2
                onClick={() => handleDeleteOption(index)}
                className="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer"
              />
            </div>
          ))}
          <hr className="w-full" />
          <Button
            variant="outline"
            className="w-fit"
            onClick={handleAddOption}
          >
            <PlusIcon className=" h-4 w-4" />
            Add Option
          </Button>

        </div>
        <DialogFooter>
          <Button onClick={onSaveOptions} variant="default">
            <SaveIcon className="h-4 w-4" /> Save Options
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
