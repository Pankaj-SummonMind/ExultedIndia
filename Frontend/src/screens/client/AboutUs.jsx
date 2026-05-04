import { Helmet } from "react-helmet-async";
import { useGetAboutUsQuery } from "../../services/api";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

const overviewStats = [
  {Icon: UsersIcon },
  {Icon: MapIcon },
  {Icon: FactoryIcon },
  {Icon: HeartIcon },
];


function AboutUs() {
   const { data,isLoading,error } = useGetAboutUsQuery();
   const AboutUsData = data?.data;
   const missionData = AboutUsData?.mission;
   const researchData = AboutUsData?.research;
    const visionData = AboutUsData?.vision;

    useEffect(() => {
      if(error){
        toast.error("Internal Server Error.")
      }
    },[error])
  return (
    <main className="relative overflow-hidden bg-[#F8FAFC] text-[#111827]">
      <Loader isLoading={isLoading} />
      <Helmet>
        <title>About Us | Exulted India</title>
        <meta name="description" content="Learn about Exulted India's mission, vision, and commitment to sustainable energy solutions. Discover our journey, values, and dedication to providing high-quality power products for a greener future." />
        <meta name="keywords" content="Exulted India, about us, mission, vision, sustainable energy, power products, company values, green future" />
      </Helmet>
      
      <LocalStyles />
      <FloatingParticles />
      <HeroAbout AboutUsData={AboutUsData}/>
      <CompanyOverview AboutUsData={AboutUsData}/>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:px-8">
          <SplitInfoSection AboutUsData={missionData} eyebrow="Mission" Icon={LeafIcon}/>
          <SplitInfoSection AboutUsData={researchData} eyebrow="Our Research" Icon={LabIcon}/>
          <SplitInfoSection AboutUsData={visionData} eyebrow="Vision" Icon={EyeIcon}/>
      </section>
    </main>
  );
}

