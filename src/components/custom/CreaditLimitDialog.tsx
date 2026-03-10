import React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";

type Props = {
  openAlert: boolean;
  setOpenAlert: any;
};

function CreaditLimitDialog({ openAlert, setOpenAlert }: Props) {
  return (
    <div>
      <AlertDialog open={openAlert}>
        {/* <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              You’ve reached your credit limit
            </AlertDialogTitle>
            <AlertDialogDescription>
              You have used all your available credits for creating AI
              presentations. Upgrade to the{" "}
              <span className="font-semibold">Unlimited Plan</span> to generate
              unlimited PPT slides and unlock all premium features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlert(false)}>
              Maybe Later
            </AlertDialogCancel>
            <Link to={"/workspace/pricing"}>
              <AlertDialogAction>Upgrade Plan</AlertDialogAction>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default CreaditLimitDialog;
