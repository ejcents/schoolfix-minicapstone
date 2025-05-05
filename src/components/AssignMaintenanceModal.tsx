
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useIssues, Issue } from '@/contexts/IssueContext';
import { toast } from '@/hooks/use-toast';
import { UserCheck } from 'lucide-react';

interface AssignMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue;
}

const AssignMaintenanceModal: React.FC<AssignMaintenanceModalProps> = ({
  isOpen,
  onClose,
  issue
}) => {
  const { allUsers } = useAuth();
  const { updateIssue } = useIssues();
  const [selectedStaffId, setSelectedStaffId] = useState<string>(issue.assignedTo?.id || '');

  const maintenanceStaff = allUsers.filter(user => user.role === 'maintenance');

  const handleAssign = () => {
    if (!selectedStaffId) {
      toast({
        title: 'Error',
        description: 'Please select a maintenance staff member',
        variant: 'destructive',
      });
      return;
    }

    const staff = maintenanceStaff.find(staff => staff.id === selectedStaffId);
    if (!staff) return;

    updateIssue(issue.id, {
      assignedTo: {
        id: staff.id,
        name: staff.name
      },
      status: issue.status === 'pending' ? 'in-progress' : issue.status
    });

    toast({
      title: 'Staff assigned',
      description: `${staff.name} has been assigned to this issue.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-2 border-black">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" /> Assign Maintenance Staff
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4 text-sm text-gray-600">
            Issue: <span className="font-medium">{issue.title}</span>
          </p>
          <div className="space-y-2">
            <label htmlFor="staff-select" className="text-sm font-medium">
              Select Maintenance Staff
            </label>
            <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {maintenanceStaff.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No maintenance staff available
                  </SelectItem>
                ) : (
                  maintenanceStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 hover:bg-gray-100">
            Cancel
          </Button>
          <Button onClick={handleAssign} className="bg-black text-white hover:bg-gray-800">
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignMaintenanceModal;
