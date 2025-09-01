import React from "react";

const Patterns = () => {
  return (
    <svg className="svg-patterns" aria-hidden>
      <defs>
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" />
        </pattern>

        <pattern id="stripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="8" />
        </pattern>

        <radialGradient id="blob" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="var(--brand-500)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--brand-500)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect className="pat pat-dots" x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
      <rect className="pat pat-stripes" x="0" y="0" width="100%" height="100%" fill="url(#stripes)" />
      <circle className="pat pat-blob-1" cx="88%" cy="8%" r="220" fill="url(#blob)" />
      <circle className="pat pat-blob-2" cx="6%" cy="92%" r="260" fill="url(#blob)" />
    </svg>
  );
};

export default Patterns;
