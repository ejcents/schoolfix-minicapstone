
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Navbar from '@/components/Navbar';

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Who can submit a facility issue report?</AccordionTrigger>
                <AccordionContent>
                  Any student, faculty member, or staff can submit a facility issue report. We encourage everyone to report issues as soon as they notice them to ensure a safe and well-maintained environment.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>How quickly will my report be addressed?</AccordionTrigger>
                <AccordionContent>
                  Response times vary based on the urgency and nature of the issue. Critical issues affecting safety or essential services are typically addressed within 24 hours. Minor issues may take 3-5 business days. You can always check the status of your report through the dashboard.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I submit a report anonymously?</AccordionTrigger>
                <AccordionContent>
                No, you cannot submit a report anonymously. In order to file a report, you must be logged in. This ensures we can follow up if more information is needed to resolve the issue quickly.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>How do I check the status of my submitted report?</AccordionTrigger>
                <AccordionContent>
                  If you submitted the report while logged in, you can view all your submitted reports and their status on your dashboard.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>What types of issues should I report?</AccordionTrigger>
                <AccordionContent>
                  You should report any facility-related issues including but not limited to: plumbing problems, electrical issues, broken furniture, damaged infrastructure, HVAC issues, cleaning needs, safety hazards, and accessibility concerns.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger>Can I add photos to my report?</AccordionTrigger>
                <AccordionContent>
                  Yes, and we encourage it! Adding photos helps our maintenance team better understand the issue and come prepared with the right tools and parts for the repair.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger>Will I be notified when my issue is fixed?</AccordionTrigger>
                <AccordionContent>
                  Yes, if you've provided contact information, you'll receive a notification when the status of your report changes, including when it's marked as resolved. You can also check the status at any time in your dashboard.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8">
                <AccordionTrigger>What if I'm not satisfied with the resolution?</AccordionTrigger>
                <AccordionContent>
                  If an issue is marked as resolved but you feel it hasn't been adequately addressed, you can reopen the issue through your dashboard or by contacting the facility management office directly.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
