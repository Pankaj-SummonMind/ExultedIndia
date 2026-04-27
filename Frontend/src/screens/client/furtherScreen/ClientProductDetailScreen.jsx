import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductByidQuery } from "../../../services/api";
import { Helmet } from "react-helmet-async";

const fallbackGalleryImages = [
  "https://images.unsplash.com/photo-1581092160607-ee22731d8ca7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
];

function ClientProductDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data, isLoading, error } = useGetProductByidQuery(id);

  const product = data?.data;
  const productImages = useMemo(() => getProductImages(product), [product]);
  const galleryImages = productImages.length
    ? productImages
    : fallbackGalleryImages;
  const features = Array.isArray(product?.features)
    ? product.features.filter(Boolean)
    : [];
  const specifications = Array.isArray(product?.specifications)
    ? product.specifications.filter((item) => item?.key || item?.value)
    : [];

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [id, galleryImages.length]);

  const handlePreviousImage = () => {
    if (galleryImages.length <= 1) return;

    setCurrentImageIndex((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1,
    );
  };

  const handleNextImage = () => {
    if (galleryImages.length <= 1) return;

    setCurrentImageIndex((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1,
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F5F9FF] px-4 py-12 sm:px-6 lg:px-8">
        <StatusPanel
          title="Product detail load nahi ho paayi"
          description={`Backend response check karein ya thodi der baad retry karein.${
            error?.status ? ` Status: ${error.status}` : ""
          }`}
          tone="error"
          actionLabel="Back to products"
          onAction={() => navigate("/products")}
        />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#F5F9FF] px-4 py-12 sm:px-6 lg:px-8">
        <StatusPanel
          title="Product not found"
          description="Requested product detail available nahi hai. Products listing se dobara open karke check karein."
          actionLabel="Back to products"
          onAction={() => navigate("/products")}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#F5F9FF] text-slate-950">
      <Helmet>
        <title>{`${product?.product_name || "Product Detail"} | Exulted India`}</title>
        <meta name="description" content={product?.description || "Explore the detailed specifications, features, and gallery of our premium product at Exulted India. Discover high-quality power solutions with certifications and pan-India service coverage for all your energy needs."} />
        <meta name="keywords" content={`Exulted India, ${product?.product_name || "Product"}, product details, specifications, features, gallery, certifications, pan-India service`} />
      </Helmet>
      <section className="relative isolate overflow-hidden border-b border-blue-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_30%),linear-gradient(135deg,#ffffff_0%,#eff6ff_45%,#f8fafc_100%)]" />
        <div className="absolute -left-24 top-10 h-48 w-48 rounded-full bg-blue-200/25 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute -right-20 top-20 h-44 w-44 rounded-full bg-cyan-200/30 blur-3xl sm:h-64 sm:w-64" />

        {/* <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </button>

          <div className="mt-6 max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-600">
              Product Detail
            </p>
            <h1 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {product?.product_name || "Unnamed Product"}
            </h1>

            <div className="mt-5 flex flex-wrap gap-3">
              <InfoPill icon={<CategoryIcon className="h-4 w-4" />}>
                {product?.product_category?.categories_name || "Uncategorized"}
              </InfoPill>
              <InfoPill icon={<SubCategoryIcon className="h-4 w-4" />}>
                {product?.product_subCategory?.name || "No sub category"}
              </InfoPill>
              <InfoPill icon={<GalleryIcon className="h-4 w-4" />}>
                {productImages.length || 0} Image{productImages.length === 1 ? "" : "s"}
              </InfoPill>
            </div>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              {product?.description ||
                "This product detail screen is ready to showcase core information, gallery previews, and technical highlights in a clean professional layout."}
            </p>
          </div>
        </div> */}
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="rounded-[30px] border border-blue-100 bg-white/90 p-4 shadow-[0_22px_70px_rgba(15,91,191,0.10)] backdrop-blur sm:p-5">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_52%,#f8fafc_100%)]">
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">
                  <span className="rounded-full border border-white/75 bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-slate-500 shadow-sm backdrop-blur">
                    Product Gallery
                  </span>

                  {galleryImages.length > 1 ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePreviousImage}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-700 shadow-sm transition hover:scale-105 hover:bg-white"
                        aria-label="Show previous product image"
                      >
                        <ArrowLeftIcon className="h-5 w-5" />
                      </button>

                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-slate-700 shadow-sm transition hover:scale-105 hover:bg-white"
                        aria-label="Show next product image"
                      >
                        <ArrowRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="flex min-h-75 items-center justify-center p-6 sm:min-h-115 sm:p-8">
                  <img
                    src={galleryImages[currentImageIndex]}
                    alt={product?.product_name || "Product image"}
                    className="max-h-105 w-full rounded-3xl object-contain sm:max-h-130"
                  />
                </div>
              </div>

              {galleryImages.length > 1 ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {galleryImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={[
                        "group overflow-hidden rounded-[22px] border bg-slate-50 transition",
                        currentImageIndex === index
                          ? "border-blue-400 shadow-[0_12px_32px_rgba(59,130,246,0.18)]"
                          : "border-slate-200 hover:border-blue-200",
                      ].join(" ")}
                      aria-label={`Show product image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${product?.product_name || "Product"} ${index + 1}`}
                        className="h-24 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-28"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[30px] border border-blue-100 bg-white px-5 py-6 shadow-[0_22px_70px_rgba(15,91,191,0.10)] sm:px-7 sm:py-8">
            <div className="space-y-7">
              <section className="border-b border-slate-200 pb-6">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">
                  Product Information
                </p>
                <div className="mt-5 space-y-4">
                  <DetailRow
                    label="Product Name"
                    value={product?.product_name || "N/A"}
                  />
                  <DetailRow
                    label="Category"
                    value={product?.product_category?.categories_name || "N/A"}
                  />
                  <DetailRow
                    label="Sub Category"
                    value={product?.product_subCategory?.name || "N/A"}
                  />
                </div>
              </section>

              <ContentSection
                title="Description"
                icon={<InfoIcon className="h-5 w-5" />}
              >
                <p className="text-sm leading-7 text-slate-600 sm:text-base">
                  {product?.description ||
                    "No description available for this product."}
                </p>
              </ContentSection>

              <ContentSection
                title="Features"
                icon={<SparklesIcon className="h-5 w-5" />}
              >
                {features.length ? (
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li
                        key={`${feature}-${index}`}
                        className="flex items-start gap-3 text-sm leading-7 text-slate-700 sm:text-base"
                      >
                        <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <FeatureIcon className="h-4 w-4" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyText label="No features added for this product." />
                )}
              </ContentSection>

              <ContentSection
                title="Specifications"
                icon={<SpecificationIcon className="h-5 w-5" />}
              >
                {specifications.length ? (
                  <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-slate-50/60">
                    {specifications.map((item, index) => (
                      <div
                        key={item?._id || `${item?.key}-${index}`}
                        className={[
                          "grid gap-2 px-4 py-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:px-5",
                          index !== specifications.length - 1
                            ? "border-b border-slate-200"
                            : "",
                        ].join(" ")}
                      >
                        <p className="text-sm font-semibold text-slate-900 sm:text-[15px]">
                          {formatLabel(item?.key) || "N/A"}
                        </p>
                        <p className="text-sm leading-6 text-slate-600 sm:text-[15px]">
                          {item?.value || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyText label="No specifications available for this product." />
                )}
              </ContentSection>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="text-base font-semibold text-slate-900 sm:max-w-[60%] sm:text-right">
        {value}
      </p>
    </div>
  );
}

function ContentSection({ title, icon, children }) {
  return (
    <section className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
          {icon}
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">
            {title}
          </p>
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function InfoPill({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
      <span className="text-blue-600">{icon}</span>
      <span>{children}</span>
    </span>
  );
}

function EmptyText({ label }) {
  return (
    <p className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
      {label}
    </p>
  );
}

function StatusPanel({
  title,
  description,
  tone = "default",
  actionLabel,
  onAction,
}) {
  const isError = tone === "error";

  return (
    <div
      className={[
        "mx-auto max-w-3xl rounded-[28px] border bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,91,191,0.10)]",
        isError ? "border-red-100" : "border-blue-100",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto grid h-14 w-14 place-items-center rounded-2xl",
          isError ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600",
        ].join(" ")}
      >
        {isError ? (
          <AlertIcon className="h-7 w-7" />
        ) : (
          <GalleryIcon className="h-7 w-7" />
        )}
      </div>
      <h1 className="mt-5 text-2xl font-black text-slate-950">{title}</h1>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
        {description}
      </p>

      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-[#F5F9FF]">
      <section className="border-b border-blue-100 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-10 w-28 rounded-full bg-white" />
          <div className="mt-6 h-5 w-40 rounded-full bg-blue-100" />
          <div className="mt-5 h-14 w-full max-w-3xl rounded-[20px] bg-slate-100 sm:h-18" />
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="h-11 w-44 rounded-full bg-white" />
            <div className="h-11 w-52 rounded-full bg-white" />
            <div className="h-11 w-36 rounded-full bg-white" />
          </div>
          <div className="mt-6 space-y-3 max-w-3xl">
            <div className="h-3 w-full rounded-full bg-slate-100" />
            <div className="h-3 w-11/12 rounded-full bg-slate-100" />
            <div className="h-3 w-4/5 rounded-full bg-slate-100" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="rounded-[30px] border border-blue-100 bg-white p-5 shadow-[0_22px_70px_rgba(15,91,191,0.08)]">
            <div className="h-105 animate-pulse rounded-[28px] bg-blue-100" />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-24 rounded-[22px] bg-slate-100" />
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-blue-100 bg-white px-5 py-6 shadow-[0_22px_70px_rgba(15,91,191,0.08)] sm:px-7 sm:py-8">
            <div className="space-y-7 animate-pulse">
              {[1, 2, 3, 4].map((section) => (
                <div
                  key={section}
                  className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-blue-100" />
                    <div className="h-4 w-32 rounded-full bg-slate-100" />
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="h-3 w-full rounded-full bg-slate-100" />
                    <div className="h-3 w-11/12 rounded-full bg-slate-100" />
                    <div className="h-3 w-4/5 rounded-full bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function getProductImages(product) {
  return (product?.images || [])
    .map((item) => {
      if (typeof item === "string") return item;
      return item?.url || item?.path || item?.image || "";
    })
    .filter(Boolean);
}

function formatLabel(value) {
  const label = String(value || "").trim();
  if (!label) return "";

  return label
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
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

function ArrowLeftIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m15 18-6-6 6-6" />
    </IconShell>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m9 18 6-6-6-6" />
    </IconShell>
  );
}

function CategoryIcon({ className }) {
  return (
    <IconShell className={className}>
      <rect x="3" y="4" width="8" height="7" rx="1.5" />
      <rect x="13" y="4" width="8" height="7" rx="1.5" />
      <rect x="3" y="13" width="8" height="7" rx="1.5" />
      <rect x="13" y="13" width="8" height="7" rx="1.5" />
    </IconShell>
  );
}

function SubCategoryIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M4 6h16" />
      <path d="M4 12h10" />
      <path d="M4 18h7" />
      <circle cx="18" cy="12" r="2" />
      <circle cx="15" cy="18" r="2" />
    </IconShell>
  );
}

function InfoIcon({ className }) {
  return (
    <IconShell className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </IconShell>
  );
}

function SparklesIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" />
      <path d="m18 15 .9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9L18 15Z" />
      <path d="m6 15 .9 2.1L9 18l-2.1.9L6 21l-.9-2.1L3 18l2.1-.9L6 15Z" />
    </IconShell>
  );
}

function FeatureIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.2 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </IconShell>
  );
}

function SpecificationIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M7 4h10" />
      <path d="M5 8h14" />
      <path d="M7 12h10" />
      <path d="M5 16h14" />
      <path d="M7 20h10" />
    </IconShell>
  );
}

function GalleryIcon({ className }) {
  return (
    <IconShell className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m21 15-4.5-4.5L10 17" />
      <path d="m3 15 4-4 4 4" />
    </IconShell>
  );
}

function AlertIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z" />
    </IconShell>
  );
}

export default ClientProductDetailScreen;
