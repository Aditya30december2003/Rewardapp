"use client";
import Image from "next/image";
import Link from "next/link";
import Empty from "../ui/Empty";
import { formatDateToLocal } from "@/lib/utils";
import SendEmail from "./SendEmail";

export default function UsersTable({ users, userLabel }) {
  const downloadCSV = () => {
    // Convert users data to CSV format
    const headers = [
      "First Name",
      "Last Name",
      "Email Address",
      "Company",
      "United Kingdom",
      "Telephone",
    ];
    const csvRows = [
      headers.join(","), // CSV header row
      ...users.map((user) =>
        [
          user.firstName,
          user.lastName,
          user.email,
          user.company,
          user.country,
          user.phone,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and click it to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "users_data.csv";
    link.click();

    // Clean up the temporary link
    URL.revokeObjectURL(url);
  };

  if (!users || users?.length === 0)
    return (
      <section className="mb-4 mt-6 p-4 border rounded-xl hover:bg-light duration-200 ease-in-out bg-light">
        <div className="flex items-center justify-center">
          <Empty msg={"No users found"} />
        </div>
      </section>
    );

  return (
    <>
      <div className="mt-6 p-6 rounded-lg flow-root bg-white border">
        {/* Download Button */}
        <div className="mb-4 flex items-center justify-between p-2 md:p-0 ">
          <h3 className="text-xl font-medium text-gray-600  ">
            Members of Storekwil
          </h3>
          <div>
            <SendEmail recepients={users.map((user) => user.email)} />
            <button
              onClick={downloadCSV}
              className="px-4 py-2 bg-gray-50 text-gray-500 border rounded-md  hover:bg-gray-100 ml-4"
            >
              Download CSV
            </button>
          </div>
        </div>
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:p-0">
            {/* Mobile View */}
            <div className="md:hidden">
              {users.map(
                ({
                  $id: id,
                  firstName,
                  lastName,
                  name,
                  email,
                  PremiumPlan,
                  company,
                  phone,
                  country,
                  $createdAt: RegisteredOn,
                }) => (
                  <div
                    key={id}
                    className="mb-2 w-full rounded-md bg-gray-50 p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-medium">
                          {userLabel ? name : firstName + lastName}
                        </p>
                        <p className="text-gray-500">{email}</p>
                      </div>
                      <Link
                        className="p-2 border bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-md"
                        href={`/admin/users-management/${id}/insights`}
                      >
                        View Insights
                      </Link>
                    </div>
                    <div className="pt-4">
                      <p className="text-gray-700">{company}</p>
                      {userLabel ? (
                        <p className="text-gray-500">
                          {PremiumPlan ? "True" : "False"}
                        </p>
                      ) : (
                        <p className="text-gray-500">{country}</p>
                      )}
                      {!userLabel && <p className="text-gray-500">{phone}</p>}
                      <p className="text-gray-500">
                        {" "}
                        {formatDateToLocal(RegisteredOn)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Desktop View */}
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="text-left text-sm font-normal bg-gray-200 text-gray-500 rounded-md ">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Email Address
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Company
                  </th>
                  {userLabel ? (
                    <th scope="col" className="px-4 py-5 font-medium">
                      Premium Plan
                    </th>
                  ) : (
                    <th scope="col" className="px-4 py-5 font-medium">
                      Country
                    </th>
                  )}
                  {!userLabel && (
                    <th scope="col" className="px-4 py-5 font-medium">
                      Telephone
                    </th>
                  )}

                  <th scope="col" className="px-4 py-5 font-medium">
                    Earned Points
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Date
                  </th>
                  {!userLabel && (
                    <th scope="col" className="px-4 py-5 font-medium">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-gray-50">
                {console.log("users", users)}
                {users.map(
                  ({
                    $id: id,
                    firstName,
                    name,
                    PremiumPlan,
                    lastName,
                    email,
                    company,
                    country,
                    phone,
                    totalPoints,
                    $createdAt: RegisteredOn,
                  }) => (
                    <tr
                      key={id}
                      className="border-b py-3 text-sm last-of-type:border-none"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        {userLabel ? name : firstName + lastName}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3">{email}</td>
                      <td className="whitespace-nowrap px-3 py-3">{company}</td>
                      {userLabel ? (
                        <td className="whitespace-nowrap px-3 py-3">
                          {PremiumPlan ? "True" : "False"}
                        </td>
                      ) : (
                        <td className="whitespace-nowrap px-3 py-3">
                          {country}
                        </td>
                      )}
                      {!userLabel && (
                        <td className="whitespace-nowrap px-3 py-3">{phone}</td>
                      )}

                      <td className="whitespace-nowrap px-3 py-3">
                        {totalPoints}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatDateToLocal(RegisteredOn)}
                      </td>
                      {!userLabel && (
                        <td className="whitespace-nowrap px-3 py-3">
                          <Link
                            className="p-2 border bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-md"
                            href={`/admin/users-management/${id}/insights`}
                          >
                            View Insights
                          </Link>
                        </td>
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
