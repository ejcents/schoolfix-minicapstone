import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useIssues, Issue, IssueStatus } from '@/contexts/IssueContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Navbar from '@/components/Navbar';
import IssueDetailModal from '@/components/IssueDetailModal';
import CreateMaintenanceAccountModal from '@/components/CreateMaintenanceAccountModal';
import AssignMaintenanceModal from '@/components/AssignMaintenanceModal';
import UpdateStatusModal from '@/components/UpdateStatusModal';
import { Wrench, AlertTriangle, CheckCircle, UserPlus, UserCheck, Settings } from 'lucide-react';

const statusColors = {
  'pending': 'bg-gray-100 text-gray-800 border-gray-300',
  'in-progress': 'bg-white text-black border-black',
  'resolved': 'bg-black text-white border-black',
  'closed': 'bg-gray-800 text-white border-gray-800'
};

const categoryIcons = {
  'electrical': '⚡️',
  'plumbing': '🚿',
  'structural': '🏗️',
  'cleaning': '🧹',
  'other': '📋'
};

const Dashboard = () => {
  const { user, isAuthenticated, isAdmin, isMaintenance, allUsers } = useAuth();
  const { issues } = useIssues();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [issueToAssign, setIssueToAssign] = useState<Issue | null>(null);
  const [issueToUpdateStatus, setIssueToUpdateStatus] = useState<Issue | null>(null);
  
  useEffect(() => {
    if (issues) {
      if (statusFilter === 'all') {
        setFilteredIssues(issues);
      } else {
        setFilteredIssues(issues.filter(issue => issue.status === statusFilter));
      }
    }
  }, [issues, statusFilter]);

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // For regular users, show only their reported issues
  const userIssues = isAdmin 
    ? filteredIssues 
    : isMaintenance
      ? filteredIssues.filter(issue => issue.assignedTo?.id === user?.id)
      : filteredIssues.filter(issue => issue.reportedBy.id === user?.id);
  
  // Prepare data for charts
  const statusData = [
    { name: 'Pending', count: issues.filter(i => i.status === 'pending').length },
    { name: 'In Progress', count: issues.filter(i => i.status === 'in-progress').length },
    { name: 'Resolved', count: issues.filter(i => i.status === 'resolved').length },
    { name: 'Closed', count: issues.filter(i => i.status === 'closed').length },
  ];

  const categoryData = [
    { name: 'Electrical', count: issues.filter(i => i.category === 'electrical').length },
    { name: 'Plumbing', count: issues.filter(i => i.category === 'plumbing').length },
    { name: 'Structural', count: issues.filter(i => i.category === 'structural').length },
    { name: 'Cleaning', count: issues.filter(i => i.category === 'cleaning').length },
    { name: 'Other', count: issues.filter(i => i.category === 'other').length },
  ];

  const handleAssignStaff = (issue: Issue) => {
    setIssueToAssign(issue);
    setIsAssignModalOpen(true);
  };

  const handleUpdateStatus = (issue: Issue) => {
    setIssueToUpdateStatus(issue);
    setIsUpdateStatusModalOpen(true);
  };

  const renderMaintenanceDashboard = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Maintenance Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-gray-200 hover:border-gray-400 transition-all">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <AlertTriangle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {issues.filter(i => i.status === 'pending' && i.assignedTo?.id === user?.id).length}
              </div>
              <p className="text-xs text-gray-500">Tasks that need attention</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-gray-200 hover:border-gray-400 transition-all">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Wrench className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {issues.filter(i => i.status === 'in-progress' && i.assignedTo?.id === user?.id).length}
              </div>
              <p className="text-xs text-gray-500">Tasks you're working on</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-gray-200 hover:border-gray-400 transition-all">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {issues.filter(i => (i.status === 'resolved' || i.status === 'closed') && i.assignedTo?.id === user?.id).length}
              </div>
              <p className="text-xs text-gray-500">Tasks completed</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Simplified dashboard for maintenance staff - only show assigned tasks */}
        <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-medium">Assigned Tasks</h2>
            <div className="flex space-x-2">
              {['all', 'pending', 'in-progress'].map((status) => (
                <Button 
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setStatusFilter(status as any)}
                  className={statusFilter === status ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          {userIssues.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No tasks found.</p>
            </div>
          ) : (
            <div className="divide-y">
              {userIssues.map((issue) => (
                <div key={issue.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium flex items-center">
                        <span className="mr-2">{categoryIcons[issue.category]}</span>
                        {issue.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Location: {issue.location} • Reported on: {new Date(issue.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={statusColors[issue.status]}>
                        {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateStatus(issue)}
                        className="border-gray-300 hover:border-black"
                      >
                        Update Status
                      </Button>
                      {/* Removed View Details button for maintenance staff */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAdminDashboard = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Facility Management Dashboard</h1>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Administration</h2>
          <Button 
            onClick={() => setIsCreateModalOpen(true)} 
            className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" /> Create Maintenance Account
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issues.length}</div>
              <p className="text-xs text-gray-500">Reports submitted</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issues.filter(i => i.status === 'pending').length}</div>
              <p className="text-xs text-gray-500">Awaiting action</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issues.filter(i => i.status === 'in-progress').length}</div>
              <p className="text-xs text-gray-500">Being addressed</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issues.filter(i => i.status === 'resolved').length}</div>
              <p className="text-xs text-gray-500">Completed issues</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <Tabs defaultValue="issues" className="border-2 border-gray-200 rounded-lg">
            <TabsList className="border-b border-gray-200 w-full rounded-t-lg bg-gray-50">
              <TabsTrigger value="issues" className="data-[state=active]:text-black data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-white">Issues List</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:text-black data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-white">Analytics</TabsTrigger>
              <TabsTrigger value="staff" className="data-[state=active]:text-black data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-white">Staff</TabsTrigger>
            </TabsList>
            <TabsContent value="issues" className="mt-0 p-0">
              <div className="bg-white rounded-b-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2">
                  <Button 
                    variant={statusFilter === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                    className={statusFilter === 'all' ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}
                  >
                    All
                  </Button>
                  <Button 
                    variant={statusFilter === 'pending' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatusFilter('pending')}
                    className={statusFilter === 'pending' ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}
                  >
                    Pending
                  </Button>
                  <Button 
                    variant={statusFilter === 'in-progress' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatusFilter('in-progress')}
                    className={statusFilter === 'in-progress' ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}
                  >
                    In Progress
                  </Button>
                  <Button 
                    variant={statusFilter === 'resolved' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatusFilter('resolved')}
                    className={statusFilter === 'resolved' ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}
                  >
                    Resolved
                  </Button>
                  <Button 
                    variant={statusFilter === 'closed' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setStatusFilter('closed')}
                    className={statusFilter === 'closed' ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}
                  >
                    Closed
                  </Button>
                </div>
                
                {userIssues.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No issues found.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {userIssues.map((issue) => (
                      <div key={issue.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium flex items-center">
                              <span className="mr-2">{categoryIcons[issue.category]}</span>
                              {issue.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Location: {issue.location} • Reported by: {issue.reportedBy.name}
                              {issue.assignedTo && (
                                <span className="ml-2">• Assigned to: {issue.assignedTo.name}</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Reported on: {new Date(issue.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={statusColors[issue.status]}>
                              {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAssignStaff(issue)}
                              className="border-gray-300 hover:border-black"
                            >
                              Assign Staff
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedIssue(issue)}
                              className="border-gray-300 hover:border-black"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle>Issues by Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={statusData}
                        margin={{
                          top: 20,
                          right: 20,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#000000" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle>Issues by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={categoryData}
                        margin={{
                          top: 20,
                          right: 20,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#000000" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="staff" className="mt-0 p-6">
              <div className="bg-white rounded-lg border-2 border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium">Maintenance Staff</h3>
                </div>
                <div className="divide-y">
                  {allUsers.filter(u => u.role === 'maintenance').length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">No maintenance staff added yet.</p>
                    </div>
                  ) : (
                    allUsers
                      .filter(u => u.role === 'maintenance')
                      .map(staff => (
                        <div key={staff.id} className="p-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{staff.name}</h4>
                            <p className="text-sm text-gray-600">{staff.email}</p>
                          </div>
                          <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                            Maintenance Staff
                          </Badge>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };

  const renderUserDashboard = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Reported Issues</h1>
        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2">
            <Button 
              variant={statusFilter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('all')}
              className={statusFilter === 'all' ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}
            >
              All
            </Button>
            <Button 
              variant={statusFilter === 'pending' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('pending')}
              className={statusFilter === 'pending' ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}
            >
              Pending
            </Button>
            <Button 
              variant={statusFilter === 'in-progress' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('in-progress')}
              className={statusFilter === 'in-progress' ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}
            >
              In Progress
            </Button>
            <Button 
              variant={statusFilter === 'resolved' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('resolved')}
              className={statusFilter === 'resolved' ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}
            >
              Resolved
            </Button>
            <Button 
              variant={statusFilter === 'closed' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setStatusFilter('closed')}
              className={statusFilter === 'closed' ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}
            >
              Closed
            </Button>
          </div>
          
          {userIssues.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">You haven't reported any issues yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {userIssues.map((issue) => (
                <div key={issue.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium flex items-center">
                        <span className="mr-2">{categoryIcons[issue.category]}</span>
                        {issue.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Location: {issue.location}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Reported on: {new Date(issue.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={statusColors[issue.status]}>
                        {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedIssue(issue)}
                        className="border-gray-300 hover:border-black"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        {isAdmin && renderAdminDashboard()}
        {isMaintenance && renderMaintenanceDashboard()}
        {!isAdmin && !isMaintenance && renderUserDashboard()}
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal 
          issue={selectedIssue} 
          onClose={() => setSelectedIssue(null)} 
          isAdmin={isAdmin || isMaintenance}
        />
      )}

      {/* Create Maintenance Account Modal */}
      <CreateMaintenanceAccountModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Assign Maintenance Modal */}
      {issueToAssign && (
        <AssignMaintenanceModal 
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setIssueToAssign(null);
          }}
          issue={issueToAssign}
        />
      )}

      {/* Update Status Modal */}
      {issueToUpdateStatus && (
        <UpdateStatusModal 
          isOpen={isUpdateStatusModalOpen}
          onClose={() => {
            setIsUpdateStatusModalOpen(false);
            setIssueToUpdateStatus(null);
          }}
          issue={issueToUpdateStatus}
        />
      )}
    </div>
  );
};

export default Dashboard;
