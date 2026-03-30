import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

interface ReportUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportedUserId: string;
  reportedUserName: string;
}

const REPORT_REASONS = [
  "Harassment or bullying",
  "Inappropriate content",
  "Spam or fake account",
  "Impersonation",
  "Threatening behavior",
  "Other",
];

const ReportUserModal = ({ open, onOpenChange, reportedUserId, reportedUserName }: ReportUserModalProps) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason for your report.");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('user_reports' as any)
        .insert({
          reporter_id: user.id,
          reported_user_id: reportedUserId,
          reason,
          description: description.trim() || null,
        });

      if (error) throw error;

      toast.success("Report submitted. Our team will review it.");
      onOpenChange(false);
      setReason("");
      setDescription("");
    } catch (error: any) {
      if (error.message?.includes("Rate limit")) {
        toast.error("You've submitted too many reports recently. Please try again later.");
      } else {
        toast.error("Failed to submit report. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Report {reportedUserName}
          </DialogTitle>
          <DialogDescription>
            Help us keep Fitness Friends safe. Reports are confidential.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Reason for report</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="mt-2 space-y-2">
              {REPORT_REASONS.map((r) => (
                <div key={r} className="flex items-center space-x-2">
                  <RadioGroupItem value={r} id={r} />
                  <Label htmlFor={r} className="text-sm cursor-pointer">{r}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="report-desc" className="text-sm font-medium">Additional details (optional)</Label>
            <Textarea
              id="report-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any additional context..."
              maxLength={500}
              className="mt-1"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleSubmit} disabled={loading || !reason}>
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportUserModal;
