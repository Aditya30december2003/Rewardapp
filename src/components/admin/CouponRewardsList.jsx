"use client";

import { useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { formatDateToLocal } from "@/lib/utils";
import { createRewardCoupon, deleteReward } from "@/lib/actions";
import {  Divider } from "@nextui-org/react";


// NextUI Components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Input,
  Select,
  SelectItem,
  Snippet,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";

// Icons
import {
  TrashIcon,
  PlusIcon,
  GiftIcon,
  SparklesIcon,
  TagIcon,
  CalendarDaysIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  InboxIcon,
  ArrowRightIcon,
  XMarkIcon,
  ArrowPathIcon,
  BanknotesIcon,
  TicketIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

/* ----------------------------- Design Tokens ----------------------------- */

const rewardTypeConfig = {
  CASH: {
    color: "success",
    icon: <BanknotesIcon className="w-5 h-5" />,
    headerClass: "bg-gradient-to-br from-green-500 to-emerald-500",
  },
  VOUCHER: {
    color: "primary",
    icon: <TicketIcon className="w-5 h-5" />,
    headerClass: "bg-gradient-to-br from-violet-500 to-indigo-500",
  },
  COUPON: {
    color: "warning",
    icon: <TagIcon className="w-5 h-5" />,
    headerClass: "bg-gradient-to-br from-amber-500 to-orange-500",
  },
  BADGE: {
    color: "secondary",
    icon: <ShieldCheckIcon className="w-5 h-5" />,
    headerClass: "bg-gradient-to-br from-sky-500 to-cyan-500",
  },
};

/* ----------------------------- Rebuilt Popup Form ----------------------------- */

function PopupForm({ isOpen, onClose, onSubmit, title, description }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    startTransition(async () => {
      try {
        await onSubmit(formData);
        toast.success("Reward created successfully!");
        onClose();
      } catch (e) {
        console.error(e);
        toast.error("Failed to create reward. Please try again.");
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center" backdrop="blur">
      <ModalContent>
        {(onCloseHandler) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              {title}
              <p className="text-sm font-normal text-default-500">{description}</p>
            </ModalHeader>
            <ModalBody>
              <Input name="name" label="Reward Name" placeholder="e.g., Summer Sale 20% Off" isRequired />
              <Input name="promoCode" label="Promo Code" placeholder="e.g., SUMMER20" isRequired />
              <Input name="pointsRequired" label="Points Required" placeholder="e.g., 1000" type="number" min="0" isRequired />
              <Input name="expiry" label="Expiry Date" type="date" placeholder="Select expiry date" isRequired />
              <Select name="rewardType" label="Reward Type" placeholder="Select reward type" isRequired>
                <SelectItem key="COUPON" value="COUPON">Coupon</SelectItem>
                <SelectItem key="VOUCHER" value="VOUCHER">Voucher</SelectItem>
                <SelectItem key="CASH" value="CASH">Cash</SelectItem>
                <SelectItem key="BADGE" value="BADGE">Badge</SelectItem>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onCloseHandler}>Close</Button>
              <Button color="primary" type="submit" isLoading={isPending}>Create Reward</Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

/* ----------------------------- Enhanced UI Components ----------------------------- */

const ConfirmDeleteButton = ({ fileID }) => {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000); // Reset after 3s
      return;
    }

    const formData = new FormData();
    formData.append("fileID", fileID);
    
    startTransition(async () => {
      try {
        await deleteReward(formData);
        toast.success("Reward deleted successfully");
      } catch (e) {
        toast.error("Failed to delete reward");
      }
    });
  };

  return (
    <Tooltip content={confirming ? "Click again to confirm" : "Delete reward"} color={confirming ? "danger" : "default"}>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className="absolute right-2 top-2 z-10 !bg-white/70 backdrop-blur-sm"
        onPress={handleDelete}
        isLoading={pending}
        color={confirming ? "danger" : "default"}
      >
        {pending ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <TrashIcon className="h-4 w-4" />}
      </Button>
    </Tooltip>
  );
};

const RewardCard = ({ coupon }) => {
  const isExpired = new Date(coupon.expiry).getTime() < Date.now();
  const isSoon = !isExpired && (new Date(coupon.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 7;
  const config = rewardTypeConfig[coupon.rewardType] || rewardTypeConfig.COUPON;

  return (
    <motion.div layout variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
      <Card isHoverable className={`w-full transition-all ${isExpired ? "saturate-50" : ""}`}>
        <CardHeader className={`flex flex-col items-start p-5 text-white ${config.headerClass}`}>
          <div className="flex w-full items-start justify-between">
            <h3 className="max-w-[85%] truncate text-lg font-bold" title={coupon.name}>
              {coupon.name}
            </h3>
            <ConfirmDeleteButton fileID={coupon.$id} />
          </div>
          <Chip
            startContent={config.icon}
            variant="flat"
            size="sm"
            className="mt-2 bg-white/20 text-white"
          >
            {coupon.rewardType}
          </Chip>
        </CardHeader>
        <CardBody className="p-5">
          <Snippet
            symbol=""
            variant="bordered"
            color={isExpired ? "default" : "primary"}
            className="text-lg font-mono"
          >
            {coupon.promoCode}
          </Snippet>
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-default-600">
              <SparklesIcon className="h-5 w-5 text-default-400" />
              Requires <strong className="text-default-800">{coupon.pointsRequired}</strong> points
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDaysIcon className={`h-5 w-5 ${isExpired ? "text-danger-400" : isSoon ? "text-warning-500" : "text-default-400"}`} />
              <span className={`font-medium ${isExpired ? "text-danger" : isSoon ? "text-warning-600" : "text-default-600"}`}>
                {isExpired ? "Expired on" : "Expires"} {formatDateToLocal(coupon.expiry)}
              </span>
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex items-center justify-between p-5 pt-0">
          <Chip color={isExpired ? "danger" : isSoon ? "warning" : "success"} variant="flat">
            {isExpired ? "Expired" : isSoon ? "Expiring soon" : "Active"}
          </Chip>
          <Button
            color="primary"
            variant="solid"
            isDisabled={isExpired}
            endContent={<ArrowRightIcon className="h-4 w-4" />}
            onPress={() => toast.info("Redemption flow coming soon")}
          >
            Redeem
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const ComponentHeader = ({ query, setQuery, typeFilter, setTypeFilter, onNew }) => (
  <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Rewards Center</h1>
      <p className="mt-1 text-sm text-slate-600">Engage customers with attractive incentives and loyalty rewards.</p>
    </div>
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <Input
        isClearable
        placeholder="Search rewards..."
        value={query}
        onValueChange={setQuery}
        startContent={<MagnifyingGlassIcon className="h-5 w-5 text-default-400" />}
        className="w-full sm:w-64"
      />
      <Select
        aria-label="Filter by type"
        placeholder="Filter by type"
        selectedKeys={[typeFilter]}
        onChange={(e) => setTypeFilter(e.target.value)}
        startContent={<FunnelIcon className="h-5 w-5 text-default-400" />}
        className="w-full sm:w-48"
      >
        <SelectItem key="ALL">All Types</SelectItem>
        <SelectItem key="COUPON">Coupon</SelectItem>
        <SelectItem key="VOUCHER">Voucher</SelectItem>
        <SelectItem key="CASH">Cash</SelectItem>
        <SelectItem key="BADGE">Badge</SelectItem>
      </Select>
      <Button
        color="primary"
        variant="shadow"
        onPress={onNew}
        startContent={<PlusIcon className="h-5 w-5" />}
        className="w-full sm:w-auto"
      >
        New Reward
      </Button>
    </div>
  </header>
);

const EmptyState = ({ onNew, type = "NO_REWARDS" }) => {
  const config = {
    NO_REWARDS: {
      icon: GiftIcon,
      title: "No Rewards Created Yet",
      message: "Get started by creating your first reward to engage your customers.",
      buttonText: "Create Reward",
      action: onNew,
    },
    NO_RESULTS: {
      icon: InboxIcon,
      title: "No Matching Rewards",
      message: "Try adjusting your search or filters to find what you're looking for.",
      buttonText: "Clear Filters",
      action: onNew, // The `onNew` prop for this type is repurposed to clear filters
    },
  };
  const { icon: Icon, title, message, buttonText, action } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 p-12 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-8 w-8 text-slate-500" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{message}</p>
      <Button color="primary" variant="solid" className="mt-6" onPress={action}>
        {buttonText}
      </Button>
    </motion.div>
  );
};

/* ----------------------------- Main Component ----------------------------- */

export default function CouponRewardsList({ coupons = [] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filteredCoupons = useMemo(() => {
    const q = query.trim().toLowerCase();
    return coupons
      .filter((c) => (typeFilter === "ALL" ? true : c.rewardType === typeFilter))
      .filter((c) => q ? [c.name, c.promoCode].some((v) => v.toLowerCase().includes(q)) : true)
      .sort((a, b) => new Date(b.expiry).getTime() - new Date(a.expiry).getTime());
  }, [coupons, query, typeFilter]);

  return (
  <Card
  radius="lg"
  shadow="md"
  className="relative overflow-hidden border border-default-200/80 bg-gradient-to-br from-content1 to-background p-0"
>
  {/* top ribbon glow */}
  <div className="pointer-events-none absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-70" />

  {/* soft background blobs */}
  <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
  <div className="pointer-events-none absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-warning/10 blur-3xl" />

  <CardHeader className="relative z-10 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
    <ComponentHeader
      query={query}
      setQuery={setQuery}
      typeFilter={typeFilter}
      setTypeFilter={setTypeFilter}
      onNew={onOpen}
    />
  </CardHeader>

  <Divider className="relative z-10" />

  <CardBody className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
    <main>
      <AnimatePresence mode="wait">
        {coupons.length === 0 ? (
          <EmptyState onNew={onOpen} type="NO_REWARDS" />
        ) : filteredCoupons.length === 0 ? (
          <EmptyState
            onNew={() => {
              setQuery("");
              setTypeFilter("ALL");
            }}
            type="NO_RESULTS"
          />
        ) : (
          <motion.ul
            variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } } }}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
          >
            {filteredCoupons.map((coupon) => (
              <RewardCard key={coupon.$id} coupon={coupon} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </main>
  </CardBody>

  {/* Keep your existing popup form (or swap to a NextUI Modal if you prefer) */}
  <PopupForm
    isOpen={isOpen}
    onClose={onClose}
    onSubmit={createRewardCoupon}
    title="Create New Reward"
    description="Design an attractive offer to engage your customers."
  />
</Card>

  );
}