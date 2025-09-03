"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { updateTiers } from "@/lib/actions";

import { MoreVertical, Award, Plus, Trash2, Edit3 } from "lucide-react"; 

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Progress,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
} from "@nextui-org/react";

/** ---------- Design Tokens ---------- */
const ACCENTS = [
  { name: "indigo",  dotBg: "bg-violet-100",  dotText: "text-violet-600",  headerGradient: "from-violet-300 to-fuchsia-200" },
  { name: "emerald", dotBg: "bg-emerald-100", dotText: "text-emerald-600", headerGradient: "from-emerald-300 to-teal-200" },
  { name: "rose",    dotBg: "bg-rose-100",    dotText: "text-rose-600",    headerGradient: "from-rose-300 to-fuchsia-200" },
  { name: "amber",   dotBg: "bg-amber-100",   dotText: "text-amber-600",   headerGradient: "from-amber-300 to-orange-200" },
];

/** ---------- Helpers ---------- */
const initialState = { message: "", type: "" };
const pctOf = (v, max) => {
  const n = Number(v) || 0;
  const m = Number(max) || 1;
  return Math.max(0, Math.min(100, Math.round((n / m) * 100)));
};

/** ---------- Skeleton ---------- */
const TierCardSkeleton = () => (
  <Card className="w-full rounded-2xl border border-default-200 overflow-hidden min-h-[320px]" shadow="sm">
    <div className="h-24 w-full bg-default-100" />
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full w-9 h-9 bg-default-100" />
        <div className="space-y-2 w-full">
          <div className="h-4 w-24 bg-default-100 rounded-lg" />
          <div className="h-3 w-32 bg-default-100 rounded-lg" />
        </div>
      </div>
      <div className="h-12 bg-default-100 rounded-xl" />
      <div className="h-12 bg-default-100 rounded-xl" />
      <div className="space-y-2">
        <div className="h-2 w-full rounded-lg bg-default-100" />
        <div className="h-2 w-24 rounded-lg bg-default-100 ml-auto" />
      </div>
    </div>
  </Card>
);

