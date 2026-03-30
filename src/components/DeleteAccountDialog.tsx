import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const DeleteAccountDialog = () => {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return;

    setLoading(true);
    try {
      // Sign out the user — actual data deletion should be handled
      // by a server-side process or Supabase cascade policies
      await supabase.auth.signOut();
      toast.success("Your account has been signed out. Contact support@fitnessfriends.app to complete account deletion.");
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="w-4 h-4" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>This action cannot be undone. This will permanently delete your account and remove all your data including:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Your profile and personal information</li>
              <li>All workout history and schedules</li>
              <li>Friend connections and messages</li>
              <li>Achievements and progress data</li>
            </ul>
            <div className="pt-2">
              <Label htmlFor="confirm-delete" className="text-sm font-medium text-foreground">
                Type <span className="font-bold">DELETE</span> to confirm
              </Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="mt-1"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={confirmText !== "DELETE" || loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete My Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;
