import { useEffect, useMemo, useState } from "react";
import { PencilLine, Plus } from "lucide-react";
import ContactUsPageForm from "../../components/HomePageForm.jsx/ContactUsPageForm/ContactUsPageForm";
import { useGetContactsQuery } from "../../services/api";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

const cardBaseClass =
  "relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6";

function ContactPageScreen() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { data, isLoading,error } = useGetContactsQuery();

  useEffect(() => {
    if (error) {
      toast.error("Internal Server Error");
    }
  }, [error]);


  const contactData = data?.data ;
  const hasContactData = Boolean(contactData);
  const mode = hasContactData ? "update" : "create";
  const actionLabel = hasContactData ? "Update Contact" : "Create Contact";
  const ActionIcon = hasContactData ? PencilLine : Plus;

  if (isFormVisible) {
    return (
      <ContactUsPageForm
        mode={mode}
        initialData={contactData}
        onCancel={() => setIsFormVisible(false)}
        onSuccess={() => {
          setIsFormVisible(false);
        }}
      />
    );
  }

  if (!hasContactData) {
    return (
      <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
        <div className="rounded-[34px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-6">
        

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
  
  {/* Left Content */}
  <div className="max-w-3xl">
    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
      Admin Preview
    </p>

    <h1 className="mt-3 text-xl font-bold text-slate-900">
      Create your Contact page content
    </h1>
  </div>

  {/* Right Button */}
  <div className="shrink-0">
      <button
            type="button"
            onClick={() => setIsFormVisible(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(2,132,199,0.25)] transition hover:-translate-y-0.5 hover:bg-sky-700"
          >
            <Plus className="h-4 w-4" />
            Create Contact
          </button>
  </div>

</div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <Loader isLoading={isLoading} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
      Admin Preview
    </p>
    <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-xl">
      Contact Page
    </h1>
  </div>

  <button
    type="button"
    onClick={() => setIsFormVisible(true)}
    className="inline-flex w-max items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(2,132,199,0.25)] transition hover:-translate-y-0.5 hover:bg-sky-700"
  >
    <ActionIcon className="h-4 w-4" />
    {actionLabel}
  </button>
</div>


      <div className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] p-4 sm:p-5">
        <div className="grid gap-5 xl:grid-cols-2">
          <ContentCard heading="Contact Channels" className="xl:col-span-2">
            <div className="grid gap-4 md:grid-cols-3">
              <InfoCard
                label="Phone Number"
                value={contactData?.phoneNumber}
                href={createTelHref(contactData?.phoneNumber)}
              />
              <InfoCard
                label="WhatsApp Number"
                value={contactData?.whatappNumber || contactData?.whatsappNumber}
                href={createWhatsappHref(
                  contactData?.whatappNumber || contactData?.whatsappNumber,
                )}
              />
              <InfoCard
                label="Email"
                value={contactData?.email}
                href={contactData?.email ? `mailto:${contactData.email}` : ""}
              />
            </div>
          </ContentCard>

          <ContentCard heading="Heading & Detail">
            <div className="space-y-5">
              <DetailRow label="Heading" value={contactData?.heading} />
              <DetailRow
                label="Detail"
                value={contactData?.detail}
                isParagraph
                className="mt-5"
              />
            </div>
          </ContentCard>

          <ContentCard heading="Address & Map Location">
            <div className="space-y-5">
              <DetailRow
                label="Address"
                value={contactData?.address}
                isParagraph
              />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Map Location
                </p>
                {contactData?.mapLocation ? (
                  <iframe
            title="Exulted India office location at Vegas Mall, Dwarka Sector 14, New Delhi"
            src={contactData.mapLocation}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full mt-2 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-700"
          />
                ) : (
                  <p className="mt-2 text-base font-semibold leading-7 text-slate-800">
                    Not available
                  </p>
                )}
              </div>
            </div>
          </ContentCard>
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
          Contact Page
        </p>
        <h2 className="mt-2 text-lg font-bold text-slate-900">{heading}</h2>
      </div>

      <div className="mt-5 flex flex-col">{children}</div>
    </article>
  );
}

function InfoCard({ label, value, href }) {
  const content = (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 wrap-break-word text-base font-semibold leading-7 text-slate-800">
        {value || "Not available"}
      </p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className="rounded-3xl border border-slate-200/80 bg-slate-50/90 p-4 transition hover:border-sky-200 hover:bg-sky-50/70"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-slate-50/90 p-4 transition hover:border-sky-200 hover:bg-sky-50/70">
      {content}
    </div>
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
        {value || "Not available"}
      </ValueTag>
    </div>
  );
}

function createTelHref(value) {
  if (!value) {
    return "";
  }

  const cleanedValue = String(value).replace(/[^\d+]/g, "");
  return cleanedValue ? `tel:${cleanedValue}` : "";
}

function createWhatsappHref(value) {
  if (!value) {
    return "";
  }

  const cleanedValue = String(value).replace(/[^\d]/g, "");
  return cleanedValue ? `https://wa.me/${cleanedValue}` : "";
}

function ExternalLinkIcon({ className }) {
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
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

export default ContactPageScreen;
