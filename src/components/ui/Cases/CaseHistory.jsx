"use client";
import React, { useState } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import CaseStatus from "./CaseStatus";
import Empty from "../Empty";
import { formatCurrencytoEuro, formatEpochToLocal } from "@/lib/utils";

// The CaseHistory component now accepts an `actions` prop and other dynamic props
const CaseHistory = ({ caseDetails }) => {
  const [open, setOpen] = useState(false);

  const actions = [
    {
      title: `Amount Paid to Victim`,
      status: caseDetails.is_compensation_paid,
      value: ` ${formatCurrencytoEuro(caseDetails.compensation_amount_victim)}`,
    },
    {
      title: `Amount Paid to Lawyer`,
      status: caseDetails.is_compensation_paid,
      value: ` ${formatCurrencytoEuro(caseDetails.compensation_amount_lawyer)}`,
    },
    {
      title: `Amount Paid to storekwil`,
      status: caseDetails.is_compensation_paid,
      value: ` ${formatCurrencytoEuro(
        caseDetails.compensation_amount_storekwil
      )}`,
    },
    {
      title: "Is lawyer assigned?",
      status: caseDetails.is_lawyer_assigned,
      value: caseDetails.is_lawyer_assigned ? "Yes" : "No",
    },
    {
      title: "Is Case Approved by the lawyer?",
      status: caseDetails.is_approved,
      value: caseDetails.is_approved ? "Yes" : "No",
    },
    {
      title: "Is Prepetrator Identity Known?",
      status: caseDetails.is_known_perpetrator_identity,
      value: caseDetails.is_known_perpetrator_identity ? "Yes" : "No",
    },
  ];

  if (actions.length === 0) {
    return (
      <section
        className={`mb-4 p-4 border border-light rounded-xl hover:bg-light duration-200 ease-in-out ${
          open ? "bg-light" : "bg-white"
        }`}
      >
        <div
          onClick={() => setOpen(!open)}
          className="flex cursor-pointer rounded-xl items-center justify-between"
        >
          <h3
            className={`subheading ${open ? "text-gray-900" : "text-gray-500"}`}
          >
            Case Actions History
          </h3>
          <IoIosArrowDropdown
            className={`cursor-pointer text-2xl hover:text-primary ${
              open && "rotate-180"
            }`}
          />
        </div>
        {open && (
          <div className="flex items-center justify-center">
            <Empty />
          </div>
        )}
      </section>
    );
  }

  return (
    <section
      className={`mb-4 p-4 border  rounded-xl hover:bg-light duration-200 ease-in-out ${
        open ? "bg-light" : "bg-white"
      }`}
    >
      <div
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer rounded-xl items-center justify-between "
      >
        <h3
          className={`subheading ${open ? "text-gray-900" : "text-gray-500"}`}
        >
          Case Actions History
        </h3>
        <IoIosArrowDropdown
          className={`cursor-pointer text-2xl hover:text-primary ${
            open && "rotate-180"
          }`}
        />
      </div>

      {open && (
        <>
          {/* Mobile View */}
          <div className="md:hidden">
            {actions.map((action) => (
              <ActionRow key={action.title} action={action} />
            ))}
          </div>

          {/* Desktop View */}
          <table className="hidden min-w-full text-gray-900 md:table border border-gray-200 mt-4  rounded-xl ">
            <thead className="rounded-lg text-left text-sm font-normal ">
              <tr className="border">
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Action
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Value
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {actions.map((action) => (
                <tr key={action.title} className="w-full border-b py-3 text-sm">
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{action.title}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {action.value}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <CaseStatus status={action.status ? "done" : "na"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
};

// A generic ActionRow component for rendering each action in mobile view
const ActionRow = ({ action }) => {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4 border border-gray-200">
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <p className="text-xl font-medium">{action.title}</p>
          <p>{action.value}</p>
        </div>
        <div className="flex justify-end gap-2">
          <CaseStatus status={action.status ? "done" : "na"} />
        </div>
      </div>
    </div>
  );
};

export default CaseHistory;
