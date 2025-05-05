
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';

interface EditIssueButtonProps {
  issueId: string;
  showLabel?: boolean;
}

const EditIssueButton = ({ issueId, showLabel = true }: EditIssueButtonProps) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/report?edit=${issueId}`);
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      className="flex items-center gap-1 border-amber-500 text-amber-600 hover:bg-amber-50"
      onClick={handleEdit}
    >
      <Pencil className="h-4 w-4" />
      {showLabel && "Edit Report"}
    </Button>
  );
};

export default EditIssueButton;
