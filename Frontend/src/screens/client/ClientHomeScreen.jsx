import { useState } from "react";
import { NavLink } from "react-router-dom";

const heroImage =
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1800&q=80";

const productVisuals = [
  {
    title: "Battery",
    text: "High endurance energy storage for homes, solar systems, EV support, and industrial backup.",
    image:
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80",
    Icon: BatteryIcon,
  },
  {
    title: "Inverter",
    text: "Smart sine wave inverters engineered for stable output, low noise, and dependable runtime.",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    Icon: WaveIcon,
  },
  {
    title: "Online UPS",
    text: "Enterprise grade power continuity for offices, hospitals, data rooms, and critical equipment.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    Icon: ServerIcon,
  },
  {
    title: "Gensets / Generator",
    text: "Rugged backup generation solutions tuned for reliability, fuel efficiency, and serviceability.",
    image:
      "https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=800&q=80",
    Icon: EngineIcon,
  },
  {
    title: "Transformers",
    text: "Industrial transformers designed for safe distribution, efficient conversion, and long life.",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    Icon: GridIcon,
  },
];

const stats = [
  { value: "5+ Lakh", label: "Users", delay: "0ms" },
  { value: "5,000", label: "Products", delay: "120ms" },
  { value: "Pan India", label: "Support", delay: "240ms" },
  { value: "Since", label: "2017", delay: "360ms" },
];

const reasons = [
  { title: "In-house R&D", text: "Rapid product development with tight quality control.", Icon: LabIcon },
  { title: "Made in India", text: "Built for Indian grid conditions, climates, and duty cycles.", Icon: FlagIcon },
  { title: "Widest Product Range", text: "Battery, inverter, UPS, gensets, transformers, and accessories.", Icon: LayersIcon },
  { title: "High Performance", text: "Efficient conversion, clean output, and reliable runtime.", Icon: GaugeIcon },
  { title: "Custom Solutions", text: "Application-specific systems for dealers, enterprises, and OEMs.", Icon: ToolIcon },
  { title: "Warranty Support", text: "Responsive service network with practical ownership support.", Icon: ShieldIcon },
];

const cities = [
  { name: "Delhi NCR", x: "50%", y: "28%" },
  { name: "Lucknow", x: "58%", y: "38%" },
  { name: "Patna", x: "70%", y: "44%" },
  { name: "Bhopal", x: "48%", y: "54%" },
  { name: "Ahmedabad", x: "34%", y: "52%" },
  { name: "Hyderabad", x: "55%", y: "70%" },
  { name: "Bengaluru", x: "50%", y: "82%" },
];

const testimonials = [
  {
    name: "Rohit Sharma",
    role: "EV Fleet Partner",
    quote:
      "The charger and backup ecosystem feels premium, stable, and easy to service. Their response time has been excellent.",
  },
  {
    name: "Aarav Electricals",
    role: "Channel Distributor",
    quote:
      "Exaulted India gives us a strong product range under one roof. The finish, packaging, and support make a real difference.",
  },
  {
    name: "Neha Verma",
    role: "Industrial Buyer",
    quote:
      "We wanted custom UPS and transformer support for a facility rollout. The team understood the requirement quickly.",
  },
];

const certificates = [
  { title: "ISO 9001", text: "Quality Management", color: "from-blue-500 to-cyan-400" },
  { title: "CE Certified", text: "Safety Compliance", color: "from-emerald-500 to-teal-400" },
  { title: "MSME", text: "Made in India", color: "from-slate-700 to-blue-500" },
  { title: "RoHS", text: "Eco Standards", color: "from-green-500 to-lime-400" },
];

const quickLinks = ["Products", "About", "Certificates", "Contact"];

function ClientHomeScreen() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [previewCertificate, setPreviewCertificate] = useState(null);

  return (
    <div className="relative overflow-hidden bg-[#F8FAFC] text-[#111827]">
      <SeoBlock />
      <LocalAnimationStyles />
      <LoadingScreen />

      <FloatingParticles />
      <HeroSection />
      <ProductDetail />
      <StatsSection />
      <ProductShowcase />
      <WhyChooseUs />
      <CoverageSection />
      <Testimonials
        activeIndex={activeTestimonial}
        onChange={setActiveTestimonial}
      />
      <CertificatesSection onPreview={setPreviewCertificate} />
      <CtaBanner />
      {/* <Footer /> */}

      {previewCertificate ? (
        <CertificatePreview
          certificate={previewCertificate}
          onClose={() => setPreviewCertificate(null)}
        />
      ) : null}
    </div>
  );
}

