"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "react-toastify";
import { UpdateUserPassword } from "@/lib/actions";
import { Input, Button, Tooltip } from "@nextui-org/react";
import { BiCheckCircle, BiXCircle, BiShow, BiHide, BiInfoCircle } from "react-icons/bi";

const initialState = { message: "", type: "" };

function SubmitButton({ disabled, children }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      color="primary"
      variant="solid"
      className="font-semibold shadow-none"
      isLoading={pending}
      isDisabled={pending || disabled}
    >
      {children}
    </Button>
  );
}

// Helpers for “no sequences / repeats”
function hasAscendingSequence(str) {
  const s = str.toLowerCase();
  const isSeq = (a, b) => b.charCodeAt(0) - a.charCodeAt(0) === 1;
  for (let i = 0; i < s.length - 2; i++) {
    const a = s[i], b = s[i + 1], c = s[i + 2];
    const allAlpha = /[a-z]/.test(a + b + c);
    const allNum = /[0-9]/.test(a + b + c);
    if ((allAlpha || allNum) && isSeq(a, b) && isSeq(b, c)) return true;
  }
  return false;
}
function hasDescendingSequence(str) {
  const s = str.toLowerCase();
  const isSeq = (a, b) => a.charCodeAt(0) - b.charCodeAt(0) === 1;
  for (let i = 0; i < s.length - 2; i++) {
    const a = s[i], b = s[i + 1], c = s[i + 2];
    const allAlpha = /[a-z]/.test(a + b + c);
    const allNum = /[0-9]/.test(a + b + c);
    if ((allAlpha || allNum) && isSeq(a, b) && isSeq(b, c)) return true;
  }
  return false;
}
function hasTripleRepeat(str) {
  return /(.)\1\1/.test(str);
}
 
export default function UpdatePassword({
  userId,
  Useremail,
  recentPasswords = [],
}) {
  const [state, formAction] = useFormState(UpdateUserPassword, initialState);

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const formRef = useRef(null);

  useEffect(() => {
    if (state.type === "success") {
      toast.success(state.message);
      formRef.current?.reset();
      setNewPwd("");
      setConfirmPwd("");
    } else if (state.type === "error") {
      toast.error(state.message);
    }
  }, [state]);

  const toggle = (key) =>
    setShowPassword((p) => ({ ...p, [key]: !p[key] }));

  // Rules from the screenshot
  const ruleLength = newPwd.length >= 11 && newPwd.length <= 15;
  const ruleUpperLower = /[A-Z]/.test(newPwd) && /[a-z]/.test(newPwd);
  const ruleDigitSpecial = /\d/.test(newPwd) && /[^A-Za-z0-9]/.test(newPwd);
  const ruleNoSeqOrRepeat =
    newPwd.length > 0 &&
    !hasAscendingSequence(newPwd) &&
    !hasDescendingSequence(newPwd) &&
    !hasTripleRepeat(newPwd);
  const ruleNotInLastThree =
    recentPasswords.length === 0
      ? true
      : !recentPasswords.some((p) => p && newPwd && p === newPwd);

  const match = confirmPwd.length > 0 ? newPwd === confirmPwd : true;
  const allPass =
    ruleLength &&
    ruleUpperLower &&
    ruleDigitSpecial &&
    ruleNoSeqOrRepeat &&
    ruleNotInLastThree &&
    match;

  return (
    <section className="w-full max-w-2xl mx-auto">
      <form style={{marginTop:"8%"}} ref={formRef} action={formAction} autoComplete="off" className="space-y-6">
        {/* Header (no lines/shadows) */}
        <header>
        
          <p className="mt-1 text-sm text-default-600">
            Follow the rules below. Items turn green ✅ as you satisfy them.
          </p>
        </header>

        {/* New Password */}
        <div>
          <Input
            name="newpwd"
            label="New Password"
            placeholder="Enter new password"
            type={showPassword.newPassword ? "text" : "password"}
            value={newPwd}
            onValueChange={(v) => {
              if (v.length <= 15) setNewPwd(v); // hard max 15
            }}
            variant="faded"
            classNames={{
              inputWrapper: "shadow-none border-0",
            }}
            isRequired
            maxLength={15}
            endContent={
              <Tooltip content={showPassword.newPassword ? "Hide password" : "Show password"}>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="shadow-none"
                  onPress={() => toggle("newPassword")}
                >
                  {showPassword.newPassword ? <BiHide className="text-xl" /> : <BiShow className="text-xl" />}
                </Button>
              </Tooltip>
            }
          />

          {/* Rules list (no borders/lines) */}
          <ul className="mt-3 space-y-1.5 text-sm">
            <RuleItem ok={ruleLength} text="Minimum 11 to Maximum 15 characters allowed." />
            <RuleItem ok={ruleUpperLower} text="Password must contain at least one small and one capital alphabet." />
            <RuleItem ok={ruleDigitSpecial} text="At least one numeric digit and one special character (@#$%^&* etc.)." />
            <RuleItem ok={ruleNoSeqOrRepeat} text="Password should not contain any sequence or repeated characters like 123, 000, 111, abc, aaa etc." />
            <li className="flex items-start gap-2 text-xs text-default-500 mt-2">
              <BiInfoCircle className="mt-0.5 text-default-400" />
              <span>
                Note: The password must not be the same as any of your last three passwords.
              </span>
            </li>
          </ul>
        </div>

        {/* Confirm Password */}
        <div>
          <Input
            name="confirmpwd"
            label="Confirm Password"
            placeholder="Re-enter new password"
            type={showPassword.confirmPassword ? "text" : "password"}
            value={confirmPwd}
            onValueChange={(v) => {
              if (v.length <= 15) setConfirmPwd(v);
            }}
            variant="faded"
            classNames={{ inputWrapper: "shadow-none border-0" }}
            isRequired
            maxLength={15}
            endContent={
              <Tooltip content={showPassword.confirmPassword ? "Hide password" : "Show password"}>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="shadow-none"
                  onPress={() => toggle("confirmPassword")}
                >
                  {showPassword.confirmPassword ? <BiHide className="text-xl" /> : <BiShow className="text-xl" />}
                </Button>
              </Tooltip>
            }
          />
          {!match && confirmPwd.length > 0 && (
            <p className="mt-2 text-sm text-danger">Passwords do not match.</p>
          )}
        </div>

        {/* Hidden fields */}
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="userEmail" value={Useremail} />

        {/* Actions */}
        <div className="flex justify-end">
          <SubmitButton disabled={!allPass}>Update Password</SubmitButton>
        </div>
      </form>
    </section>
  );
}

function RuleItem({ ok, text }) {
  return (
    <li className={`flex items-start gap-2 ${ok ? "text-success" : "text-danger"}`}>
      {ok ? (
        <BiCheckCircle className="mt-0.5 shrink-0 text-lg" />
      ) : (
        <BiXCircle className="mt-0.5 shrink-0 text-lg" />
      )}
      <span className={`${ok ? "text-success-700" : "text-danger-700"} leading-snug`}>{text}</span>
    </li>
  );
}
