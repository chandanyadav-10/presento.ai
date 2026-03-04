import React from "react";
import { Skeleton } from "../ui/skeleton";
import type { Outline } from "@/workspace/project/outline";
import { Button } from "../ui/button";
import { Edit, Ghost } from "lucide-react";

type Props = {
  loading: boolean;
  outline: Outline[];
};

function OutlineSection({ loading, outline }: Props) {
  return (
    <div className="mt-7">
      <h2 className="font-bold text-xl">Sliders Outline</h2>
      {loading && (
        <div>
          {[1, 2, 3, 4, 5].map((item, index) => (
            <Skeleton
              key={index}
              className="h-[60px] w-full rounded-2xl mb-4"
            />
          ))}
        </div>
      )}

      <div>
        {outline?.map((item, index) => (
          <div key={index} className="bg-white p-3 rounded-xl flex gap-6 items-center border mt-5 justify-between px-6">
            <div className="flex gap-6 items-center">
            <h2 className="font-bold p-5 bg-gray-200 rounded-xl">{index + 1}</h2>
            <div>
              <h2 className="font-bold">{item.slidePoint}</h2>
              <p>{item.outline}</p>
            </div>
            </div>
            <Button variant={'ghost'} size={'icon-lg'}><Edit/></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OutlineSection;
