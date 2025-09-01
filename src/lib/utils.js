import { ID } from "node-appwrite";

/* ----------------------- Currency & Number Formatting ----------------------- */

export const formatCurrency = (amount) => {
  const cents = Number(amount) || 0;
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

// "en-EU" is not a valid locale. Use an English-in-Europe locale that uses EUR (e.g., Ireland).
export const formatCurrencytoEuro = (amount) => {
  const cents = Number(amount) || 0;
  return (cents / 100).toLocaleString("en-IE", {
    style: "currency",
    currency: "EUR",
  });
};

/* ----------------------------- Date Formatting ----------------------------- */

export const formatEpochToLocal = (epochTime, locale = "en-US") => {
  // Accept both seconds and milliseconds
  const n = Number(epochTime);
  const ms = !Number.isFinite(n) ? Date.now() : (n < 1e12 ? n * 1000 : n);
  const date = new Date(ms);

  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const formatDateToLocal = (dateStr, locale = "en-US") => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return ""; // invalid input guard
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

/* ------------------------------- Time helpers ------------------------------ */

export const formatMinutes = (totalMinutes) => {
  const m = Number(totalMinutes);
  if (!Number.isFinite(m) || m < 0) return "0 min";

  const hours = Math.floor(m / 60);
  const minutes = m % 60;

  if (hours && minutes) return `${hours} h ${minutes} min`;
  if (hours) return `${hours} h`;
  if (minutes) return `${minutes} min`;
  return "0 min";
};

export const calculateNextTimestamp = (createdAt, durationInMinutes) => {
  const base = new Date(createdAt);
  if (Number.isNaN(base.getTime())) return "";
  const next = new Date(base.getTime() + (Number(durationInMinutes) || 0) * 60000);
  return formatDateToLocal(next.toISOString());
};

export const parseDuration = (value, unit) => {
  const v = Number(value) || 0;
  switch (unit) {
    case "minutes": return v;
    case "hours":   return v * 60;
    case "days":    return v * 24 * 60;
    default:        return 0;
  }
};

export function parsedMinutes(minutes) {
  const m = Math.max(0, Number(minutes) || 0);
  const hours = Math.floor(m / 60);
  const remainingMinutes = m % 60;
  return hours > 0
    ? { durationValue: hours, durationType: "hours" }
    : { durationValue: remainingMinutes, durationType: "minutes" };
}

/* ------------------------------ Pagination -------------------------------- */

export const generatePagination = (currentPage, totalPages) => {
  const c = Math.max(1, Number(currentPage) || 1);
  const t = Math.max(1, Number(totalPages) || 1);

  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);
  if (c <= 3) return [1, 2, 3, "...", t - 1, t];
  if (c >= t - 2) return [1, 2, "...", t - 2, t - 1, t];
  return [1, "...", c - 1, c, c + 1, "...", t];
};

/* ------------------------------ Charts / Y Axis ---------------------------- */
/**
 * Accepts either:
 *  - number[]  -> treated as registration counts
 *  - object[]  -> reads month.userRegistrations (or .count)
 * Returns y-axis labels stepped to a nice round value.
 */
export const generateYAxis = (registrationsInput) => {
  const arr = Array.isArray(registrationsInput) ? registrationsInput : [];

  // Normalize to array of numbers
  const series = arr
    .map((item) => {
      if (typeof item === "number") return item;
      if (item && typeof item === "object") {
        const val = item.userRegistrations ?? item.count ?? 0;
        return Number(val) || 0;
      }
      return 0;
    })
    .filter((n) => Number.isFinite(n) && n >= 0);

  const highestRecord = series.length ? Math.max(...series) : 0;

  // Pick a sensible step based on the magnitude
  const step =
    highestRecord <= 10 ? 1 :
    highestRecord <= 50 ? 5 :
    highestRecord <= 100 ? 10 :
    highestRecord <= 500 ? 50 :
    100;

  const topLabel = Math.ceil(highestRecord / step) * step;

  const yAxisLabels = [];
  for (let i = topLabel; i >= 0; i -= step) {
    yAxisLabels.push(String(i));
  }

  return { yAxisLabels, topLabel, step };
};

/* ------------------------------ Misc helpers ------------------------------ */

export function parseCentsToEuros(cents) {
  const total = Math.max(0, Math.floor(Number(cents) || 0));
  const euros = Math.floor(total / 100);
  const rem = total % 100;
  // Format with 2 digits of cents if present
  return rem > 0 ? `${euros},${String(rem).padStart(2, "0")}` : `${euros}`;
}

export function getMostFrequentProperty(tickets) {
  if (!Array.isArray(tickets) || tickets.length === 0) return null;

  const counts = new Map();
  for (const t of tickets) {
    const id =
      t?.property?.$id ??
      t?.propertyId ??
      t?.property ??
      null;
    if (!id) continue;
    counts.set(id, (counts.get(id) || 0) + 1);
  }

  let maxKey = null;
  let maxCount = 0;
  for (const [key, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      maxKey = key;
    }
  }
  return maxKey;
}

export function generateReferralCode(firstName = "") {
  const initials = String(firstName).slice(0, 4).toUpperCase();
  const random = ID.unique(); // random string from Appwrite SDK
  const digits = random.replace(/\D/g, "").slice(0, 4);
  const paddedDigits = digits.padEnd(4, "0");
  return (initials + paddedDigits).slice(0, 8);
}

export const formatSizeBytes = (bytes, decimals = 1) => {
  const b = Number(bytes) || 0;
  if (b === 0) return "0 Bytes";
  const k = 1024;
  const i = Math.floor(Math.log(b) / Math.log(k));
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  return `${parseFloat((b / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export function maskEmail(email) {
  if (!email || typeof email !== "string" || !email.includes("@")) return "";
  const [localPart, domain] = email.split("@");
  const maskedLocal = localPart.slice(0, 2) + "*****";
  const maskedDomain = domain.replace(/^(.*?)(\..*)$/, "*****$2");
  return `${maskedLocal}@${maskedDomain}`;
}
