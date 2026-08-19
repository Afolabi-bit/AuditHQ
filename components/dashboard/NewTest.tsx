"use client";

import { FormEvent, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Loader2, Zap } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import isValidUrl from "@/app/utils/validateUrl";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { mutate } from "swr";

const NewTest = ({ user }: { user: KindeUser }) => {
  const [url, setUrl] = useState("");
  const [device, setDevice] = useState("Desktop");
  const [network, setNetwork] = useState("No Throttling");
  const [isUrlValid, setIsUrlValid] = useState({ validity: true, message: "" });
  const [isTesting, setIsTesting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const urlvalidation = isValidUrl(url);
    setIsUrlValid(urlvalidation);

    if (urlvalidation.validity === false || !user) {
      return;
    }

    setIsTesting(true);

    try {
      const req = await fetch("/api/test/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: user.id,
          url,
          device,
          network,
        }),
      });

      const res = await req.json();

      if (!req.ok || !res?.data?.testId) {
        setIsTesting(false);
        setIsUrlValid({
          validity: false,
          message:
            res?.message ||
            "Failed to start performance audit. Please check the URL or try again.",
        });
        return;
      }

      const testId = res.data.testId;

      // Immediately refresh the tests list & stats to show the new pending test
      mutate(`/api/tests/recent?userId=${user.id}`);
      mutate("/api/dashboard/stats");

      // Poll for test status every 2 seconds
      let pollInterval: NodeJS.Timeout | null = null;

      pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/test/${testId}/status`);
          const statusData = await statusResponse.json();

          // Check if test is completed or failed
          if (statusData.status === "completed") {
            if (pollInterval) clearInterval(pollInterval);
            setIsTesting(false);
            setUrl(""); // Clear the input field
            // Refresh the tests list and dashboard stats to show updated status
            mutate(`/api/tests/recent?userId=${user.id}`);
            mutate("/api/dashboard/stats");
            console.log("✅ [CLIENT] Test completed successfully! Full API response & report:", statusData);
          } else if (statusData.status === "failed") {
            if (pollInterval) clearInterval(pollInterval);
            setIsTesting(false);
            // Refresh the tests list and dashboard stats to show failed status
            mutate(`/api/tests/recent?userId=${user.id}`);
            mutate("/api/dashboard/stats");
            console.log("Test failed - check server logs for details");
          }
          // If status is still "pending", continue polling
        } catch (error) {
          console.error("Error polling test status:", error);
          if (pollInterval) clearInterval(pollInterval);
          setIsTesting(false);
        }
      }, 2000); // Poll every 2 seconds

      // Optional: Set a maximum timeout (e.g., 5 minutes)
      setTimeout(() => {
        if (pollInterval) {
          clearInterval(pollInterval);
          setIsTesting(false);
          console.error("Test timeout - took too long");
        }
      }, 300000); // 5 minutes timeout
    } catch (error) {
      console.error("Error submitting test:", error);
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 mr-2 text-blue-600" />
          Run New Performance Test
        </CardTitle>
        <CardDescription>
          Test your website&apos;s performance and get detailed insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="grid grid-cols-1 md:grid-cols-12 gap-4"
        >
          <div className="md:col-span-6 relative">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              value={url}
              placeholder="https://example.com"
              onChange={(e) => setUrl(e.target.value)}
              onClick={() => setIsUrlValid({ validity: true, message: "" })}
              className={
                isUrlValid.validity
                  ? "mt-1"
                  : "mt-1 outline-red-600 border-red-600"
              }
            />
            <span
              className={
                isUrlValid.validity ? "hidden" : "text-red-600 text-sm"
              }
            >
              {isUrlValid.message}
            </span>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="device">Device</Label>
            <select
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option>Desktop</option>
              <option>Mobile</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="network">Network</Label>
            <select
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option>No Throttling</option>
              <option>4G</option>
              <option>3G</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end">
            <Button
              className={`w-full bg-blue-600 hover:bg-blue-700  ${
                isTesting ? "cursor-not-allowed " : "cursor-pointer "
              }`}
            >
              {isTesting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Test
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewTest;

const Play: React.FC<React.SVGProps<SVGSVGElement>> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
