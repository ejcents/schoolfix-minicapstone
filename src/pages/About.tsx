
import React from 'react';
import Navbar from '@/components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">About School Fix</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
              <p className="text-gray-700">
                School Fix was created to streamline the process of reporting and resolving facility issues in educational institutions. 
                We believe that a well-maintained learning environment is essential for student success and staff well-being. 
                Our mission is to provide an efficient platform for reporting, tracking, and resolving maintenance issues.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">How It Works</h2>
              <p className="text-gray-700">
                Our platform allows students, faculty, and staff to easily report facility issues they encounter on campus. 
                Reports are tracked through our system and assigned to maintenance personnel for resolution. 
                Users can follow the progress of their reports and receive notifications when issues are resolved.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Our Team</h2>
              <p className="text-gray-700">
                School Fix was developed by a team of dedicated individuals who understand the challenges of maintaining educational facilities. 
                Our team includes former facility managers, IT specialists, and educators who bring their expertise to create the most user-friendly solution possible.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Privacy & Security</h2>
              <p className="text-gray-700">
                We take privacy and security seriously. All data submitted through School Fix is protected and only accessible to authorized personnel. 
                We comply with all relevant data protection regulations and continuously update our security measures to safeguard your information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