function HeroAbout({AboutUsData}) {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(96,165,250,0.18),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(34,197,94,0.12),transparent_30%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="motion-safe:animate-[fadeUp_700ms_ease-out_both]">
          <p className="inline-flex rounded-full border border-blue-200 bg-white/75 px-3 py-2 text-xs font-bold uppercase tracking-[0.26em] text-blue-500 shadow-sm backdrop-blur">
            About Us
          </p>
          <h1 className="mt-6 max-w-3xl text-3xl font-black leading-tight text-[#111827] sm:text-3xl lg:text-3xl">
            {AboutUsData?.hero?.heading}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            {AboutUsData?.hero?.subHeading}
          </p>
          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            {AboutUsData?.companyStats.map((item, index) => index < 3 && (
              <GlassStat key={item.key} item={item} delay={index * 120} />
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl motion-safe:animate-[floatIn_900ms_ease-out_160ms_both]">
          <div className="absolute -inset-8 rounded-full bg-blue-400/12 blur-3xl" />
          <div className="relative grid gap-4 sm:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-4 sm:pt-14">
              <ImageTile
                src={AboutUsData?.hero?.images[0].url}
                alt="Exulted India factory and manufacturing facility"
                className="h-52"
              />
              <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-[0_22px_70px_rgba(15,91,191,0.12)] backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
                  Quality Core
                </p>
                <p className="mt-2 text-lg font-bold text-[#111827]">Energy + Power</p>
              </div>
            </div>

            <div className="space-y-4">
              <ImageTile
                src={AboutUsData?.hero?.images[1].url}
                alt="Company employee working on advanced power product"
                className="h-64"
              />
              <div className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-[#111827] p-5 text-white shadow-[0_28px_90px_rgba(17,24,39,0.24)]">
                <div className="absolute right-4 top-4 h-24 w-24 rounded-full bg-blue-400/24 blur-2xl" />
                <div className="relative flex items-center gap-4">
                  <img
                    src={AboutUsData?.hero?.images[2].url}
                    alt="Floating EV charger product"
                    className="h-24 w-24 rounded-2xl object-cover shadow-xl motion-safe:animate-[softFloat_4s_ease-in-out_infinite]"
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                      Energy Systems
                    </p>
                    <p className="mt-2 text-lg font-bold">Built for scale</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompanyOverview({ AboutUsData }) {
  return (
    <section className="relative bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="relative">
          <div className="absolute -left-4 -top-4 h-32 w-32 rounded-full bg-emerald-300/20 blur-2xl" />
          <ImageTile
            src={AboutUsData?.companyOverview?.image.url}
            alt="Modern factory and production team"
            className="relative h-107.5"
          />
        </div>

        <div className="self-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-500">
            Company Overview
          </p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-[#111827] sm:text-2xl">
            {AboutUsData?.companyOverview?.heading}
          </h2>
          <p className=" text-base leading-8 text-slate-600">
            {AboutUsData?.companyOverview?.detail}
          </p>


          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {AboutUsData?.companyStats.map((stat, index) => {
    const StatIcon =
      overviewStats[index]?.Icon || Users;

    return (
      <OverviewStat
        key={stat.key}
        stat={stat}
        delay={index * 120}
        Icon={StatIcon}
      />
    );
  })}
          </div>
        </div>
      </div>
    </section>
  );
}

function SplitInfoSection({ AboutUsData, eyebrow,Icon }) {
  return (
    <section className="grid items-start gap-5 lg:grid-cols-[1fr_0.95fr] lg:gap-6">
      {/* Image Card */}
      <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
        <div className="relative h-62.5 sm:h-80 lg:h-80">
          <img
            src={AboutUsData?.image?.url}
            alt={eyebrow}
            loading="lazy"
            className="h-full w-full object-cover"
          />

        </div>
      </div>

      {/* Content Card */}
      <div className="rounded-[26px] border border-slate-200 bg-[#F8F8F8] px-5 py-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:px-7 sm:py-8 lg:px-8 lg:py-9">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400  text-white shadow-lg shadow-blue-400/25 transition hover:bg-blue-400">
                  <Icon className="h-6 w-6" />
                </div> 
        </div>

        {AboutUsData?.heading && (
          <p className="mt-5 text-base font-bold uppercase tracking-[0.22em] text-sky-600">
            {AboutUsData?.heading}
          </p>
        )}

        {AboutUsData?.subHeading && (
          <h3 className="mt-2 text-base font-bold leading-7 text-slate-900">
            {AboutUsData?.subHeading}
          </h3>
        )}

        <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-[15px]">
          {AboutUsData?.detail}
        </p>
      </div>
    </section>
  );
}

function GlassStat({ item, delay }) {
  return (
    <div
      className="rounded-2xl border border-white/70 bg-white/72 p-4 shadow-[0_18px_60px_rgba(15,91,191,0.1)] backdrop-blur-xl motion-safe:animate-[fadeUp_700ms_ease-out_both]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-lg font-black text-[#111827]">{item.value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {item.key}
      </p>
    </div>
  );
}

function  OverviewStat({ stat, delay, Icon }) {

  return (
    <div
      className="group rounded-3xl border border-blue-100 bg-white/82 p-5 shadow-[0_18px_55px_rgba(15,91,191,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_24px_70px_rgba(16,185,129,0.12)] motion-safe:animate-[fadeUp_700ms_ease-out_both]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-500 transition group-hover:bg-blue-400 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-lg font-black text-[#111827]">{stat.value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{stat.key}</p>
    </div>
  );
}

function ImageTile({ src, alt, className = "" }) {
  return (
    <div
      className={[
        "overflow-hidden rounded-[28px] border border-blue-100 bg-blue-50 shadow-[0_24px_80px_rgba(15,91,191,0.12)]",
        className,
      ].join(" ")}
    >
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {[14, 30, 47, 66, 84].map((left, index) => (
        <span
          key={left}
          className="absolute h-2 w-2 rounded-full bg-blue-300/35 motion-safe:animate-[particleRise_10s_linear_infinite]"
          style={{ left: `${left}%`, bottom: "-20px", animationDelay: `${index * 1.4}s` }}
        />
      ))}
    </div>
  );
}

function LocalStyles() {
  return (
    <style>
      {`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes softFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
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

function UsersIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="3" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 4.13a4 4 0 0 1 0 5.74" />
    </IconShell>
  );
}

function MapIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </IconShell>
  );
}

function FactoryIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M3 21V9l6 4V9l6 4V5h6v16H3Z" />
      <path d="M7 17h2" />
      <path d="M12 17h2" />
      <path d="M17 17h2" />
    </IconShell>
  );
}

function HeartIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </IconShell>
  );
}

function LeafIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M5 21c8-2 13-8 14-18-8 1-15 6-16 14" />
      <path d="M9 15c2 0 5-2 7-6" />
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

function EyeIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </IconShell>
  );
}

export default AboutUs;
