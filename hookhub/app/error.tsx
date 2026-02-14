'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Error boundary caught:', error);

    // In production, you'd send this to a service like Sentry
    if (process.env.NODE_ENV === 'production' && error.digest) {
      // Example: logErrorToService(error, error.digest);
    }
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl w-full bg-card border border-border rounded-lg shadow-xl p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-destructive/10 p-4 rounded-full">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-3xl font-bold text-center mb-4 text-foreground">
          Oops! Something went wrong
        </h1>

        {/* Error Message */}
        <div className="mb-6">
          <p className="text-center text-muted-foreground mb-4">
            {isDevelopment
              ? "We encountered an error while rendering this page. Check the console for details."
              : "We're sorry for the inconvenience. Our team has been notified and is working on a fix."}
          </p>

          {/* Show error details in development only */}
          {isDevelopment && (
            <div className="bg-muted/50 border border-border rounded-md p-4 mt-4 overflow-auto">
              <p className="text-sm font-mono text-destructive break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  Error Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Production error ID */}
          {!isDevelopment && error.digest && (
            <div className="bg-muted/50 border border-border rounded-md p-3 mt-4">
              <p className="text-xs text-muted-foreground text-center">
                Error ID: <span className="font-mono">{error.digest}</span>
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Please include this ID when reporting the issue.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Try Again Button */}
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          {/* Go Home Button */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          If this problem persists, please{' '}
          <a
            href="https://github.com/christseng89/claude-code-crash-course/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            report an issue
          </a>
          .
        </p>
      </div>
    </div>
  );
}
