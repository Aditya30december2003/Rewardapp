"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { IoIosArrowDropdown } from "react-icons/io";

export default function SearchFilters() {
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

  // Initialize from URL
  useEffect(() => {
    setQuery(searchParams.get("query") || "");
    setQueryType(searchParams.get("queryType") || "");
    setDateFilterType(searchParams.get("dateFilterType") || "");
    setDateValue(
      (searchParams.get("dateFilterType") || "") !== "range"
        ? searchParams.get("dateStart") || ""
        : ""
    );
    setDateRange({
      start: searchParams.get("dateStart") || "",
      end: searchParams.get("dateEnd") || "",
    });
    setPointsFilterType(searchParams.get("pointsFilterType") || "");
    setPointsValue(
      (searchParams.get("pointsFilterType") || "") !== "range"
        ? searchParams.get("pointsValue") || ""
        : ""
    );
    setPointsRange({
      min: searchParams.get("pointsMin") || "",
      max: searchParams.get("pointsMax") || "",
    });
  }, [searchParams]);

  const activeFiltersCount = useMemo(() => {
    const entries = Array.from(searchParams.entries());
    const ignore = new Set(["page"]);
    return entries.filter(([k, v]) => !ignore.has(k) && v !== "").length;
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (query.trim()) params.append("query", query.trim());
    if (queryType) params.append("queryType", queryType);

    if (dateFilterType === "range") {
      params.append("dateFilterType", "range");
      if (dateRange.start) params.append("dateStart", dateRange.start);
      if (dateRange.end) params.append("dateEnd", dateRange.end);
    } else if (dateFilterType && dateValue) {
      params.append("dateFilterType", dateFilterType);
      params.append("dateStart", dateValue);
    }

    if (pointsFilterType === "range") {
      params.append("pointsFilterType", "range");
      if (pointsRange.min) params.append("pointsMin", pointsRange.min);
      if (pointsRange.max) params.append("pointsMax", pointsRange.max);
    } else if (pointsFilterType && pointsValue) {
      params.append("pointsFilterType", pointsFilterType);
      params.append("pointsValue", pointsValue);
    }

    router.push(`/admin/users-management?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/admin/users-management");
  };

  const removeFilter = (filterKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(filterKey);
    router.push(`/admin/users-management?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-4xl rounded-xl border bg-white shadow-sm overflow-hidden">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between px-4 py-3 border-b transition-colors ${
          open ? "bg-slate-50" : "bg-white"
        } border-slate-200/80 text-left`}
        aria-expanded={open}
        aria-controls="advanced-filters"
      >
        <div className="flex items-center gap-2">
          <h3
            className={`text-sm md:text-base font-semibold ${
              open ? "text-slate-800" : "text-slate-600"
            }`}
          >
            Advanced Search Filters
          </h3>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <IoIosArrowDropdown
          className={`text-2xl text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <form
          id="advanced-filters"
          onSubmit={handleSearch}
          className="p-4 md:p-6"
        >
          {/* General query */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Query Type
              </label>
              <select
                value={queryType}
                onChange={(e) => setQueryType(e.target.value)}
                className="w-full rounded-lg border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select query type</option>
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="company">Company</option>
                <option value="country">Country</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Search Query
              </label>
              <input
                type="text"
                placeholder="Type a name, email, phone, company, or country…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Date filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Date Filter
              </label>
              <select
                value={dateFilterType}
                onChange={(e) => setDateFilterType(e.target.value)}
                className="w-full rounded-lg border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select date filter</option>
                <option value="dateAfter">Date After</option>
                <option value="dateBefore">Date Before</option>
                <option value="range">Date Range</option>
              </select>
            </div>

            {dateFilterType === "range" ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, start: e.target.value }))
                    }
                    className="w-full rounded-lg border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="w-full rounded-lg border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </>
            ) : (
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={dateValue}
                  onChange={(e) => setDateValue(e.target.value)}
                  className="w-full rounded-lg border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            )}
          </div>

          {/* Points filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Points Filter
              </label>
              <select
                value={pointsFilterType}
                onChange={(e) => setPointsFilterType(e.target.value)}
                className="w-full rounded-lg border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select points filter</option>
                <option value="pointsGreaterThan">Points Greater Than</option>
                <option value="pointsLessThan">Points Less Than</option>
                <option value="pointsEqual">Points Equal To</option>
                <option value="range">Points Range</option>
              </select>
            </div>

            {pointsFilterType === "range" ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Min Points
                  </label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={pointsRange.min}
                    onChange={(e) =>
                      setPointsRange((prev) => ({ ...prev, min: e.target.value }))
                    }
                    className="w-full rounded-lg border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Max Points
                  </label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={pointsRange.max}
                    onChange={(e) =>
                      setPointsRange((prev) => ({ ...prev, max: e.target.value }))
                    }
                    className="w-full rounded-lg border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </>
            ) : (
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Points
                </label>
                <input
                  type="number"
                  placeholder="Enter points"
                  value={pointsValue}
                  onChange={(e) => setPointsValue(e.target.value)}
                  className="w-full rounded-lg border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            )}
          </div>

          {/* Applied Filters */}
          <div className="mt-6">
            {Array.from(searchParams.entries()).length > 0 && (
              <>
                <h4 className="mb-2 text-sm font-semibold text-slate-700">
                  Applied Filters
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(searchParams.entries()).map(([key, value]) => (
                    <span
                      key={`${key}=${value}`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 hover:bg-white shadow-sm"
                    >
                      <span className="font-medium">{key}</span>
                      <span className="opacity-70">{value || "—"}</span>
                      <button
                        type="button"
                        onClick={() => removeFilter(key)}
                        className="ml-1 rounded-full px-1.5 py-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
            {Array.from(searchParams.entries()).length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
              >
                Clear Filters
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              Search
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
