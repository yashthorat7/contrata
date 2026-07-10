import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/Card';

export default function NextSteps() {
  const navigate = useNavigate();

  return (
    <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="flex flex-col">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-lg">Track Application</CardTitle>
          <CardDescription className="leading-relaxed">View your processed job applications and their scraped details.</CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto pt-4">
          <Button variant="outline" className="w-full" onClick={() => navigate('/tracker')}>
            See Scrape List
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-lg">Tailor Resume</CardTitle>
          <CardDescription className="leading-relaxed">
            Use AI or edit manually to tailor your resume specifically for this job.
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto pt-4">
          <Button variant="outline" className="w-full" onClick={() => navigate('/resume')}>
            Tailor Resume
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
