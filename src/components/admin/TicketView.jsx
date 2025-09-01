"use client";

import { useEffect, useMemo, useState } from "react";
import Empty from "../ui/Empty";
import PopupForm from "./PopupForm";
import { updateQueryReply } from "@/lib/actions";

import {
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Avatar,
  Divider,
  Tooltip,
  Link as NextLink,
  ScrollShadow,
} from "@nextui-org/react";

import {
  EnvelopeIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const TicketView = ({ tickets, bodyColor }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Unread");
  const [selectedQueryId, setSelectedQueryId] = useState("");
  const [oldReply, setOldReply] = useState("");

  // theme token for brand color coming from your prop
  useEffect(() => {
    if (bodyColor) {
      document.documentElement.style.setProperty("--bodyColor", bodyColor);
    }
  }, [bodyColor]);

  const unreadCount = useMemo(
    () => tickets.filter((t) => t.status === "Unread").length,
    [tickets]
  );
  const readCount = useMemo(
    () => tickets.filter((t) => t.status === "Read").length,
    [tickets]
  );

  const filtered = useMemo(
    () => tickets.filter((t) => t.status === activeTab),
    [tickets, activeTab]
  );

  const openReply = (ticket) => {
    setSelectedQueryId(ticket.$id);
    setOldReply(ticket.status === "Read" ? ticket.reply || "" : "");
    setIsPopupOpen(true);
  };

  const initials = (u) => {
    const fn = u?.firstName?.[0] || "";
    const ln = u?.lastName?.[0] || "";
    return (fn + ln || "?").toUpperCase();
  };

  return (
    <Card
      shadow="sm"
      radius="lg"
      className="relative overflow-hidden border border-default-200/80 bg-gradient-to-br from-content1 to-background"
    >
      {/* subtle top glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-70" />
      {/* soft ambient shapes */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-warning/10 blur-3xl" />

      <CardHeader className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-5">
        <div>
          <h3 className="text-2xl font-semibold text-foreground">Customer Support</h3>
          <p className="mt-1 text-sm text-default-600">
            Manage incoming queries and keep conversations tidy.
          </p>
        </div>

        <Tabs
          aria-label="Ticket tabs"
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(String(key))}
          variant="underlined"
          color="primary"
          classNames={{
            tabList: "gap-6",
            cursor: "bg-gradient-to-r from-primary to-primary/80",
          }}
        >
          <Tab
            key="Unread"
            title={
              <div className="flex items-center gap-2">
                <span>Unread</span>
                <Chip size="sm" color="primary" variant="flat">
                  {unreadCount}
                </Chip>
              </div>
            }
          />
          <Tab
            key="Read"
            title={
              <div className="flex items-center gap-2">
                <span>Read</span>
                <Chip size="sm" color="default" variant="flat">
                  {readCount}
                </Chip>
              </div>
            }
          />
        </Tabs>
      </CardHeader>

      <Divider />

      <CardBody className="relative z-10 px-5 pb-6">
        {filtered.length === 0 ? (
          <div className="mt-6 flex items-center justify-center">
            <Empty msg={`No ${activeTab.toLowerCase()} tickets to display.`} />
          </div>
        ) : (
          <ScrollShadow className="max-h-[70vh] pr-1">
            <ul className="grid grid-cols-1 gap-5">
              {filtered.map((ticket) => (
                <li key={ticket.$id}>
                  <Card
                    shadow="sm"
                    radius="lg"
                    className="relative overflow-hidden border border-default-200/70"
                  >
                    {/* accent top border that adapts to --bodyColor */}
                    <div
                      className="absolute inset-x-0 -top-px h-[3px]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, var(--bodyColor), transparent)",
                        opacity: 0.85,
                      }}
                    />
                    <CardHeader className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Avatar
                          radius="md"
                          name={initials(ticket.user)}
                          className="bg-primary/10 text-primary"
                          icon={!ticket.user?.firstName && <UserIcon className="h-5 w-5" />}
                        />
                        <div className="min-w-0">
                          <h4
                            className="text-base font-semibold truncate"
                            title={ticket.subject}
                          >
                            {ticket.subject}
                          </h4>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-small text-default-500">
                            <span>
                              By: {ticket.user.firstName} {ticket.user.lastName}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <EnvelopeIcon className="h-4 w-4" />
                              <NextLink
                                color="primary"
                                href={`mailto:${ticket.user.email}`}
                              >
                                {ticket.user.email}
                              </NextLink>
                            </span>
                          </div>
                        </div>
                      </div>

                      {ticket.status === "Unread" ? (
                        <Tooltip content="Reply to this ticket" placement="left">
                          <Button
                            size="sm"
                            className="font-semibold"
                            startContent={<PaperAirplaneIcon className="h-4 w-4" />}
                            onPress={() => openReply(ticket)}
                            style={{
                              backgroundColor: "var(--bodyColor)",
                              color: "white",
                            }}
                          >
                            Reply
                          </Button>
                        </Tooltip>
                      ) : (
                        <Tooltip content="Edit your previous reply" placement="left">
                          <Button
                            size="sm"
                            variant="flat"
                            startContent={<PencilSquareIcon className="h-4 w-4" />}
                            onPress={() => openReply(ticket)}
                          >
                            Edit Reply
                          </Button>
                        </Tooltip>
                      )}
                    </CardHeader>

                    <CardBody className="pt-0">
                      <p className="text-default-700 leading-relaxed">{ticket.description}</p>

                      {ticket.status === "Read" && (
                        <div className="mt-4 rounded-xl border border-default-200 bg-content1 p-4">
                          <div className="text-small text-default-500 mb-1">Replied</div>
                          <blockquote className="text-default-800 italic">
                            “{ticket.reply}”
                          </blockquote>
                        </div>
                      )}
                    </CardBody>

                    <CardFooter className="justify-between pt-0">
                      <Chip
                        size="sm"
                        color={ticket.status === "Unread" ? "warning" : "success"}
                        variant="flat"
                        className="font-semibold"
                      >
                        {ticket.status}
                      </Chip>
                      {/* Room for extra actions/metadata */}
                      <div />
                    </CardFooter>
                  </Card>
                </li>
              ))}
            </ul>
          </ScrollShadow>
        )}
      </CardBody>

      {/* Popup for reply / edit (your existing component) */}
      {isPopupOpen && (
        <PopupForm
          title="Query Reply"
          textareas={[
            {
              fieldname: "reply",
              placeholder: "Write Reply Here...",
              default: oldReply,
            },
          ]}
          secrets={[{ fieldname: "queryId", value: selectedQueryId }]}
          onSubmit={updateQueryReply}
          onClose={() => {
            setIsPopupOpen(false);
            setSelectedQueryId("");
            setOldReply("");
          }}
        />
      )}
    </Card>
  );
};

export default TicketView;
