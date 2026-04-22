import { useState } from "react";
import { PencilLine } from "lucide-react";
import HeroCardForm from "../../components/HomePageForm.jsx/HeroCardForm";

const INITIAL_HERO_CARD = {
  id: "hero-card",
  title: "Powering the Future of Energy",
  subHeading: "Reliable power systems for homes, businesses, and mobility.",
  description:
    "Exulted India delivers dependable battery, inverter, UPS, transformer, and energy solutions with a strong focus on quality, service, and long-term performance.",
  image:
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1800&q=80",
};

const heroDetailCard = {
  title: "Built for performance, scale, and support",
  stats: [
    { key: "Established", value: "2017" },
    { key: "Product Range", value: "Battery, Inverter, UPS, Gensets, Transformer" },
    { key: "Service Reach", value: "Pan India support network" },
    { key: "Core Focus", value: "Quality manufacturing and practical support" },
  ],
  image:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
};

const categoryCard = {
  title: "Explore our major product segments",
  categories: [
    "Battery",
    "Inverter",
    "Online UPS",
    "Gensets / Generator",
    "Transformers",
    "EV Charger",
  ],
};

const whyChooseUsCard = {
  title: "Reasons that make our brand dependable",
  points: [
    {
      label: "In-house development",
      detail:
        "Products are designed with practical performance goals and strong quality checks.",
    },
    {
      label: "Made for Indian conditions",
      detail:
        "Solutions are aligned with Indian grid patterns, climate, and day-to-day usage needs.",
    },
    {
      label: "Wide product range",
      detail:
        "From battery systems to UPS and transformers, customers can manage multiple needs under one brand.",
    },
    {
      label: "Responsive support",
      detail:
        "Our team focuses on fast communication, installation guidance, and after-sales assistance.",
    },
  ],
};

const locationsCard = {
  title: "Growing service and dealer presence",
  detail:
    "We are expanding across key markets to support faster delivery, smoother coordination, and stronger customer service.",
  locations: [
    "Delhi NCR",
    "Lucknow",
    "Patna",
    "Bhopal",
    "Ahmedabad",
    "Hyderabad",
    "Bengaluru",
  ],
};

const testimonialCard = {
  title: "What our partners say",
  name: "Rohit Sharma",
  role: "EV Fleet Partner",
  message:
    "The product quality feels premium and the support team is practical, responsive, and easy to work with during deployments.",
};

const joinUsCard = {
  title: "Join our growing network",
  detail:
    "Partner with Exulted India to build stronger reach in batteries, inverters, UPS, transformers, and future-ready power solutions.",
};

const cardBaseClass =
  "relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6";

function HomePageScreen() {
  const [heroCard, setHeroCard] = useState(INITIAL_HERO_CARD);
  const [isHeroCardFormOpen, setIsHeroCardFormOpen] = useState(false);
  const [activeHeroCard, setActiveHeroCard] = useState(null);

  const openHeroCardEdit = () => {
    setActiveHeroCard(heroCard);
    setIsHeroCardFormOpen(true);
  };

  const closeHeroCardForm = () => {
    setIsHeroCardFormOpen(false);
    setActiveHeroCard(null);
  };

  const handleHeroCardSubmit = async (payload, values) => {
    console.log("Submitting hero card with data:");

    for (const [key, value] of payload.entries()) {
      console.log(key, value);
    }

    setHeroCard((prev) => ({
      id: values.id || prev.id || "hero-card",
      title: values.title,
      subHeading: values.subHeading,
      description: values.description,
      image: values.image ? values.previewUrl : prev.image,
    }));
  };

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <div className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] p-4 sm:p-5">
        <div className="grid gap-5 xl:grid-cols-2">
          <ContentCard
            heading="Hero Card"
            className="xl:col-span-2"
            bodyClassName="gap-6"
            onActionClick={openHeroCardEdit}
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:items-start">
              <div className="space-y-5">
                <DetailRow label="Title" value={heroCard.title} valueClassName="text-2xl" />
                <DetailRow label="Sub-Heading" value={heroCard.subHeading} />
                <DetailRow label="Description" value={heroCard.description} isParagraph />
              </div>

              <ImagePreview
                src={heroCard.image}
                alt="Hero section preview"
                className="h-full min-h-72"
              />
            </div>
          </ContentCard>

          <ContentCard heading="Hero Detail">
            <DetailRow label="Title" value={heroDetailCard.title} />

            <div className="mt-5 space-y-3">
              {heroDetailCard.stats.map((item) => (
                <KeyValueRow key={item.key} label={item.key} value={item.value} />
              ))}
            </div>

            <ImagePreview
              src={heroDetailCard.image}
              alt="Hero detail preview"
              className="mt-5 min-h-64"
            />
          </ContentCard>

          <ContentCard heading="Category">
            <DetailRow label="Title" value={categoryCard.title} />

            <div className="mt-5 flex flex-wrap gap-3">
              {categoryCard.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  {category}
                </span>
              ))}
            </div>
          </ContentCard>

          <ContentCard heading="Why Choose Us" className="xl:col-span-2">
            <DetailRow label="Title" value={whyChooseUsCard.title} />

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {whyChooseUsCard.points.map((point) => (
                <div
                  key={point.label}
                  className="border-t border-slate-200/80 pt-4 first:border-t-0 first:pt-0 md:first:border-t md:first:pt-4"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
                    {point.label}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {point.detail}
                  </p>
                </div>
              ))}
            </div>
          </ContentCard>

          <ContentCard heading="Our Locations">
            <DetailRow label="Title" value={locationsCard.title} />
            <DetailRow
              label="Detail"
              value={locationsCard.detail}
              isParagraph
              className="mt-5"
            />

            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {locationsCard.locations.map((location) => (
                <li
                  key={location}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  {location}
                </li>
              ))}
            </ul>
          </ContentCard>

          <ContentCard heading="Testimonial">
            <DetailRow label="Title" value={testimonialCard.title} />
            <DetailRow label="User / Employee Name" value={testimonialCard.name} className="mt-5" />
            <DetailRow label="Designation / Role" value={testimonialCard.role} className="mt-5" />
            <DetailRow
              label="Message"
              value={testimonialCard.message}
              isParagraph
              className="mt-5"
            />
          </ContentCard>

          <ContentCard heading="Join Us" className="xl:col-span-2">
            <DetailRow label="Title" value={joinUsCard.title} />
            <DetailRow
              label="Detail"
              value={joinUsCard.detail}
              isParagraph
              className="mt-5"
            />
          </ContentCard>
        </div>
      </div>

      <HeroCardForm
        isOpen={isHeroCardFormOpen}
        onClose={closeHeroCardForm}
        activeHeroCard={activeHeroCard}
        onSubmit={handleHeroCardSubmit}
      />
    </section>
  );
}

function ContentCard({
  heading,
  children,
  className = "",
  bodyClassName = "",
  onActionClick,
}) {
  return (
    <article className={`${cardBaseClass} ${className}`.trim()}>
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white to-transparent" />

      <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-600">
            Home Page
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">{heading}</h2>
        </div>

        <button
          type="button"
          onClick={onActionClick}
          disabled={!onActionClick}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700"
        >
          <PencilLine className="h-4 w-4" />
          Edit
        </button>
      </div>

      <div className={`mt-5 flex flex-col ${bodyClassName}`.trim()}>{children}</div>
    </article>
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
      <p className="text-sm font-semibold text-slate-700 sm:text-right">{value}</p>
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

export default HomePageScreen;
