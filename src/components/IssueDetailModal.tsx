import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIssues, Issue, IssueStatus } from '@/contexts/IssueContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const statusColors = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'resolved': 'bg-green-100 text-green-800',
  'closed': 'bg-gray-100 text-gray-800'
};

interface IssueDetailModalProps {
  issue: Issue;
  onClose: () => void;
  isAdmin: boolean;
}

const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issue, onClose, isAdmin }) => {
  const { updateIssue, addComment } = useIssues();
  const { user, allUsers } = useAuth();
  const { toast } = useToast();
  
  const [status, setStatus] = useState<IssueStatus>(issue.status);
  const [comment, setComment] = useState('');
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState<string>(issue.assignedTo?.id || '');
  
  // Filter only admin or maintenance staff from all users
  const maintenanceStaff = allUsers.filter(user => user.role === 'admin' || user.role === 'maintenance');

  const handleStatusChange = (newStatus: IssueStatus) => {
    setStatus(newStatus);
  };

  const handleSubmit = () => {
    try {
      const updates: Partial<Issue> = {};
      
      // Update status if changed
      if (status !== issue.status) {
        updates.status = status;
      }

      // Update assigned maintenance staff if changed
      if (selectedMaintenanceId) {
        const selectedStaff = maintenanceStaff.find(staff => staff.id === selectedMaintenanceId);
        if (selectedStaff) {
          updates.assignedTo = {
            id: selectedStaff.id,
            name: selectedStaff.name,
          };
        }
      }

      // Apply updates if any
      if (Object.keys(updates).length > 0) {
        updateIssue(issue.id, updates);
      }
      
      // Add comment if provided
      if (comment.trim()) {
        addComment(issue.id, comment, user?.name || 'Anonymous');
        setComment('');
      }
      
      toast({
        title: "Update successful",
        description: "The issue has been updated.",
      });
    } catch (error) {
      console.error('Error updating issue:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating the issue.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{issue.title}</DialogTitle>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className={statusColors[issue.status]}>
              {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
            </Badge>
            <span className="text-sm text-gray-500">
              Reported by {issue.reportedBy.name} • {issue.reportedBy.role}
            </span>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content column */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="font-medium mb-1">Description</h3>
              <p className="text-gray-700">{issue.description}</p>
            </div>

            <div>
              <h3 className="font-medium mb-1">Location</h3>
              <p className="text-gray-700">{issue.location}</p>
            </div>

            {issue.images && issue.images.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Images</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {issue.images.map((img, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden">
                      <a href={img} target="_blank" rel="noopener noreferrer">
                        <img src={img} alt={`Issue ${index + 1}`} className="h-24 w-full object-cover" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-2">Comments</h3>
              {issue.comments.length === 0 ? (
                <p className="text-gray-500 italic">No comments yet.</p>
              ) : (
                <div className="space-y-3">
                  {issue.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium">{comment.author}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-2"
                />
              </div>
            </div>
          </div>

          {/* Details sidebar */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Details</h3>
              <dl className="divide-y">
                <div className="py-2 flex justify-between">
                  <dt className="text-sm text-gray-600">Category</dt>
                  <dd className="text-sm font-medium">{issue.category}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-sm text-gray-600">Priority</dt>
                  <dd className="text-sm font-medium">{issue.priority}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-sm text-gray-600">Reported</dt>
                  <dd className="text-sm">{new Date(issue.createdAt).toLocaleDateString()}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-sm text-gray-600">Last Updated</dt>
                  <dd className="text-sm">{new Date(issue.updatedAt).toLocaleDateString()}</dd>
                </div>
                {issue.assignedTo && (
                  <div className="py-2 flex justify-between">
                    <dt className="text-sm text-gray-600">Assigned To</dt>
                    <dd className="text-sm font-medium">{issue.assignedTo.name}</dd>
                  </div>
                )}
              </dl>
            </div>

            {isAdmin && (
              <>
                <div>
                  <h3 className="font-medium mb-2">Assign Maintenance Staff</h3>
                  <Select
                    value={selectedMaintenanceId}
                    onValueChange={setSelectedMaintenanceId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {maintenanceStaff.length === 0 ? (
                        <SelectItem value="no-staff" disabled>
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

                <div>
                  <h3 className="font-medium mb-2">Update Status</h3>
                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="mr-2">
            Close
          </Button>
          <Button onClick={handleSubmit} className="bg-blue hover:bg-blue-dark">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IssueDetailModal;
