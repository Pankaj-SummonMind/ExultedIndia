import { useEffect, useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import { useGetAllCertificatesQuery } from "../../services/api";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";


const collageClasses = [
  "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  "",
  "",
  "lg:col-span-2",
  "",
  "",
];

function ClientsCertificateScreen() {
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const {data:certificates,isLoading,error} = useGetAllCertificatesQuery()

  const certificateItems = useMemo(() => {
    const normalized = normalizeCertificates(certificates);
    return  normalized;
  }, [certificates]);

  useEffect(() => {
    if(error){
      toast.error("Internal Server Error")
    }
  },[error])

  useEffect(() => {
    if (!activeCertificate) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveCertificate(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeCertificate]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8FAFC] text-[#111827]">
      <Loader isLoading={isLoading}/>
      <Helmet>
        <title>Certificates | Exulted India</title>
        <meta name="description" content="Explore Exulted India's certifications and standards that ensure the quality, safety, and reliability of our power products. Learn about our commitment to excellence and customer satisfaction." />
        <meta name="keywords" content="Exulted India, certificates, certifications, quality standards, safety compliance, product testing, customer assurance" />
      </Helmet>

      <CertificateBackground />

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-blue-500 shadow-sm backdrop-blur">
            Exulted India
          </p>
          <h1 className="mt-8 text-2xl font-bold leading-tight text-[#111827] sm:text-2xl lg:text-2xl">
            Certificate
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg">
            Certified Excellence: Our Standards, Your Satisfaction
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[230px] grid-cols-1 gap-5 sm:grid-cols-2 lg:auto-rows-[260px] lg:grid-cols-4">
  {certificateItems.map((certificate, index) => (
    <CertificateCard
      key={certificate.id}
      certificate={certificate}
      index={index}
      onOpen={() => setActiveIndex(index)}
    />
  ))}
</div>

<Lightbox
  open={activeIndex >= 0}
  close={() => setActiveIndex(-1)}
  index={activeIndex}
  slides={certificateItems.map((item) => ({
    src: item.image,
    title: item.title,
  }))}
  plugins={[Zoom]}
  carousel={{ finite: false }}
  zoom={{
    maxZoomPixelRatio: 3,
    doubleTapDelay: 300,
    doubleClickDelay: 300,
  }}
/>
      </section>
    </main>
  );
}

function CertificateCard({ certificate, index, onOpen }) {
  const spanClass = collageClasses[index % collageClasses.length];
  const isLarge = spanClass.includes("row-span-2");

  return (
    <button
      type="button"
      onClick={() => onOpen(certificate)}
      className={[
        "group relative `min-h-57.5 overflow-hidden rounded-[28px] border border-white/80 bg-white text-left shadow-[0_24px_80px_rgba(15,91,191,0.12)] transition duration-500 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_34px_100px_rgba(15,91,191,0.2)] focus:outline-none focus:ring-4 focus:ring-blue-200",
        spanClass,
      ].join(" ")}
      aria-label={`Open ${certificate.title || "certificate"} preview`}
    >
      <img
        src={certificate.image}
        alt={certificate.title || "Certificate"}
        loading={index < 3 ? "eager" : "lazy"}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#111827]/78 via-[#111827]/16 to-transparent opacity-90 transition group-hover:opacity-80" />
      <div className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-2xl border border-white/30 bg-white/20 text-white shadow-xl backdrop-blur-md sm:left-5 sm:top-5">
        <AwardIcon className="h-5 w-5" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">
          Certificate
        </p>
        <h2
          className={[
            "mt-2 font-black leading-tight text-white",
            isLarge ? "text-2xl sm:text-3xl" : "text-xl",
          ].join(" ")}
        >
          {certificate.title || "Certified Standard"}
        </h2>
      </div>
    </button>
  );
}

function CertificateBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(96,165,250,0.2),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(34,197,94,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(248,250,252,1))]" />
      <div className="absolute left-0 top-32 h-px w-full bg-linear-to-r from-transparent via-blue-200 to-transparent" />
      <div className="absolute bottom-20 left-0 h-px w-full bg-linear-to-r from-transparent via-emerald-200 to-transparent" />
    </div>
  );
}

function normalizeCertificates(value) {
  const list = Array.isArray(value?.data)
    ? value.data
    : Array.isArray(value?.certificates)
    ? value.certificates
    : Array.isArray(value)
    ? value
    : [];

  return list
    .map((item, index) => {
      const rawImage =
        item?.image

      const image = rawImage?.url;

      if (!image) return null;

      return {
        id: item?._id,
        title:
          item?.certificate_name,
        image,
      };
    })
    .filter(Boolean);
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

export default ClientsCertificateScreen;
