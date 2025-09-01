"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { IoIosArrowDropdown } from "react-icons/io";

export default function WaitListSearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [queryType, setQueryType] = useState("");
  const [dateFilterType, setDateFilterType] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [pointsFilterType, setPointsFilterType] = useState("");
  const [pointsValue, setPointsValue] = useState("");
  const [pointsRange, setPointsRange] = useState({ min: "", max: "" });

  // Initialize filters from current search params
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
    setQueryType(searchParams.get("queryType") || "");
    setDateFilterType(searchParams.get("dateFilterType") || "");
    setDateValue(
      searchParams.get("dateFilterType") !== "range"
        ? searchParams.get("dateStart") || ""
        : ""
    );
    setDateRange({
      start: searchParams.get("dateStart") || "",
      end: searchParams.get("dateEnd") || "",
    });
    setPointsFilterType(searchParams.get("pointsFilterType") || "");
    setPointsValue(
      searchParams.get("pointsFilterType") !== "range"
        ? searchParams.get("pointsValue") || ""
        : ""
    );
    setPointsRange({
      min: searchParams.get("pointsMin") || "",
      max: searchParams.get("pointsMax") || "",
    });
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    // General query
    if (query) params.append("query", query);
    if (queryType) params.append("queryType", queryType);

    // Date filter
    if (dateFilterType === "range") {
        params.append("dateFilterType", dateFilterType);
      if (dateRange.start) params.append("dateStart", dateRange.start);
      if (dateRange.end) params.append("dateEnd", dateRange.end);
    } else if (dateFilterType && dateValue) {
      params.append("dateFilterType", dateFilterType);
      params.append("dateStart", dateValue);
    }

    // Points filter
    if (pointsFilterType === "range") {
      if (pointsRange.min) params.append("pointsMin", pointsRange.min);
      if (pointsRange.max) params.append("pointsMax", pointsRange.max);
    } else if (pointsFilterType && pointsValue) {
      params.append("pointsFilterType", pointsFilterType);
      params.append("pointsValue", pointsValue);
    }

    router.push(`/admin/waitlist/storekwil?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/admin/waitlist/storekwil"); // Navigate to the base URL
  };

  const removeFilter = (filterKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(filterKey);
    router.push(`/admin/waitlist/storekwil?${params.toString()}`);
  };

  return (
    <div className="border rounded-md bg-white overflow-hidden">
     <div onClick={() => setOpen(!open)} className={`flex cursor-pointer  items-center justify-between py-3 px-3 font-bold  ${open ? "bg-light" : "bg-white"}`}>
        <h3 className={`subheading ${open ? "text-gray-900" : "text-gray-500"}`}>  Advanced Search Filters</h3>
        <IoIosArrowDropdown className={`cursor-pointer text-2xl hover:text-primary ${open && "rotate-180"}`} />
      </div>
  {open &&  <form onSubmit={handleSearch} className=" p-6">
      {/* <h3 className="text-xl font-medium text-gray-600 mb-4">
        Advanced Search Filters
      </h3> */}

      {/* General query filters */}
      <div className="flex gap-2 items-center mb-4">
        <select
          value={queryType}
          onChange={(e) => setQueryType(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">Select query type</option>
          <option value="firstName">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="company">Company</option>
          <option value="country">Country</option>
        </select>
        <input
          type="text"
          placeholder="Search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      {/* Date filters */}
      <div className="flex gap-2 items-center mb-4">
        <select
          value={dateFilterType}
          onChange={(e) => setDateFilterType(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">Select date filter</option>
          <option value="dateAfter">Date After</option>
          <option value="dateBefore">Date Before</option>
          <option value="range">Date Range</option>
        </select>
        {dateFilterType === "range" ? (
          <div className="flex gap-2 w-full">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="border rounded px-2 py-1 w-full"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        ) : (
          <input
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        )}
      </div>

      {/* Points filters */}
      {/* <div className="flex gap-2 items-center mb-4">
        <select
          value={pointsFilterType}
          onChange={(e) => setPointsFilterType(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">Select points filter</option>
          <option value="pointsGreaterThan">Points Greater Than</option>
          <option value="pointsLessThan">Points Less Than</option>
          <option value="pointsEqual">Points Equal To</option>
          <option value="range">Points Range</option>
        </select>
        {pointsFilterType === "range" ? (
          <div className="flex gap-2 w-full">
            <input
              type="number"
              placeholder="Min"
              value={pointsRange.min}
              onChange={(e) =>
                setPointsRange((prev) => ({ ...prev, min: e.target.value }))
              }
              className="border rounded px-2 py-1 w-full"
            />
            <input
              type="number"
              placeholder="Max"
              value={pointsRange.max}
              onChange={(e) =>
                setPointsRange((prev) => ({ ...prev, max: e.target.value }))
              }
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        ) : (
          <input
            type="number"
            placeholder="Enter points"
            value={pointsValue}
            onChange={(e) => setPointsValue(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        )}
      </div> */}

      {/* Submit and Clear buttons */}
      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          className="bg-gray-50 hover:bg-gray-100 border text-gray-500 px-4 py-1 rounded"
        >
          Search
        </button>
 
      </div>

      {/* Applied Filters */}
      <div className="mb-4">
       {Array.from(searchParams.entries()).length>0 &&  <h4 className="text-lg font-medium text-gray-600 mb-2">
          Applied Filters:
        </h4>}
        <div className="flex gap-2 flex-wrap">
          {Array.from(searchParams.entries()).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center gap-1 bg-gray-100 border px-2 py-1 rounded"
            >
              <span>{`${key}: ${value}`}</span>
              <button
                type="button"
                onClick={() => removeFilter(key)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

            {/* Submit and Clear buttons */}
            <div className="flex gap-2 justify-end">
  {Array.from(searchParams.entries()).length>0 &&      <button
          type="button"
          onClick={clearFilters}
          className="bg-red-50 hover:bg-red-100 border text-red-500 px-4 py-1 rounded"
        >
          Clear Filters
        </button>}
      </div>
    </form>}
    </div>
  );
}
