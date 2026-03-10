import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function EditOutlineDialog({ children, outlineData, onUpdate }: any) {
  const [localData, setLocalData] = useState(outlineData);
  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (field: string, value: string) => {
    setLocalData({ ...localData, [field]: value });
  };

  const handleUpdate = () => {
    onUpdate(outlineData.slideNo, localData);
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Slider Outline</DialogTitle>
          <DialogDescription>
            <div>
              <label>Slider Title</label>
              <Input
                placeholder="Slider Title"
                value={localData.slidePoint}
                onChange={(event) =>
                  handleChange("slidePoint", event.target.value)
                }
              />
              <div className="mt-3">
                <label>Outline</label>
                <Textarea
                  placeholder="Outline"
                  value={localData.outline}
                  onChange={(event) =>
                    handleChange("outline", event.target.value)
                  }
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"}>Close</Button>
          </DialogClose>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditOutlineDialog;