function SeoBlock() {
  return (
    <>
      <h1 className="sr-only">
        Exaulted India battery inverter transformer online UPS gensets and EV charger
        manufacturing company
      </h1>
      <p className="sr-only">
        Premium power systems, EV chargers, batteries, inverters, online UPS,
        generators, transformers, service coverage, certificates, and inquiry form.
      </p>
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-slate-950">
      <img
        src={heroImage}
        alt="EV charging station with modern electric mobility infrastructure"
        className="absolute inset-0 h-full w-full object-cover opacity-52 motion-safe:animate-[heroZoom_18s_ease-in-out_infinite_alternate]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,24,39,0.88),rgba(17,24,39,0.56),rgba(37,99,235,0.14)),radial-gradient(circle_at_72%_30%,rgba(34,197,94,0.24),transparent_30%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <div className="max-w-3xl motion-safe:animate-[slideUp_700ms_ease-out_both]">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100 shadow-2xl backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.9)]" />
            Exaulted India Since 2017
          </p>

          <h2 className="mt-7 max-w-3xl text-4xl font-black leading-[1.03] text-white sm:text-5xl lg:text-6xl">
            Powering The Future of Energy
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Best Quality On Battery & Inverters and many more product
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Premium manufacturing for batteries, inverters, transformers, online
            UPS, gensService reach across high-demand power and EV mobility corridors.ets, and charger ecosystems built for modern India.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <NavLink
              to="/products"
              className="rounded-full bg-blue-400 px-6 py-3 text-center text-sm font-bold text-white shadow-[0_18px_45px_rgba(96,165,250,0.35)] transition hover:-translate-y-1 hover:bg-blue-500"
            >
              Explore Products
            </NavLink>
            <NavLink
              to="/contact"
              className="rounded-full border border-white/25 bg-white/10 px-6 py-3 text-center text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-400/15"
            >
              Contact Us
            </NavLink>
          </div>
        </div>

        {/* <div className="relative mx-auto w-full max-w-lg motion-safe:animate-[floatIn_900ms_ease-out_180ms_both]">
          <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-blue-400/28 via-emerald-300/20 to-transparent blur-3xl" />
          <div className="relative rounded-[32px] border border-white/20 bg-white/12 p-4 shadow-[0_35px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="rounded-[26px] bg-white p-5">
              <div className="relative overflow-hidden rounded-[22px] bg-[#111827] p-5 text-white">
                <div className="absolute right-5 top-5 h-28 w-28 rounded-full bg-blue-400/20 blur-2xl" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
                      DC Fast Charger
                    </p>
                    <h3 className="mt-2 text-2xl font-black">EVC Prime 60</h3>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-400 text-white">
                    <BoltIcon className="h-6 w-6" />
                  </div>
                </div>

                <div className="relative mt-7 grid grid-cols-[0.72fr_1fr] gap-5">
                  <div className="h-72 rounded-[24px] border border-white/10 bg-gradient-to-b from-slate-800 to-slate-950 p-4 shadow-2xl motion-safe:animate-[softFloat_4s_ease-in-out_infinite]">
                    <div className="h-11 rounded-xl bg-blue-400/90" />
                    <div className="mt-5 h-28 rounded-2xl border border-emerald-300/30 bg-white/8 p-3">
                      <div className="h-2 w-16 rounded-full bg-emerald-300" />
                      <div className="mt-3 h-2 w-24 rounded-full bg-white/25" />
                      <div className="mt-2 h-2 w-20 rounded-full bg-white/18" />
                    </div>
                    <div className="mx-auto mt-8 h-20 w-10 rounded-t-full border-x-4 border-t-4 border-blue-300/60" />
                  </div>

                  <div className="space-y-3 self-center">
                    <HeroMetric label="Output" value="60 kW" />
                    <HeroMetric label="Efficiency" value="96%" />
                    <HeroMetric label="Protection" value="IP54" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}

function ProductDetail() {
  return (
    <section className="relative min-h-[calc(100vh-72px)] overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-center">
        
        {/* LEFT IMAGE */}
        <div className="relative z-10 shrink-0 lg:-mr-20">
          <div className="h-137.5 w-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <img
              src="https://images.pexels.com/photos/15110872/pexels-photo-15110872.jpeg"
              alt="Product Side"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* CENTER MAIN UI (UNCHANGED) */}
        <div className="relative z-10 w-full max-w-lg motion-safe:animate-[floatIn_900ms_ease-out_180ms_both]">
          <div className="absolute -inset-6 rounded-full bg-linear-to-br from-blue-400/28 via-emerald-300/20 to-transparent blur-3xl" />

          <div className="relative rounded-4xl border border-white/20 bg-white/12 p-4 shadow-[0_35px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <div className="rounded-[26px] bg-white p-5">
              <div className="relative overflow-hidden rounded-[22px] bg-[#111827] p-5 text-white">
                <div className="absolute right-5 top-5 h-28 w-28 rounded-full bg-blue-400/20 blur-2xl" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    {/* <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
                      DC Fast Charger
                    </p> */}
                    <h3 className="mt-2 text-2xl font-black">
                      Your Power Partner for Tomorrow
                    </h3>
                  </div>

                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-400 text-white">
                    <BoltIcon className="h-6 w-6" />
                  </div>
                </div>

                <div className="relative mt-7 grid grid-cols-[0.72fr_1fr] gap-5">
                  <div className="h-72 rounded-3xl border border-white/10 bg-linear-to-b from-slate-800 to-slate-950 p-4 shadow-2xl motion-safe:animate-[softFloat_4s_ease-in-out_infinite]">
                    <div className="h-11 rounded-xl bg-blue-400/90" />

                    <div className="mt-5 h-28 rounded-2xl border border-emerald-300/30 bg-white/8 p-3">
                      <div className="h-2 w-16 rounded-full bg-emerald-300" />
                      <div className="mt-3 h-2 w-24 rounded-full bg-white/25" />
                      <div className="mt-2 h-2 w-20 rounded-full bg-white/18" />
                    </div>

                    <div className="mx-auto mt-8 h-20 w-10 rounded-t-full border-x-4 border-t-4 border-blue-300/60" />
                  </div>

                  <div className="space-y-3 self-center">
                    <HeroMetric label="Cost Effective" value="96%" />
                    <HeroMetric label="Efficiency " value="98%" />
                    <HeroMetric label="Protection" value="IP54" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT BUTTON */}
        <div className="relative z-20 shrink-0">
          <button className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-blue-700 hover:scale-105">
            More About Us
          </button>
        </div>
      </div>
    </section>
  );
}

function HeroMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function StatsSection() {
  return (
    <SectionShell className="-mt-10">
      <div className="relative z-10 grid gap-4 rounded-[28px] border border-white/80 bg-white/80 p-4 shadow-[0_24px_80px_rgba(15,91,191,0.14)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={`${item.value}-${item.label}`}
            className="rounded-2xl border border-blue-100 bg-white/85 p-5 motion-safe:animate-[revealUp_700ms_ease-out_both]"
            style={{ animationDelay: item.delay }}
          >
            <p className="text-2xl font-black text-[#111827] sm:text-3xl">{item.value}</p>
            <p className="mt-2 text-sm font-semibold text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function ProductShowcase() {
  return (
    <SectionShell
      eyebrow="Product Showcase"
      title="Power hardware for homes, enterprises, fleets, and industrial sites."
      action={<NavLinkButton to="/products" label="Explore Range" />}
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {productVisuals.map((product, index) => (
          <article
            key={product.title}
            className="group overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-[0_18px_55px_rgba(15,91,191,0.08)] transition duration-500 hover:-translate-y-2 hover:border-blue-300 hover:shadow-[0_28px_90px_rgba(15,91,191,0.18)]"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image}
                alt={`${product.title} product by Exaulted India`}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#111827]/74 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-xl bg-white/90 text-blue-500 shadow-lg backdrop-blur">
                <product.Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-black text-[#111827]">{product.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{product.text}</p>
              <NavLink
                to="/products"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 transition group-hover:bg-blue-400 group-hover:text-white"
              >
                Learn More
                <ArrowUpRightIcon className="h-4 w-4" />
              </NavLink>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function WhyChooseUs() {
  return (
    <section className="bg-white">
      <SectionShell
        eyebrow="Exulted India"
        title="Why choose us ."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((item) => (
            <article
              key={item.title}
              className="group rounded-3xl border border-blue-100 bg-linear-to-br from-white to-blue-50/45 p-6 shadow-[0_18px_55px_rgba(15,91,191,0.08)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_24px_70px_rgba(16,185,129,0.12)]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-400 text-white shadow-lg shadow-blue-400/25 transition group-hover:bg-emerald-400">
                <item.Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-black text-[#111827]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}

function CoverageSection() {
  return (
    <SectionShell
      eyebrow="Pan India Coverage"
      title="Service reach across high-demand power and EV mobility corridors."
    >
      <div className="grid gap-8 rounded-[30px] border border-blue-100 bg-white/80 p-5 shadow-[0_24px_80px_rgba(15,91,191,0.1)] backdrop-blur-xl lg:grid-cols-[0.92fr_1.08fr] lg:p-8">
        
        {/* LEFT CONTENT */}
        <div className="self-center">
          <p className="text-sm leading-7 text-slate-600">
            Our support coverage is designed for dealers, enterprise customers,
            infrastructure partners, and field deployments that need fast response
            across key Indian regions.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {cities.map((city) => (
              <span
                key={city.name}
                className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700"
              >
                {city.name}
              </span>
            ))}
          </div>
        </div>

        {/* INDIA MAP */}
        <div className="relative mx-auto w-full max-w-md">
          <div className="relative">

            {/* INDIA IMAGE */}
            <img
              src="https://www.dronepwr.com/wp-content/uploads/India-Map-Location-Drone-Power.svg"
              alt="India Map"
              className="w-full object-contain"
            />

            {/* CITY POINTERS */}
            {cities.map((city) => (
              <button
                key={city.name}
                type="button"
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: city.x,
                  top: city.y,
                }}
              >
                {/* Ping Effect */}
                <span className="absolute inset-0 h-5 w-5 rounded-full bg-emerald-400/40 animate-ping" />

                {/* Dot */}
                <span className="relative block h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-lg" />

                {/* Tooltip */}
                <span className="pointer-events-none absolute left-1/2 top-6 z-10 w-max -translate-x-1/2 rounded-full bg-[#111827] px-3 py-1 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
                  {city.name}
                </span>
              </button>
            ))}

          </div>
        </div>

      </div>
    </SectionShell>
  );
}

function Testimonials({ activeIndex, onChange }) {
  const active = testimonials[activeIndex];

  return (
    <section className="bg-[#111827]">
      <SectionShell
        eyebrow="Customer Review"
        title="Trusted by customers who need power systems that simply keep working."
        dark
      >
        <div className="rounded-[30px] border border-white/10 bg-white/8 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <p className="text-5xl font-black text-blue-300">“</p>
              <p className="mt-2 text-lg leading-8 text-white sm:text-xl">{active.quote}</p>
              <div className="mt-6">
                <p className="font-black text-white">{active.name}</p>
                <p className="text-sm font-semibold text-blue-200">{active.role}</p>
              </div>
            </div>
            <div className="grid gap-3">
              {testimonials.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onChange(index)}
                  className={[
                    "rounded-2xl border p-4 text-left transition",
                    activeIndex === index
                      ? "border-blue-300 bg-blue-400/20 text-white"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-emerald-300/60 hover:bg-white/10",
                  ].join(" ")}
                >
                  <span className="block text-sm font-black">{item.name}</span>
                  <span className="mt-1 block text-xs font-semibold opacity-80">{item.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>
    </section>
  );
}

function CertificatesSection({ onPreview }) {
  return (
    <SectionShell
      eyebrow="Certificates"
      title="Quality, safety, and compliance presented with confidence."
      action={<NavLinkButton to="/certificates" label="All Certificates" />}
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {certificates.map((certificate) => (
          <button
            key={certificate.title}
            type="button"
            onClick={() => onPreview(certificate)}
            className="group overflow-hidden rounded-3xl border border-blue-100 bg-white text-left shadow-[0_18px_55px_rgba(15,91,191,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,91,191,0.15)]"
          >
            <div className={`h-36 bg-linear-to-br ${certificate.color} p-5 text-white`}>
              <AwardIcon className="h-10 w-10" />
              <p className="mt-8 text-xl font-black">{certificate.title}</p>
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold text-slate-600">{certificate.text}</p>
              <p className="mt-4 text-sm font-bold text-blue-600 transition group-hover:text-emerald-600">
                Preview Certificate
              </p>
            </div>
          </button>
        ))}
      </div>
    </SectionShell>
  );
}

function CertificatePreview({ certificate, onClose }) {
  return (
    <div className="fixed inset-0 z-80 grid place-items-center bg-[#111827]/70 px-4 backdrop-blur-md">
      <button
        type="button"
        aria-label="Close certificate preview"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-[30px] border border-white/30 bg-white p-5 shadow-[0_35px_120px_rgba(0,0,0,0.35)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
          aria-label="Close"
        >
          <XIcon className="h-5 w-5" />
        </button>
        <div className={`rounded-3xl bg-linear-to-br ${certificate.color} p-8 text-white`}>
          <AwardIcon className="h-14 w-14" />
          <p className="mt-20 text-3xl font-black">{certificate.title}</p>
          <p className="mt-2 text-sm font-semibold text-white/80">{certificate.text}</p>
        </div>
      </div>
    </div>
  );
}

function CtaBanner() {
  return (
    <SectionShell>
      <div className="relative overflow-hidden rounded-4xl bg-[#111827] p-8 text-white shadow-[0_28px_100px_rgba(17,24,39,0.22)] sm:p-10 lg:p-12">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-400/24 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">
              Partner with us
            </p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Join the EV Revolution Today
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Build with a manufacturing partner that understands power reliability,
              premium product presentation, and long-term support.
            </p>
          </div>
          <NavLink
            to="/contact"
            className="w-fit rounded-full bg-blue-400 px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-1 hover:bg-blue-500"
          >
            Start Inquiry
          </NavLink>
        </div>
      </div>
    </SectionShell>
  );
}

// function Footer() {
//   return (
//     <footer className="border-t border-blue-100 bg-white">
//       <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.62fr_1fr] lg:px-8">
//         <div>
//           <div className="flex items-center gap-3">
//             <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-400 text-white shadow-lg shadow-blue-400/25">
//               <BoltIcon className="h-6 w-6" />
//             </div>
//             <div>
//               <p className="text-lg font-black text-[#111827]">Exaulted India</p>
//               <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-500">
//                 Future Power Systems
//               </p>
//             </div>
//           </div>
//           <p className="mt-5 max-w-sm text-sm leading-6 text-slate-600">
//             Battery, inverter, transformer, online UPS, gensets, and EV charger
//             manufacturing with Pan India support.
//           </p>
//           <div className="mt-5 flex gap-3">
//             {["in", "f", "x"].map((item) => (
//               <a
//                 key={item}
//                 href="/"
//                 className="grid h-10 w-10 place-items-center rounded-full border border-blue-100 text-sm font-black text-blue-600 transition hover:bg-blue-400 hover:text-white"
//                 aria-label={`Social link ${item}`}
//               >
//                 {item}
//               </a>
//             ))}
//           </div>
//         </div>

//         <div>
//           <p className="text-sm font-black uppercase tracking-[0.18em] text-[#111827]">
//             Quick Links
//           </p>
//           <div className="mt-5 grid gap-3">
//             {quickLinks.map((item) => (
//               <NavLink
//                 key={item}
//                 to={`/${item.toLowerCase() === "products" ? "products" : item.toLowerCase()}`}
//                 className="text-sm font-semibold text-slate-600 transition hover:text-blue-600"
//               >
//                 {item}
//               </NavLink>
//             ))}
//           </div>
//           <div className="mt-7 space-y-2 text-sm text-slate-600">
//             <p>
//               <span className="font-bold text-[#111827]">Phone:</span> +91 98765 43210
//             </p>
//             <p>
//               <span className="font-bold text-[#111827]">Email:</span> info@exaultedindia.com
//             </p>
//             <p>
//               <span className="font-bold text-[#111827]">Support:</span> Pan India
//             </p>
//           </div>
//         </div>

//         <InquiryForm />
//       </div>
//       <div className="border-t border-blue-100 px-4 py-5 text-center text-xs font-semibold text-slate-500">
//         © 2026 Exaulted India. All rights reserved.
//       </div>
//     </footer>
//   );
// }

function InquiryForm() {
  return (
    <form className="rounded-[26px] border border-blue-100 bg-[#F8FAFC] p-5 shadow-[0_18px_55px_rgba(15,91,191,0.08)]">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#111827]">
        Inquiry Form
      </p>
      <div className="mt-5 grid gap-3">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          className="h-12 rounded-2xl border border-blue-100 bg-white px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone number"
          className="h-12 rounded-2xl border border-blue-100 bg-white px-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        />
        <textarea
          name="message"
          placeholder="Tell us what you need"
          rows="4"
          className="resize-none rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        />
        <button
          type="button"
          className="rounded-2xl bg-blue-400 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-400/25 transition hover:-translate-y-0.5 hover:bg-blue-500"
        >
          Send Inquiry
        </button>
      </div>
    </form>
  );
}

function SectionShell({ eyebrow, title, action, children, className = "", dark = false }) {
  return (
    <section className={["relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8", className].join(" ")}>
      {eyebrow || title || action ? (
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            {eyebrow ? (
              <p className={["text-xs font-black uppercase tracking-[0.24em]", dark ? "text-emerald-300" : "text-blue-500"].join(" ")}>
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className={["mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-4xl", dark ? "text-white" : "text-[#111827]"].join(" ")}>
                {title}
              </h2>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

function NavLinkButton({ to, label }) {
  return (
    <NavLink
      to={to}
      className="w-fit rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-black text-blue-600 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-50"
    >
      {label}
    </NavLink>
  );
}

function FloatingParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {[12, 28, 44, 62, 78].map((left, index) => (
        <span
          key={left}
          className="absolute h-2 w-2 rounded-full bg-blue-300/35 motion-safe:animate-[particleRise_9s_linear_infinite]"
          style={{
            left: `${left}%`,
            bottom: "-20px",
            animationDelay: `${index * 1.35}s`,
          }}
        />
      ))}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="pointer-events-none fixed inset-0 z-90 grid place-items-center bg-white motion-safe:animate-[loaderFade_1200ms_ease_900ms_both]">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-400 text-white shadow-xl shadow-blue-400/25 motion-safe:animate-[softPulse_900ms_ease-in-out_infinite]">
          <BoltIcon className="h-7 w-7" />
        </div>
        <p className="mt-4 text-xs font-black uppercase tracking-[0.28em] text-blue-500">
          Exaulted India
        </p>
      </div>
    </div>
  );
}

function LocalAnimationStyles() {
  return (
    <style>
      {`
        @keyframes loaderFade {
          0%, 72% { opacity: 1; visibility: visible; }
          100% { opacity: 0; visibility: hidden; }
        }
        @keyframes heroZoom {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(34px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes softFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes softPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes particleRise {
          from { transform: translateY(0); opacity: 0; }
          15% { opacity: 1; }
          to { transform: translateY(-110vh); opacity: 0; }
        }
      `}
    </style>
  );
}

function IconShell({ className, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function BoltIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m13 2-9 12h7l-1 8 10-13h-7l0-7Z" />
    </IconShell>
  );
}

function BatteryIcon({ className }) {
  return (
    <IconShell className={className}>
      <rect x="3" y="7" width="16" height="10" rx="2" />
      <path d="M21 11v2" />
      <path d="M7 11h4" />
    </IconShell>
  );
}

function WaveIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M3 12c2.5-5 5.5-5 8 0s5.5 5 10 0" />
      <path d="M3 18h18" />
      <path d="M3 6h18" />
    </IconShell>
  );
}

function GridIcon({ className }) {
  return (
    <IconShell className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </IconShell>
  );
}

function ServerIcon({ className }) {
  return (
    <IconShell className={className}>
      <rect x="4" y="3" width="16" height="7" rx="2" />
      <rect x="4" y="14" width="16" height="7" rx="2" />
      <path d="M8 7h.01" />
      <path d="M8 18h.01" />
      <path d="M12 7h4" />
      <path d="M12 18h4" />
    </IconShell>
  );
}

function EngineIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M4 14h3l2-4h6l2 4h3" />
      <path d="M5 14v5h14v-5" />
      <path d="M9 10V6h6v4" />
      <path d="M10 6V3h4v3" />
    </IconShell>
  );
}

function LabIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M10 2v6l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V2" />
      <path d="M8 2h8" />
      <path d="M7 16h10" />
    </IconShell>
  );
}

function FlagIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M5 21V4" />
      <path d="M5 4h13l-2 5 2 5H5" />
    </IconShell>
  );
}

function LayersIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
      <path d="m3 18 9 5 9-5" />
    </IconShell>
  );
}

function GaugeIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M20 13a8 8 0 1 0-16 0" />
      <path d="m12 13 4-4" />
      <path d="M6.5 17h11" />
    </IconShell>
  );
}

function ToolIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.4 2.4-3-3 2.4-2.4Z" />
    </IconShell>
  );
}

function ShieldIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </IconShell>
  );
}

function ArrowUpRightIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </IconShell>
  );
}

function AwardIcon({ className }) {
  return (
    <IconShell className={className}>
      <circle cx="12" cy="8" r="5" />
      <path d="m8.5 12.5-1.5 8 5-3 5 3-1.5-8" />
    </IconShell>
  );
}

function XIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </IconShell>
  );
}

export default ClientHomeScreen;
