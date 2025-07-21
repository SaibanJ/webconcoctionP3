"use client"

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

function CompletionPageContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const clientSecret = searchParams.get("payment_intent_client_secret");
    const redirectStatus = searchParams.get("redirect_status");

    if (redirectStatus === "succeeded") {
      setStatus("succeeded");
    } else if (redirectStatus === "failed") {
      setStatus("failed");
      setError("Payment failed. Please try again.");
    } else {
      // Fallback for other statuses or direct access
      setStatus("unknown");
      setError("Invalid payment status.");
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            {status === "succeeded" && <CheckCircle className="h-6 w-6 text-green-600" />}
            {status === "failed" && <XCircle className="h-6 w-6 text-red-600" />}
          </div>
          <CardTitle className="text-2xl mt-4">
            {status === "succeeded" && "Payment Successful!"}
            {status === "failed" && "Payment Failed"}
            {status === "unknown" && "Unknown Status"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === "succeeded" && (
            <p>Your domain registration is being processed. You can now proceed to set up hosting.</p>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <div className="mt-6">
            <Link href="/">
              <Button>Go to Homepage</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const CompletionPage = dynamic(() => Promise.resolve(CompletionPageContent), { ssr: false });

export default CompletionPage;