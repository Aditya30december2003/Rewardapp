import { createAdminClient } from "@/appwrite/config";
import GenerateApiKey from "@/components/admin/GenerateApiKey";
import auth from "@/lib/auth";
import { fetchApikey } from "@/lib/data";
import { redirect } from "next/navigation";

/* --- Inline SVG icon tiles (patterned) --- */
function KeyPattern() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <pattern id="dotsA" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="1.3" cy="1.3" r="1.3" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="24" height="24" fill="url(#dotsA)" opacity="0.25" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 12h2.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H17M7 12H4.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5H7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 17v2.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V17M12 7V4.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function LinkPattern() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <pattern id="dotsB" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="1.3" cy="1.3" r="1.3" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="24" height="24" fill="url(#dotsB)" opacity="0.25" />
      <path d="M10 13a5 5 0 0 0 7.54.46l3-3a5 5 0 0 0-7.07-7.07L11.75 5.18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 11a5 5 0 0 0-7.54.46l-3 3a5 5 0 0 0 7.07 7.07l1.7-1.71" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ErrorState({ message }) {
  return (
    <section className="relative space-y-6">
      <header>
        <h1 className="text-xl md:text-2xl font-semibold text-foreground">API & Integrations</h1>
        <p className="mt-1 text-sm text-red-500">
          {message}
        </p>
      </header>
      
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm text-red-600 dark:text-red-400">
          Unable to load API configuration. Please contact support or check your account setup.
        </p>
      </div>
    </section>
  );
}

export default async function GetApiKey() {
  try {
    // Get user first
    const user = await auth.getUser();
    if (!user) {
      redirect("/login");
    }

    // Get API key
    const keyvalue = await fetchApikey();

    const { users, databases } = await createAdminClient();
    
    // Get user preferences with error handling
    const prefs = await users.getPrefs(user.$id);
    
    // Check if dbId exists
    if (!prefs.dbId) {
      console.error("User preferences missing dbId:", prefs);
      return <ErrorState message="Account configuration incomplete. Please contact support." />;
    }

    // Get subscriber data with error handling
    let data;
    try {
      data = await databases.getDocument(
        process.env.NEXT_PUBLIC_SUBSCRIPTION_DATABASE_ID,
        process.env.NEXT_PUBLIC_SUBSCRIBERS_COLLECTION_ID,
        prefs.dbId
      );
    } catch (error) {
      console.error("Error fetching subscriber document:", error);
      return <ErrorState message="Unable to load account data." />;
    }

    // Build referral link
    const refLink = `${process.env.NEXT_PUBLIC_DOMAIN?.replace(/\/$/, "")}/register/${prefs.dbId}/${data.company || 'default'}`;

    const rows = [
      {
        id: "api",
        name: "API Key",
        desc: "Authenticate server requests",
        iconBg: "bg-primary/10 text-primary",
        Icon: KeyPattern,
        value: keyvalue,
        title: "API Key",
      },
      {
        id: "ref",
        name: "Referral Link",
        desc: "Invite users under your org",
        iconBg: "bg-secondary/10 text-secondary",
        Icon: LinkPattern,
        value: refLink,
        title: "Referral Link",
      },
    ];

    return (
      <section className="relative space-y-6">
        {/* Ambient shapes (subtle) */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />

        {/* Heading */}
        <header>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">API & Integrations</h1>
          <p className="mt-1 text-sm text-default-600">
            Manage your API key and referral link. Copy, reveal, and open links right from here.
          </p>
        </header>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-default-200/70 bg-white dark:bg-default-900/40">
          <table className="min-w-full border-separate border-spacing-y-0">
            <thead>
              <tr className="text-left">
                <th className="w-14 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-default-600">
                  {/* icon col */}
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-default-600">
                  Resource
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-default-600">
                  Value
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map(({ id, name, desc, iconBg, Icon, value, title }) => (
                <tr
                  key={id}
                  className="group border-t border-default-200/60 first:border-t-0 hover:bg-default-50/50 dark:border-default-800/60 dark:hover:bg-default-800/30"
                >
                  {/* Icon */}
                  <td className="px-4 py-4 align-top">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-black/5 ${iconBg}`}>
                      <Icon />
                    </div>
                  </td>

                  {/* Label / Desc */}
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{name}</span>
                      <span className="text-xs text-default-500">{desc}</span>
                    </div>
                  </td>

                  {/* Value (compact GenerateApiKey) */}
                  <td className="px-4 py-4 align-top">
                    <div className="max-w-[720px]">
                      <GenerateApiKey
                        compact
                        bodyColor={data.bodyColor}
                        title={title}
                        apiKey={value}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Unexpected error in GetApiKey:", error);
    return <ErrorState message="An unexpected error occurred." />;
  }
}