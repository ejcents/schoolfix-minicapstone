
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your facility issue report has been successfully submitted. Our maintenance team will review it shortly.
          </p>
          
          <div className="space-y-4">
            <Link to="/">
              <Button variant="outline" className="mr-4">
                Return to Home
              </Button>
            </Link>
            
            <Link to="/report">
              <Button className="bg-blue hover:bg-blue-dark">
                Submit Another Report
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
