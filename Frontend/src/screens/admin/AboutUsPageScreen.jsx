import { useEffect, useMemo, useState } from "react";
import { PencilLine, Plus, RefreshCcw } from "lucide-react";
import AboutUsPageForm from "../../components/HomePageForm.jsx/AboutUsPageForm/AboutUsPageForm";
import { useGetAboutUsQuery } from "../../services/api";
import Loader from "../../components/loader/Loader";
import toast from "react-hot-toast";

const cardBaseClass =
  "relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6";

function AboutUsPageScreen() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const {
    data,
    error,
    isLoading,
  } = useGetAboutUsQuery();

  const aboutUsData = data?.data || null;
  const hasAboutUsData = Boolean(aboutUsData);
  const mode = hasAboutUsData ? "update" : "create";
  const actionLabel = hasAboutUsData ? "Update About Us" : "Create About Us";
  const ActionIcon = hasAboutUsData ? PencilLine : Plus;

  const heroImages = useMemo(
    () =>
      Array.isArray(aboutUsData?.hero?.images)
        ? aboutUsData.hero.images
            .map((item) => getImageUrl(item))
            .filter(Boolean)
            .slice(0, 3)
        : [],
    [aboutUsData],
  );

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Internal server error");
    }
  }, [error]);

  if (isFormVisible) {
    return (
      <AboutUsPageForm
        mode={mode}
        initialData={aboutUsData}
        onCancel={() => setIsFormVisible(false)}
        onSuccess={() => {
          setIsFormVisible(false);
        }}
      />
    );
  }

  if (!hasAboutUsData) {
    return (
      <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
        <Loader isLoading={isLoading} />
        <div className="rounded-[34px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="mt-3 text-xl font-bold text-slate-900">
                Create your About Us content
              </h1>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                No About Us data found
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsFormVisible(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(2,132,199,0.25)] transition hover:-translate-y-0.5 hover:bg-sky-700"
            >
              <Plus className="h-4 w-4" />
              Create About Us
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
            Admin Preview
          </p>
          <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-xl">
            About Us
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          <button
            type="button"
            onClick={() => setIsFormVisible(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(2,132,199,0.25)] transition hover:-translate-y-0.5 hover:bg-sky-700"
          >
            <ActionIcon className="h-4 w-4" />
            {actionLabel}
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] p-4 sm:p-5">
        <div className="grid gap-5 xl:grid-cols-2">
          <ContentCard heading="Heading & Images" className="xl:col-span-2">
  <div className="space-y-6">
    {/* Content Vertically */}
    <div className="space-y-5">
      <DetailRow
        label="Heading"
        value={aboutUsData.hero?.heading}
        valueClassName="text-2xl"
      />

      <DetailRow
        label="Sub-Heading"
        value={aboutUsData.hero?.subHeading}
        isParagraph
      />

    </div>

    {/* Images Last */}
    <div className="grid gap-3 sm:grid-cols-3">
      {heroImages.map((image, index) => (
        <ImagePreview
          key={`${image}-${index}`}
          src={image}
          alt={`About us hero preview ${index + 1}`}
          className={
            index === 0
              ? "min-h-64 sm:col-span-1"
              : "min-h-40"
          }
        />
      ))}
    </div>
  </div>
</ContentCard>
          <ContentCard heading="Company Overview">
  <div className="space-y-5">
    {/* Content Vertically */}
    <div>
      <DetailRow
        label="Heading"
        value={aboutUsData.companyOverview?.heading}
      />

      <DetailRow
        label="Detail"
        value={aboutUsData.companyOverview?.detail}
        isParagraph
        className="mt-5"
      />
    </div>

    {/* Image Last */}
    <ImagePreview
      src={getImageUrl(aboutUsData.companyOverview?.image)}
      alt="Company overview preview"
      className="min-h-56 h-100"
    />
  </div>
</ContentCard>

          <ContentCard heading="Company Stats">
            <div className="space-y-3">
              {(aboutUsData.companyStats || []).map((item, index) => (
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
            className="xl:col-span-1"
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
      <div className="space-y-5">
        {/* Content Vertically */}
        <div>
          <DetailRow label="Heading" value={section?.heading} />

          <DetailRow
            label="Sub-Heading"
            value={section?.subHeading}
            isParagraph
            className="mt-5"
          />

          <DetailRow
            label="Detail"
            value={section?.detail}
            isParagraph
            className="mt-5"
          />
        </div>

        {/* Image Last */}
        <ImagePreview
          src={getImageUrl(section?.image)}
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
        {value || "Not available"}
      </ValueTag>
    </div>
  );
}

function KeyValueRow({ label, value }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/85 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label || "Key"}
      </p>
      <p className="text-sm font-semibold text-slate-700 sm:text-right">
        {value || "Value"}
      </p>
    </div>
  );
}

function ImagePreview({ src, alt, className = "" }) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-[26px] border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-400 ${className}`.trim()}
      >
        No image available
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-[26px] border border-slate-200 bg-slate-100 shadow-[0_16px_40px_rgba(148,163,184,0.16)] ${className}`.trim()}
    >
      <img src={src} alt={alt} className="h-100 w-full object-fit" />
      
    </div>
  );
}

function PreviewPoint({ title, detail }) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
    </div>
  );
}

function getImageUrl(image) {
  if (typeof image === "string") {
    return image;
  }

  if (typeof image?.url === "string") {
    return image.url;
  }

  return "";
}

export default AboutUsPageScreen;
