import React from "react";
import { FaCheck } from "react-icons/fa";
import clsx from "clsx";
import { LuClipboardCheck } from "react-icons/lu";
import { LuClipboardEdit } from "react-icons/lu";
import { HiMiniHandThumbUp, HiMiniHandThumbDown } from "react-icons/hi2";
import {
  CheckIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const getCompletionStatus = (stepIndex, status) => {
  const stepStatuses = [
    ["pending"],                 // Step 1: Pending
    ["review", "assigned"],      // Step 2: Review or Assigned
    ["approved", "declined"],    // Step 3: Approved or Declined
    ["won", "lost"],             // Step 4: Won or Lost
  ];

  // Find the current step index based on the provided status
  const currentStepIndex = stepStatuses.findIndex((statuses) =>
    statuses.includes(status)
  );

  // Return true if the current step index is greater than or equal to the step index
  return currentStepIndex >= stepIndex && currentStepIndex !== -1;
};


const iconMap = {
  pending: ClockIcon, // Clock icon for pending (waiting status)
  review: LuClipboardEdit, // List icon for items under review
  assigned: LuClipboardCheck, // List icon to show task assigned status
  approved: CheckIcon, // Check icon for approved status
  declined: XCircleIcon, // X icon for declined status
  won: HiMiniHandThumbUp, // Star icon for successful or winning status
  lost: HiMiniHandThumbDown, // Thumbs down icon for lost status
};

const CaseProgress = ({ status }) => {
  const steps = [
    { title: "Pending" },
    { title: status==="assigned"?"Assigned":"Review" },    // Changed from "Review or Assigned"
    // { title: "Assigned" },  // Changed from "Review or Assigned"
    { title: status==="declined"?"Declined":"Approved"  },  // Changed from "Approved or Declined"
    // { title: "Declined" },  // Changed from "Approved or Declined"
    { title: status==="lost"?"Lost":"Won" },       // Changed from "Won or Lost"
    // { title: "Lost" },      // Changed from "Won or Lost"
  ];

  // Get the correct status text based on the current status
  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Awaiting Staff to Review and Assign Lawyer";
      case "review":
        return "Awaiting Supervisor to Review and Suggest Way Forward";
      case "assigned":
        return "Lawyer Assigned, Awaiting Acceptance";
      case "approved":
        return "Lawyer Approved to take the case";
      case "declined":
        return "Case Declined After carefull observation";
      case "won":
        return "Case Won"; // Show "Won" if the status is won
      case "lost":
        return "Case Lost"; // Show "Lost" if the status is lost
      default:
        return "";
    }
  };

  const renderStepIcon = (stepIndex, completed) =>{
    const Icon=iconMap[status]
    return  (
      completed ? (
        <FaCheck className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
      ) : (
        <>{stepIndex + 1}</>
      )
    )
  }

  return (
    <div className="bg-white px-1 md:px-4 py-8 border rounded-xl border-gray-200 mb-4">
      {/* Desktop version */}
      <ol className="hidden md:flex items-center w-full justify-center">
        {steps.map((step, index) => {
          const completed = getCompletionStatus(index, status);
          return (
            <li
              key={index}
              className={clsx(
                "relative",
                {
                  "text-blue-500": completed,
                  "text-gray-600": !completed,
                  "w-full": steps.length - 1 !== index,
                }
              )}
            >
              <div
                className={clsx(
                  "flex items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block",
                  {
                    "after:border-blue-200 dark:after:border-blue-800": completed,
                    "after:border-gray-300 dark:after:border-gray-700": !completed,
                    "after:hidden w-fit": index === steps.length - 1, // Hide the line for the last item
                  }
                )}
              >
                <span
                  className={clsx(
                    "flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0",
                    {
                      "bg-blue-200 text-blue-500": completed,
                      "bg-gray-200 text-gray-600": !completed,
                    }
                  )}
                >
                  {renderStepIcon(index, completed)}
                </span>
              </div>
              <h3
                className={clsx(
                  "font-medium leading-tight mt-1",
                  {
                    "text-blue-500": completed,
                    "text-gray-600": !completed,
                  }
                )}
              >
                {step.title} {/* Use the updated dynamic step title */}
              </h3>
            </li>
          );
        })}
      </ol>

      {/* Mobile version */}
      <ol className="md:hidden relative text-gray-500 border-gray-200 dark:border-gray-700 dark:text-gray-400">
        {steps.map((step, index) => {
          const completed = getCompletionStatus(index, status);
          return (
            <li key={index} className="relative py-1 px-4 border-b flex items-center justify-start gap-4">
              <span
                className={clsx(
                  "flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900",
                  {
                    "bg-blue-200 text-blue-500": completed,
                    "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400": !completed,
                  }
                )}
              >
                {completed ? (
                  <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <h3 className="font-medium leading-tight">{step.title}</h3>
            </li>
          );
        })}
      </ol>

      {/* Status Alert */}
      <div className="flex items-center p-4 mt-8 text-sm text-gray-800 rounded-lg bg-light" role="alert">
        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span className="sr-only">Info</span>
        <div>{getStatusText()}</div>
      </div>
    </div>
  );
};

export default CaseProgress;
