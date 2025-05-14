
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="bg-destructive/15 p-4 rounded-md flex items-start space-x-2 text-destructive">
      <AlertCircle className="h-5 w-5 mt-0.5" />
      <div>
        <p className="font-medium">Error</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
