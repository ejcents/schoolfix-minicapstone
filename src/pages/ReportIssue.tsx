
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useIssues, IssueCategory, Issue } from '@/contexts/IssueContext';
import Navbar from '@/components/Navbar';

const ReportIssue = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<IssueCategory>('other');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<Issue | null>(null);
  
  const { user, isAuthenticated } = useAuth();
  const { addIssue, getIssueById, updateIssue } = useIssues();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editIssueId = searchParams.get('edit');
  
  // Check if we're editing an existing issue
  useEffect(() => {
    if (editIssueId) {
      const issue = getIssueById(editIssueId);
      
      if (issue) {
        // Check if the current user is allowed to edit this issue
        if (issue.reportedBy.id === user?.id || user?.role === 'admin') {
          setIsEditing(true);
          setCurrentIssue(issue);
          setTitle(issue.title);
          setDescription(issue.description);
          setLocation(issue.location);
          setCategory(issue.category);
          setImages(issue.images);
        } else {
          toast({
            title: "Unauthorized",
            description: "You don't have permission to edit this issue.",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      } else {
        toast({
          title: "Issue not found",
          description: "The issue you're trying to edit doesn't exist.",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    }
  }, [editIssueId, getIssueById, user, navigate, toast]);

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "You need to be logged in to report an issue.",
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        setImages([...images, event.target.result]);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // User should always be logged in here due to the redirect
      const reportedBy = {
        id: user!.id,
        name: user!.name,
        role: user!.role
      };
      
      if (isEditing && currentIssue) {
        // Update existing issue
        updateIssue(currentIssue.id, {
          title,
          description,
          location,
          category,
          images,
        });
        
        toast({
          title: "Report updated",
          description: "Your issue report has been successfully updated.",
        });
      } else {
        // Create new issue
        addIssue({
          title,
          description,
          location,
          category,
          status: 'pending',
          priority: 'medium',
          reportedBy,
          images,
          comments: []
        });
        
        toast({
          title: "Report submitted",
          description: "Your issue report has been successfully submitted.",
        });
      }
      
      navigate('/thanks');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your report.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-blue-600">
            {isEditing ? 'Edit Facility Issue Report' : 'Report a Facility Issue'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700 font-medium">Description</Label>
              <Textarea
                id="description"
                placeholder="Please provide details about the issue"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-medium">Location</Label>
                <Input
                  id="location"
                  placeholder="Building and room number"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700 font-medium">Category</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as IssueCategory)}>
                  <SelectTrigger id="category" className="border-gray-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="structural">Structural</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image" className="text-gray-700 font-medium">Add Images (Optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden shadow-sm border border-gray-200">
                      <img src={img} alt={`Upload ${index + 1}`} className="h-24 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update Report' : 'Submit Report')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
