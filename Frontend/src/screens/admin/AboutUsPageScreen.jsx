import { useMemo, useState } from "react";
import { PencilLine, Plus } from "lucide-react";

const INITIAL_ABOUT_US_DATA = {
  hero: {
    heading: "About Exulted India",
    subHeading:
      "A trusted power solutions company focused on dependable products, practical service, and long-term customer confidence.",
    images: [
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  companyOverview: {
    heading: "Company Overview",
    detail:
      "Exulted India works across batteries, inverters, UPS systems, generators, transformers, EV charging, and allied power products. The company is built around consistent quality, reliable delivery, and responsive support for residential, commercial, and industrial customers.",
  },
  companyStats: [
    { key: "Established", value: "2017" },
    { key: "Product Categories", value: "Battery, UPS, Inverter, EV Charger" },
    { key: "Service Focus", value: "Installation, support, and maintenance" },
    { key: "Market Reach", value: "Growing Pan India network" },
  ],
  mission: {
    heading: "Our Mission",
    subHeading: "Deliver reliable energy solutions for everyday India.",
    detail:
      "Our mission is to make dependable power products accessible through strong engineering, honest guidance, and customer-first service that continues after every purchase.",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
  },
  research: {
    heading: "Research & Development",
    subHeading: "Focused on better performance, safety, and usability.",
    detail:
      "We study changing customer needs, Indian usage conditions, and new energy technologies to keep improving product efficiency, durability, and service readiness.",
    image:
      "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=1200&q=80",
  },
  vision: {
    heading: "Our Vision",
    subHeading: "Build a stronger and more future-ready power ecosystem.",
    detail:
      "Our vision is to become a preferred Indian power solutions brand known for quality, innovation, and reliable support across traditional and future energy needs.",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
  },
};

const cardBaseClass =
  "relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6";

function AboutUsPageScreen() {
  const [aboutUsData] = useState(INITIAL_ABOUT_US_DATA);

  const hasAboutUsData = Boolean(aboutUsData);
  const actionLabel = hasAboutUsData ? "Update About Us" : "Create About Us";
  const ActionIcon = hasAboutUsData ? PencilLine : Plus;

  const heroImages = useMemo(
    () => aboutUsData?.hero?.images?.slice(0, 3) || [],
    [aboutUsData],
  );

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">
            Admin Page Content
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            About Us Page
          </h1>
        </div>

        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(2,132,199,0.25)] transition hover:-translate-y-0.5 hover:bg-sky-700 sm:w-auto"
        >
          <ActionIcon className="h-4 w-4" />
          {actionLabel}
        </button>
      </div>

      <div className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] p-4 sm:p-5">
        <div className="grid gap-5 xl:grid-cols-2">
          <ContentCard heading="Heading & Images" className="xl:col-span-2">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)] lg:items-start">
              <div className="space-y-5">
                <DetailRow
                  label="Heading"
                  value={aboutUsData.hero.heading}
                  valueClassName="text-2xl"
                />
                <DetailRow
                  label="Sub-Heading"
                  value={aboutUsData.hero.subHeading}
                  isParagraph
                />
                <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/60 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
                    Image Input
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                    Multiple images supported for future integration. Maximum
                    upload limit: 3 images.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-h-80">
                {heroImages.map((image, index) => (
                  <ImagePreview
                    key={`${image}-${index}`}
                    src={image}
                    alt={`About us hero preview ${index + 1}`}
                    className={
                      index === 0
                        ? "min-h-64 sm:col-span-2 lg:col-span-2"
                        : "min-h-40"
                    }
                  />
                ))}
              </div>
            </div>
          </ContentCard>

          <ContentCard heading="Company Overview">
            <DetailRow
              label="Heading"
              value={aboutUsData.companyOverview.heading}
            />
            <DetailRow
              label="Detail"
              value={aboutUsData.companyOverview.detail}
              isParagraph
              className="mt-5"
            />
          </ContentCard>

          <ContentCard heading="Company Stats">
            <div className="space-y-3">
              {aboutUsData.companyStats.map((item, index) => (
                <KeyValueRow
                  key={`${item.key}-${index}`}
                  label={item.key}
                  value={item.value}
                />
              ))}
            </div>
          </ContentCard>

          <SectionWithImage title="Mission" section={aboutUsData.mission} />

          <SectionWithImage title="Research" section={aboutUsData.research} />

          <SectionWithImage
            title="Vision"
            section={aboutUsData.vision}
            className="xl:col-span-2"
            imageClassName="min-h-80"
          />
        </div>
      </div>
    </section>
  );
}

function ContentCard({ heading, children, className = "" }) {
  return (
    <article className={`${cardBaseClass} ${className}`.trim()}>
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white to-transparent" />

      <div className="border-b border-slate-200/80 pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-600">
          About Us Page
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">{heading}</h2>
      </div>

      <div className="mt-5 flex flex-col">{children}</div>
    </article>
  );
}

function SectionWithImage({
  title,
  section,
  className = "",
  imageClassName = "min-h-64",
}) {
  return (
    <ContentCard heading={title} className={className}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.85fr)] lg:items-start">
        <div>
          <DetailRow label="Heading" value={section.heading} />
          <DetailRow
            label="Sub-Heading"
            value={section.subHeading}
            isParagraph
            className="mt-5"
          />
          <DetailRow
            label="Detail"
            value={section.detail}
            isParagraph
            className="mt-5"
          />
        </div>

        <ImagePreview
          src={section.image}
          alt={`${title} preview`}
          className={imageClassName}
        />
      </div>
    </ContentCard>
  );
}

function DetailRow({
  label,
  value,
  className = "",
  valueClassName = "",
  isParagraph = false,
}) {
  const ValueTag = isParagraph ? "p" : "div";

  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>
      <ValueTag
        className={`mt-2 text-base font-semibold leading-7 text-slate-800 ${valueClassName}`.trim()}
      >
        {value}
      </ValueTag>
    </div>
  );
}

function KeyValueRow({ label, value }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/85 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-700 sm:text-right">
        {value}
      </p>
    </div>
  );
}

function ImagePreview({ src, alt, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-[26px] border border-slate-200 bg-slate-100 shadow-[0_16px_40px_rgba(148,163,184,0.16)] ${className}`.trim()}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

export default AboutUsPageScreen;
