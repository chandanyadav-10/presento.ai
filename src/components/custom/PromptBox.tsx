import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp, PlusIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function PromptBox() {
  return (
    <div className="w-full flex items-center justify-center mt-28">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="font-bold text-4xl">
          Describe your topic, we’ll design the <span className="text-primary">PPT </span> slides!
        </h2>
        <p className="text-xl text-gray-500">
          Your design will be saved as new project
        </p>
        <InputGroup>
          <InputGroupTextarea
            placeholder="Enter what kind of slider do you want to create?"
            className="min-h-36"
          />
          <InputGroupAddon align={"block-end"}>
            {/* <InputGroupButton>
              <PlusIcon />
            </InputGroupButton> */}
            <Select>
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select No Of Sliders" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>No. Of Slider</SelectLabel>
                  <SelectItem value="4 to 6">4-6 Sliders</SelectItem>
                  <SelectItem value="6 to 8">6-8 Sliders</SelectItem>
                  <SelectItem value="8 to 12">8-12 Sliders</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <InputGroupButton
              variant={"default"}
              className="rounded-full ml-auto"
              size={'icon-sm'}
            >
              <ArrowUp />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}

export default PromptBox;
