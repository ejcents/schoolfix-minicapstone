
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useIssues, Issue, IssueStatus } from '@/contexts/IssueContext';
import { toast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  issue
}) => {
  const { updateIssue } = useIssues();
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>(issue.status);

  const handleUpdateStatus = () => {
    if (selectedStatus === issue.status) {
      toast({
        title: 'No change',
        description: 'The status is already set to this value.',
      });
      return;
    }

    updateIssue(issue.id, { status: selectedStatus });
    toast({
      title: 'Status updated',
      description: `Issue status has been updated to ${selectedStatus}.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-2 border-black">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5" /> Update Issue Status
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4 text-sm text-gray-600">
            Issue: <span className="font-medium">{issue.title}</span>
          </p>
          <div className="space-y-4">
            <RadioGroup value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as IssueStatus)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-progress" id="in-progress" />
                <Label htmlFor="in-progress">In Progress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="resolved" id="resolved" />
                <Label htmlFor="resolved">Resolved</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="closed" id="closed" />
                <Label htmlFor="closed">Closed</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 hover:bg-gray-100">
            Cancel
          </Button>
          <Button onClick={handleUpdateStatus} className="bg-black text-white hover:bg-gray-800">
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusModal;
