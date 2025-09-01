import { CheckIcon, ClockIcon, XCircleIcon, StarIcon } from "@heroicons/react/24/outline";
import { HiMiniHandThumbUp,HiMiniHandThumbDown } from "react-icons/hi2";
import clsx from "clsx";

export default function CaseStatus({ status }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
        {
          "bg-orange-300 text-orange-700": status === "pending",
          "bg-blue-100 text-blue-600": status === "review",
          "bg-yellow-100 text-yellow-600": status === "assigned",
          "bg-green-200 text-green-600": status === "approved",
          "bg-green-100 text-green-600": status === "done",
          "bg-gray-100 text-gray-600": status === "na",
          "bg-red-100 text-red-600": status === "declined",
          "bg-purple-100 text-purple-600": status === "won",
          "bg-red-600 text-white": status === "lost",
        }
      )}
    >
      {status === "pending" && (
        <>
          Pending
          <ClockIcon className="ml-1 w-4 text-orange-700" />
        </>
      )}
      {status === "review" && (
        <>
          Review
          <ClockIcon className="ml-1 w-4 text-blue-600" />
        </>
      )}
      {status === "assigned" && (
        <>
          Assigned
          <ClockIcon className="ml-1 w-4 text-yellow-600" />
        </>
      )}
      {status === "approved" && (
        <>
          Approved
          <CheckIcon className="ml-1 w-4 text-green-600" />
        </>
      )}
      {status === "done" && (
        <>
          Done
          <CheckIcon className="ml-1 w-4 text-green-600" />
        </>
      )}
      {status === "na" && (
        <>
          N/A
          <ClockIcon className="ml-1 w-4 text-gray-600" />
        </>
      )}
      {status === "declined" && (
        <>
          Declined
          <XCircleIcon className="ml-1 w-4 text-red-600" />
        </>
      )}
      {status === "won" && (
        <>
          Won
          <HiMiniHandThumbUp className="ml-1 w-4 text-base text-purple-600" />
        </>
      )}
      {status === "lost" && (
        <>
          Lost
          <HiMiniHandThumbDown className="ml-1 w-4 text-base text-white" />
        </>
      )}
    </span>
  );
}
