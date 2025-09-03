export const revalidate = 0;

import { createAdminClient } from "@/lib/server/appwrite";
import RegisterForm from "@/components/auth/Register";
import Footer from "@/components/Footer";

// Server Component
export default async function InvitedRegisterPage({ params }) {
  const { adminId, companyName } = params;

  if (!adminId || !companyName) return <InvalidCustomerPage />;

  try {
    const { databases } = await createAdminClient();

    // Look up the subscriber/config doc
    const doc = await databases.getDocument(
      process.env.NEXT_PUBLIC_SUBSCRIPTION_DATABASE_ID,
      process.env.NEXT_PUBLIC_SUBSCRIBERS_COLLECTION_ID,
      adminId
    );

    const matched =
      doc?.db_id === adminId &&
      (doc?.company || "").toLowerCase() === companyName.toLowerCase();

    if (!matched) return <InvalidCustomerPage />;

    // Build branding asset URLs
    const bucketId = process.env.NEXT_PUBLIC_LOGOS_STORAGE_ID;
    const appwriteUrl = process.env.NEXT_PUBLIC_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

    const logo =
      doc.logoId
        ? `${appwriteUrl}/storage/buckets/${bucketId}/files/${doc.logoId}/view?project=${projectId}&mode=admin`
        : "/logowhite.png";

    const bg =
      doc.backgroundImageId
        ? `${appwriteUrl}/storage/buckets/${bucketId}/files/${doc.backgroundImageId}/view?project=${projectId}&mode=admin`
        : "/bg.webp";

    const gradientFrom = doc.bodyColor || "#7C4DFF";
    const gradientTo   = doc.accentColor || "#5EC8FF";

    return (
      <main className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
        <div className="absolute inset-0">
          <div
            className="h-full w-full rounded-bl-[50px] opacity-75"
            style={{ backgroundImage: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})` }}
          />
        </div>

        <header className="relative z-10 flex h-20 items-center justify-center md:justify-start p-6 px-8">
          <img src={logo} alt="Brand" className="h-12 object-contain" />
        </header>

        <section className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 px-6 pb-12 md:grid-cols-2 md:pt-2">
          <div className="hidden md:flex items-center">
            <div className="rounded-2xl bg-white/20 p-6 text-white backdrop-blur-md shadow-xl">
              <h2 className="text-3xl font-bold">Join {doc.company}</h2>
              <p className="mt-2 opacity-90">
                Create your account to access the {doc.company} Perktify workspace.
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-2xl border border-white/20 bg-white/85 p-6 shadow-xl backdrop-blur-md">
              <h3 className="mb-1 text-2xl font-semibold text-gray-900">Create account</h3>
              <p className="mb-4 text-sm text-gray-600">
                Already registered? <a href="/login" className="font-semibold text-indigo-600 hover:underline">Sign in</a>
              </p>

              <RegisterForm
                invite={{ adminId, companyName }}
                redirectTo="/admin/overview"
              />
            </div>
          </div>
        </section>

        {!doc.PremiumUser && <Footer />}
      </main>
    );
  } catch (err) {
    console.error("Invite lookup failed:", err?.message);
    return <InvalidCustomerPage />;
  }
}

function InvalidCustomerPage() {
  return (
    <>
      <main className="relative flex min-h-screen flex-col bg-[url('/bg.webp')] bg-cover bg-center">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-gradient-to-b from-indigo-600 to-emerald-500 rounded-bl-[50px] opacity-75"></div>
        </div>

        <div className="relative z-10 flex h-20 items-center justify-center md:justify-start p-6 px-8">
          <img src="/logowhite.png" alt="Perktify" className="h-12 object-contain" />
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center px-4 text-center">
          <div className="bg-white/80 backdrop-blur-md px-8 py-10 rounded-2xl shadow-lg max-w-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Invalid Customer Id or Company
            </h2>
            <p className="text-gray-600">
              Please check your link or contact support if the issue persists.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