/** ---------- Delete Confirm Modal ---------- */
const DeleteConfirmModal = ({ isOpen, onOpenChange, tier }) => {
  const [delState, delAction] = useFormState(deleteTier, initialState);

  useEffect(() => {
    if (!delState?.type) return;
    if (delState.type === "success") {
      toast.success(delState.message || "Tier deleted");
      onOpenChange(false);
    } else if (delState.type === "error") {
      toast.error(delState.message || "Failed to delete");
    }
  }, [delState, onOpenChange]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="sm">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete Tier
              <span className="text-xs text-default-500 font-normal">
                This action cannot be undone.
              </span>
            </ModalHeader>
            <form action={delAction}>
              <input type="hidden" name="tierId" value={tier?.$id || ""} />
              <ModalBody>
                <p className="text-sm">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{tier?.label}</span>?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" type="submit" startContent={<Trash2 size={16} />}>
                  Delete
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

/** ---------- Create Tier Modal ---------- */
const CreateTierModal = ({ isOpen, onOpenChange }) => {
  const [createState, createAction] = useFormState(createTier, initialState);
  const [local, setLocal] = useState({ label: "", threshold: "" });

  useEffect(() => {
    if (!createState?.type) return;
    if (createState.type === "success") {
      toast.success(createState.message || "Tier created");
      setLocal({ label: "", threshold: "" });
      onOpenChange(false);
    } else if (createState.type === "error") {
      toast.error(createState.message || "Failed to create tier");
    }
  }, [createState, onOpenChange]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setLocal((s) => ({
      ...s,
      [name]: name === "threshold" ? value.replace(/[^\d]/g, "") : value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="md" backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Create New Tier
              <span className="text-xs font-normal text-default-500">
                Define a label and the minimum points required.
              </span>
            </ModalHeader>

            <form action={createAction}>
              <ModalBody className="gap-4">
                <Input
                  label="Tier Label"
                  name="label"
                  value={local.label}
                  onChange={onChange}
                  placeholder="e.g., Gold"
                  isRequired
                />
                <Input
                  label="Points Threshold"
                  name="threshold"
                  type="number"
                  value={local.threshold}
                  onChange={onChange}
                  min={0}
                  placeholder="e.g., 1000"
                  isRequired
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Create Tier
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

/** ---------- One Tier Card (matches your screenshot) ---------- */
const LevelTier = ({ id, label, threshold, tierIndex, maxThreshold }) => {
  const [updateState, updateAction] = useFormState(updateTiers, initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ label, threshold });

  const accent = ACCENTS[tierIndex % ACCENTS.length];
  const pct = useMemo(() => pctOf(form.threshold, maxThreshold), [form.threshold, maxThreshold]);

  useEffect(() => {
    if (!updateState?.type) return;
    if (updateState.type === "success") {
      toast.success(updateState.message || "Saved");
      setIsEditing(false);
    } else if (updateState.type === "error") {
      toast.error(updateState.message || "Failed to save");
    }
  }, [updateState]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: name === "threshold" ? Number(value) : value }));
  };

  const onCancel = () => {
    setForm({ label, threshold });
    setIsEditing(false);
  };

  return (
    <form action={updateAction} className="w-full">
      <input type="hidden" name="tierId" value={id} />
      <Card shadow="sm" className="rounded-2xl border border-default-200 overflow-hidden" isHoverable>
        {/* Soft gradient header like your image */}
        <div className={`relative h-24 w-full bg-gradient-to-b ${accent.headerGradient}`} />
        {/* Floating tier circle */}
        <div className="relative">
          <div
            className={`absolute -top-5 left-4 flex h-9 w-9 items-center justify-center rounded-full ${accent.dotBg} ${accent.dotText} text-xs font-bold shadow-sm`}
          >
            {tierIndex + 1}
          </div>
        </div>

        <CardHeader className="pt-6 pb-1 px-4">
          <div style={{padding:"20px"}} className="flex w-full items-start justify-between">
            <div >
              <h3 className="text-[15px] font-extrabold leading-tight">Tier {tierIndex + 1}</h3>
              <p className="text-[12px] text-default-500 mt-1">
                {isEditing ? "Editing tier details…" : "Rewards & benefits"}
              </p>
            </div>

            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light" aria-label="More actions" className="text-default-600">
                  <MoreVertical size={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Tier actions">
                {!isEditing && (
                  <DropdownItem key="edit" startContent={<Edit3 size={14} />} onPress={() => setIsEditing(true)}>
                    Edit
                  </DropdownItem>
                )}
                {/* Delete handled by parent with a confirm modal – we expose a custom event */}
                <DropdownItem key="delete" className="text-danger" color="danger" startContent={<Trash2 size={14} />}>
                  <button type="button" className="w-full text-left" data-tierid={id} data-tierlabel={label} onClick={(e)=>{
                    const evt = new CustomEvent("open-delete-tier", {
                      bubbles: true,
                      detail: { $id: id, label }
                    });
                    e.currentTarget.dispatchEvent(evt);
                  }}>
                    Delete
                  </button>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardHeader>

        <CardBody style={{padding:"20px"}} className="px-4 pt-2 gap-4">
          {isEditing ? (
            <>
              <Input
                variant="flat"
                size="sm"
                label="Tier Label"
                name="label"
                value={form.label}
                onChange={onChange}
                classNames={{
                  inputWrapper: "bg-default-100 shadow-none rounded-xl h-12 data-[hover=true]:bg-default-100",
                  label: "text-[12px]",
                  input: "text-[14px] font-medium",
                }}
                autoFocus
              />
              <Input
                variant="flat"
                size="sm"
                type="number"
                label="Points Threshold"
                name="threshold"
                value={String(form.threshold ?? "")}
                onChange={onChange}
                min={0}
                classNames={{
                  inputWrapper: "bg-default-100 shadow-none rounded-xl h-12 data-[hover=true]:bg-default-100",
                  label: "text-[12px]",
                  input: "text-[14px] font-medium",
                }}
              />
            </>
          ) : (
            <div  className="space-y-2">
              <Chip size="sm" variant="flat" className="font-semibold">{form.label || "Unnamed"}</Chip>
              <p className="text-sm text-default-500">
                Requires <span className="font-semibold text-default-700">{form.threshold}</span> points to unlock.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[12px] text-default-500">
              <span>Progress to Max Tier</span>
              <span className="font-semibold text-default-600">{pct}%</span>
            </div>
            <Progress
              aria-label="progress"
              value={pct}
              size="sm"
              className="mt-1"
              classNames={{
                track: "h-1.5 rounded-full",
                indicator: "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-fuchsia-500",
              }}
            />
          </div>
        </CardBody>

        {isEditing && (
          <CardFooter className="px-4 pb-4 pt-2 flex justify-between">
            <Button variant="light" size="sm" className="font-medium text-default-700" onPress={onCancel}>
              Cancel
            </Button>
            <Button size="sm" className="font-semibold rounded-xl bg-fuchsia-600 text-white hover:brightness-95" type="submit">
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>
    </form>
  );
};

/** ---------- Main List (3 cards like your image) ---------- */
const LevelTierList = ({ tiersData, isLoading }) => {
  const maxThreshold =
    Array.isArray(tiersData) && tiersData.length
      ? Math.max(...tiersData.map((t) => Number(t.threshold) || 0), 1)
      : 1;

  const createDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const [tierToDelete, setTierToDelete] = useState(null);

  // Capture delete requests from any child card
  useEffect(() => {
    const handler = (e) => {
      setTierToDelete(e.detail);
      deleteDisclosure.onOpen();
    };
    window.addEventListener("open-delete-tier", handler);
    return () => window.removeEventListener("open-delete-tier", handler);
  }, [deleteDisclosure]);

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              Loyalty Program Tiers
            </h2>
            <p className="text-sm text-default-500">
              Edit or delete tiers. Cards are responsive and match the provided design.
            </p>
          </div>
          <Button color="primary" startContent={<Plus size={16} />} onPress={createDisclosure.onOpen}>
            Add New Tier
          </Button>
        </div>

        {/* Grid: 1 / 2 / 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <>
              <TierCardSkeleton />
              <TierCardSkeleton />
              <TierCardSkeleton />
            </>
          ) : !tiersData || tiersData.length === 0 ? (
            <Card className="col-span-full p-8">
              <div className="w-full flex flex-col items-center justify-center text-center">
                <Award className="text-default-300" size={48} />
                <p className="mt-4 font-semibold text-default-700">No Tiers Configured</p>
                <p className="text-sm text-default-500">
                  Click Add New Tier to create your first loyalty level.
                </p>
              </div>
            </Card>
          ) : (
            tiersData.map((tier, index) => (
              <LevelTier
                key={tier.$id}
                id={tier.$id}
                tierIndex={index}
                label={tier.label}
                threshold={tier.threshold}
                maxThreshold={maxThreshold}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateTierModal isOpen={createDisclosure.isOpen} onOpenChange={createDisclosure.onOpenChange} />
      <DeleteConfirmModal isOpen={deleteDisclosure.isOpen} onOpenChange={deleteDisclosure.onOpenChange} tier={tierToDelete} />
    </>
  );
};

export default LevelTierList;
