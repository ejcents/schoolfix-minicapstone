import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileText, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFileReport = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to file a maintenance report.",
      });
      navigate('/login');
    } else {
      navigate('/report');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-blue-600 flex items-center">
            SCHOOL FIX
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-sm font-medium hover:text-blue-600 transition-colors">Home</Link>

              {/* Show About, FAQ, and Contact for non-logged-in users */}
              {!isAuthenticated && (
                <>
                  <Link to="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">About</Link>
                  <Link to="/faq" className="text-sm font-medium hover:text-blue-600 transition-colors">FAQ</Link>
                  <Link to="/contact" className="text-sm font-medium hover:text-blue-600 transition-colors">Contact</Link>
                </>
              )}

              {/* Show Report link for non-admin/maintenance users */}
              {isAuthenticated && !isAdmin && user?.role !== 'maintenance' && (
                <Link 
                  to="/report" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  Report
                </Link>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-sm font-medium hover:text-blue-600 transition-colors">Dashboard</Link>
                <div className="text-sm bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                  {user?.name} ({user?.role})
                </div>
                <Button variant="outline" size="sm" onClick={logout} className="border-blue-500 text-blue-600 hover:bg-blue-50">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hover:text-blue-600 hover:bg-blue-50">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="sm" className="border-blue-500 text-blue-600 hover:bg-blue-50">Register</Button>
                </Link>
                <Button 
                  size="sm" 
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleFileReport}
                >
                  File Report
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-2 border-t mt-2">
            <Link to="/" className="block py-2 px-4 text-sm hover:bg-gray-50 rounded-md">Home</Link>

            {/* Show About, FAQ, and Contact for non-logged-in users */}
            {!isAuthenticated && (
              <>
                <Link to="/about" className="block py-2 px-4 text-sm hover:bg-gray-50 rounded-md">About</Link>
                <Link to="/faq" className="block py-2 px-4 text-sm hover:bg-gray-50 rounded-md">FAQ</Link>
                <Link to="/contact" className="block py-2 px-4 text-sm hover:bg-gray-50 rounded-md">Contact</Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="block py-2 px-4 text-sm hover:bg-gray-50 rounded-md">Dashboard</Link>
                {/* Show Report link for non-admin/maintenance users */}
                {!isAdmin && user?.role !== 'maintenance' && (
                  <Link to="/report" className="block py-2 px-4 text-sm hover:bg-gray-50 rounded-md text-blue-600 font-medium flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Report
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout} 
                  className="w-full justify-start text-left border-blue-500 text-blue-600 hover:bg-blue-50 mt-2"
                >
                  Logout
                </Button>
              </>
            )}
            
            {!isAuthenticated && (
              <div className="space-y-2 pt-2">
                <Link to="/login" className="block">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-left">Login</Button>
                </Link>
                <Link to="/register" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start text-left">Register</Button>
                </Link>
                <Button 
                  size="sm" 
                  className="w-full justify-start text-left bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleFileReport}
                >
                  File Report
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
