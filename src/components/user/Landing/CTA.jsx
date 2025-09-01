import Link from "next/link";

export default function CTA() {
  return (
    <section className="cta" aria-labelledby="updates-cta-heading">
      <div className="container">
        <div className="box">
          <span className="kicker">Product Updates</span>

          <h2 id="updates-cta-heading">Latest Insights &amp; Updates</h2>

          <p className="lead">
            Discover our latest product innovations, AI-powered features, and industry
            insights that drive the future of digital experiences.
          </p>

          <div className="actions">
            <Link href="/updates" legacyBehavior passHref>
              <a className="btn blue" aria-label="Explore all updates">
                <span>Explore All Updates</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ===== Section background (soft gradient with subtle glow) ===== */
        .cta {
          --teal-600: #0f95a0;
          --teal-500: #17a2ac;
          --cyan-600: #0284c7;
          --ink-900: #0f172a;
          --ink-600: #334155;

          /* Blue tokens for the button */
          --blue-600: #2563eb;
          --sky-500: #0ea5e9;

          position: relative;
          overflow: hidden;
          padding: clamp(2.5rem, 6vw, 6rem) 1rem;
          background:
            radial-gradient(60% 70% at 10% -10%, rgba(23, 162, 172, 0.18), transparent 60%),
            radial-gradient(55% 60% at 110% 110%, rgba(2, 132, 199, 0.17), transparent 60%),
            linear-gradient(180deg, #f7fcfe 0%, #eef8fb 100%);
        }

        .cta::before,
        .cta::after {
          content: "";
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.25;
          pointer-events: none;
        }
        .cta::before {
          top: -220px;
          left: -160px;
          background: radial-gradient(
            circle,
            rgba(23, 162, 172, 0.6),
            rgba(23, 162, 172, 0.1) 60%,
            transparent 70%
          );
        }
        .cta::after {
          right: -200px;
          bottom: -220px;
          background: radial-gradient(
            circle,
            rgba(2, 132, 199, 0.5),
            rgba(2, 132, 199, 0.08) 60%,
            transparent 70%
          );
        }

        /* ===== Layout ===== */
        .container {
          max-width: 1120px;
          margin: 0 auto;
        }
        .box {
          position: relative;
          text-align: center;
          background: #ffffff;
          border: 1px solid rgba(2, 132, 199, 0.12);
          border-radius: 16px;
          padding: clamp(1.75rem, 4vw, 3.5rem);
          box-shadow: 0 22px 48px rgba(3, 105, 161, 0.08);
        }

        /* ===== Text ===== */
        .kicker {
          display: inline-block;
          margin-bottom: 0.6rem;
          padding: 0.35rem 0.7rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--teal-600);
          background: rgba(23, 162, 172, 0.12);
          border-radius: 999px;
        }
        h2 {
          margin: 0 0 0.75rem;
          font-weight: 700;
          line-height: 1.2;
          font-size: clamp(1.6rem, 1.2rem + 1.2vw, 2.25rem);
          color: var(--ink-900);
        }
        .lead {
          margin: 0 auto;
          max-width: 65ch;
          line-height: 1.75;
          font-size: clamp(1rem, 0.95rem + 0.2vw, 1.125rem);
          color: var(--ink-600);
        }

        /* ===== Actions / Button ===== */
        .actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1.9rem;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          text-decoration: none;
          font-weight: 700;
          border-radius: 12px;
          padding: 0.95rem 1.35rem;
          transition: transform 0.15s ease, box-shadow 0.25s ease, opacity 0.2s ease;
          will-change: transform, box-shadow;
          outline: none;
        }
        .btn svg {
          transition: transform 0.2s ease;
        }
        .btn:hover svg {
          transform: translateX(3px);
        }

        /* Blue gradient button */
        .btn.blue {
          color: #fff;
          background: linear-gradient(135deg, var(--blue-600), var(--blue-600) 45%, var(--sky-500));
          box-shadow: 0 8px 22px rgba(37, 99, 235, 0.28), 0 2px 0 rgba(0, 0, 0, 0.06);
        }
        .btn.blue:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 32px rgba(14, 165, 233, 0.35), 0 3px 0 rgba(0, 0, 0, 0.05);
        }
        .btn.blue:active {
          transform: translateY(0);
        }
        .btn.blue:focus-visible {
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.45);
        }

        /* ===== Dark mode polish ===== */
        @media (prefers-color-scheme: dark) {
          .cta {
            background:
              radial-gradient(60% 70% at 10% -10%, rgba(23, 162, 172, 0.14), transparent 60%),
              radial-gradient(55% 60% at 110% 110%, rgba(2, 132, 199, 0.12), transparent 60%),
              linear-gradient(180deg, #07171e 0%, #061218 100%);
          }
          .box {
            background: #0b1a21;
            border-color: rgba(125, 211, 252, 0.12);
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
          }
          h2 {
            color: #e2e8f0;
          }
          .lead {
            color: #9aa6b2;
          }
          .kicker {
            background: rgba(23, 162, 172, 0.18);
            color: #67e8f9;
          }
        }

        /* ===== Reduced motion ===== */
        @media (prefers-reduced-motion: reduce) {
          .btn,
          .btn svg {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
