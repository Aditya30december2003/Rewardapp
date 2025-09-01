"use client";

import React from "react";
import Link from "next/link";

export default function WhyChoose() {
  return (
    <section id="home-about" className="home-about section about">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-5">
          {/* LEFT: images */}
          <div className="col-lg-5" data-aos="zoom-in" data-aos-delay="200">
            <div className="dual-image-layout">
              <div className="primary-image-wrap">
                <img
                  src="/img2.png"
                  alt="Modern Property"
                  className="img-fluid"
                />
                {/* Flat badge (no box/shadow) */}
                <div className="floating-badge">
                  <div className="badge-content">
                    <i className="bi bi-award" />
                    <span>
                      <span
                        data-purecounter-start="0"
                        data-purecounter-end="15"
                        data-purecounter-duration="1"
                        className="purecounter"
                      />
                      + Years Experience
                    </span>
                  </div>
                </div>
              </div>

              {/* <div className="secondary-image-wrap">
                <img
                  src="/img1.png"
                  alt="Luxury Interior"
                  className="img-fluid"
                />
              </div> */}
            </div>
          </div>

          {/* RIGHT: content */}
          <div className="col-lg-7" data-aos="fade-left" data-aos-delay="300">
            <div className="content">
              <div className="hero-content">
                <span className="section-label">About Our Company</span>
                <h2>Experience Excellence That Drives Success</h2>
                <p className="hero-description">
                  We combine cutting-edge technology with unmatched expertise to deliver solutions that transform your business and exceed expectation.
                </p>
              </div>

              {/* Achievements — flat list */}
              <div className="achievements-list">
                <div className="achievement-item">
                  <div className="achievement-icon">
                    <i className="bi bi-house-door" />
                  </div>
                  <div className="achievement-content">
                    <h4>
                      <span
                        className="purecounter"
                        data-purecounter-start="0"
                        data-purecounter-end="3200"
                        data-purecounter-duration="2"
                      />
                      + Rewards Redeemed

                    </h4>
                    <p>Real perks delivered—no gimmicks.</p>
                  </div>
                </div>

                <div className="achievement-item">
                  <div className="achievement-icon">
                    <i className="bi bi-people" />
                  </div>
                  <div className="achievement-content">
                    <h4>
                      <span
                        className="purecounter"
                        data-purecounter-start="0"
                        data-purecounter-end="98"
                        data-purecounter-duration="1"
                      />
                      % On-time Payouts
                    </h4>
                    <p>Rewards credited fast, every time.</p>
                  </div>
                </div>
              </div>

              {/* CTA — flat buttons */}
              <div className="cta-section">
                <div className="action-buttons">
                  <Link href="/about" className="btn btn-primary">
                    Login Now <i className="bi bi-arrow-right" />
                  </Link>
                  <a href="tel:+15551234567" className="btn btn-secondary">
                    <i className="bi bi-telephone" />
                    Call Now
                  </a>
                </div>

                <div className="contact-info">
                  <div className="contact-icon">
                    <i className="bi bi-telephone" />
                  </div>
                  <div className="contact-details">
                    <span>Call us today</span>
                    <strong>+44(0)20 3723 6703</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /RIGHT */}
        </div>
      </div>

      {/* Minimal overrides to remove ALL shadows/boxes */}
      <style jsx>{`
        /* kill card look */
        .content {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
        }

        /* images: remove any shadows */
        .dual-image-layout .primary-image-wrap,
        .dual-image-layout .secondary-image-wrap {
          box-shadow: none !important;
        }

        /* flat badge */
        .dual-image-layout .floating-badge {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
          top: 12px;
          right: 12px;
        }
        .dual-image-layout .floating-badge .badge-content {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          font-weight: 700;
        }

        /* achievements: no boxes */
        .achievements-list {
          gap: 12px;
        }
        .achievement-item {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .achievement-icon {
          width: auto;
          height: auto;
          border-radius: 0;
          background: transparent !important;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
        }
        .achievement-icon i {
          font-size: 1.2rem;
          color: var(--accent-color, #6366f1);
        }
        .achievement-content h4 {
          margin: 0;
          line-height: 1.25;
        }
        .achievement-content p {
          margin: 4px 0 0;
          color: #64748b; /* slate-500 */
          font-size: 0.95rem;
        }

        /* CTA buttons: remove shadows, keep flat look */
        .cta-section .btn {
          box-shadow: none !important;
        }
        .cta-section .btn.btn-primary {
          background: #6366f1; /* flat indigo */
          color: #fff;
        }
        .cta-section .btn.btn-secondary {
          color: #6366f1;
          border: 1px solid #6366f1;
          background: transparent;
        }

        /* contact info: no background */
        .contact-icon {
          background: transparent !important;
          width: auto;
          height: auto;
        }
      `}</style>
    </section>
  );
}
