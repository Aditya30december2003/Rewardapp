"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Input, Button, Tooltip, Chip } from "@nextui-org/react";
import {
  EyeIcon,
  EyeSlashIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";

function isUrl(str = "") {
  try {
    const u = new URL(str);
    return !!u.protocol && !!u.host;
  } catch {
    return false;
  }
}

function mask(value = "") {
  if (!value) return "";
  if (value.length <= 8) return "•".repeat(value.length);
  const start = value.slice(0, 4);
  const end = value.slice(-4);
  const dots = "•".repeat(Math.max(4, value.length - 8));
  return `${start}${dots}${end}`;
}

function truncateMiddle(value = "", max = 56) {
  if (!value) return "";
  if (value.length <= max) return value;
  const head = value.slice(0, Math.floor(max / 2) - 3);
  const tail = value.slice(-Math.floor(max / 2));
  return `${head}...${tail}`;
}

/**
 * Props:
 *  - apiKey: string
 *  - title:  string
 *  - bodyColor?: string (brand tint for copy button)
 *  - compact?: boolean (true = table-cell friendly, smaller)
 */
const GenerateApiKey = ({ apiKey, title, bodyColor, compact = false }) => {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const urlLike = useMemo(() => isUrl(apiKey), [apiKey]);
  const secretLike = useMemo(
    () => !urlLike && /key|token|secret/i.test(title || "key"),
    [title, urlLike]
  );

  const displayRaw = useMemo(() => {
    if (secretLike && !revealed) return mask(apiKey);
    return apiKey || "";
  }, [apiKey, revealed, secretLike]);

  const displayValue = useMemo(() => {
    return compact && urlLike ? truncateMiddle(displayRaw, 48) : displayRaw;
  }, [displayRaw, urlLike, compact]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey || "");
      setCopied(true);
      toast.success(`${title || "Value"} copied to clipboard!`);
      setTimeout(() => setCopied(false), 900);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className={`w-full ${compact ? "" : "space-y-2"}`}>
      {/* Title/Chip (hidden in compact) */}
      {!compact && (
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {secretLike && (
            <Chip size="sm" variant="flat" color="warning" className="font-medium">
              Keep it secret
            </Chip>
          )}
        </div>
      )}

      {/* Field + Actions */}
      <div className={`flex items-center gap-2 ${compact ? "" : "max-md:flex-col max-md:items-stretch"}`}>
        <Input
          size={compact ? "sm" : "md"}
          value={displayValue}
          readOnly
          aria-label={`${title || "Value"} field`}
          variant="faded"
          className="flex-1"
          classNames={{
            input: "font-mono text-[13px] tracking-wide",
            inputWrapper:
              "bg-content1 shadow-none border border-default-200/70 data-[hover=true]:border-default-300",
          }}
          endContent={
            <div className="flex items-center gap-1">
              {secretLike && (
                <Tooltip content={revealed ? "Hide" : "Reveal"} placement="top">
                  <Button
                    isIconOnly
                    radius="sm"
                    size={compact ? "sm" : "md"}
                    variant="light"
                    onPress={() => setRevealed((v) => !v)}
                    aria-label={revealed ? "Hide value" : "Reveal value"}
                  >
                    {revealed ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </Tooltip>
              )}

              {urlLike && (
                <Tooltip content="Open in new tab" placement="top">
                  <Button
                    as="a"
                    href={apiKey}
                    target="_blank"
                    rel="noopener noreferrer"
                    isIconOnly
                    radius="sm"
                    size={compact ? "sm" : "md"}
                    variant="light"
                    aria-label="Open link"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </Button>
                </Tooltip>
              )}

              <Tooltip content={copied ? "Copied!" : "Copy"} placement="top">
                <Button
                  isIconOnly
                  radius="sm"
                  size={compact ? "sm" : "md"}
                  variant="solid"
                  aria-label="Copy"
                  onPress={handleCopy}
                  style={bodyColor ? { backgroundColor: bodyColor, color: "#fff" } : undefined}
                  className={bodyColor ? "hover:opacity-90" : ""}
                >
                  {copied ? (
                    <ClipboardDocumentCheckIcon className="h-4 w-4" />
                  ) : (
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  )}
                </Button>
              </Tooltip>
            </div>
          }
        />
      </div>

      {/* Helper text (hidden in compact) */}
      {!compact && (
        <p className="text-xs text-default-500">
          {secretLike
            ? "Treat this like a password. Rotate if exposed."
            : "You can share this link safely."}
        </p>
      )}
    </div>
  );
};

export default GenerateApiKey;
