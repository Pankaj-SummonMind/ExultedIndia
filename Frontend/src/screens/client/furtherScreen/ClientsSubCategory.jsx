import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductByidQuery, useGetProductQuery } from "../../../services/api";

const subCategoryDescription =
  "The Exulted Tubular battery is a robust and reliable energy storage solution designed to deliver exceptional performance in various applications. This battery utilizes advanced tubular technology, ensuring superior resilience and longer life compared to conventional batteries. Its unique design incorporates tubular positive plates, which enhance the battery's efficiency and charge retention capabilities. With excellent deep-cycling capabilities, the Exulted Tubular battery is an ideal choice for backup power systems, renewable energy storage, and UPS applications. Its dependable performance and low maintenance requirements make it a trusted option for both residential and industrial use, providing uninterrupted power supply and peace of mind.";

const fallbackImages = [
  "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=900&q=80",
];

function ClientsSubCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: allProduct, isLoading, error } = useGetProductQuery();
  console.log("data",allProduct)

  const products = useMemo(() => {
    const rows = Array.isArray(allProduct?.data)
      ? allProduct.data
      : Array.isArray(allProduct)
        ? allProduct
        : [];

    return rows.filter((product) => product?.product_subCategory?._id === id);
  }, [allProduct, id]);

  const subCategoryName =
    products[0]?.product_subCategory?.name || "Selected Sub Category";
  const categoryName = products[0]?.product_category?.categories_name || "Products";

  if (isLoading) return <SubCategoryLoading />;

  if (error) {
    return (
      <main className="bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
        <StateCard
          title="Products load nahi ho paaye"
          description={`Backend response check karein ya thodi der baad retry karein.${
            error?.status ? ` Status: ${error.status}` : ""
          }`}
          tone="error"
        />
      </main>
    );
  }

  return (
    <main className="overflow-hidden bg-[#F8FAFC] text-slate-950">
      <section className="relative border-b border-blue-100 bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(219,234,254,0.78),rgba(255,255,255,0.92)_45%,rgba(240,253,244,0.76))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-blue-600 shadow-sm backdrop-blur">
              {categoryName}
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {subCategoryName}
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base lg:text-lg lg:leading-8">
              {subCategoryDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <MetricPill icon={<GridIcon className="h-4 w-4" />}>
                {products.length} Product{products.length === 1 ? "" : "s"}
              </MetricPill>
              <MetricPill icon={<BoltIcon className="h-4 w-4" />}>
                Reliable Power Range
              </MetricPill>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">
              Related Products
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              Explore {subCategoryName}
            </h2>
          </div>
        </div>

        {products.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                index={index}
                onOpen={() => navigate(`/products/product/${product._id}`)}
              />
            ))}
          </div>
        ) : (
          <StateCard
            title="No products found"
            description="Is sub category ke products backend me add hote hi yahan cards automatic show honge."
          />
        )}
      </section>
    </main>
  );
}

function ProductCard({ product, index, onOpen }) {
  const image = getProductImage(product, index);
  const title = product?.product_name || "Product";
  const description =
    product?.description ||
    "Premium Exulted India product designed for dependable power performance and long service life.";

  return (
    <article className="group flex h-[430px] flex-col overflow-hidden rounded-[22px] border border-blue-100 bg-white shadow-[0_18px_55px_rgba(15,91,191,0.10)] transition duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-[0_28px_85px_rgba(15,91,191,0.18)]">
      <button
        type="button"
        onClick={onOpen}
        className="relative h-[58%] w-full overflow-hidden bg-blue-50 text-left"
        aria-label={`View ${title}`}
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.48))]" />
        <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/85 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-700 shadow-sm backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </span>
      </button>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-2 min-h-12 text-lg font-black leading-6 text-slate-950">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          View More
          <ArrowUpRightIcon className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function SubCategoryLoading() {
  return (
    <main className="bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-4xl animate-pulse">
          <div className="h-9 w-52 rounded-full bg-blue-100" />
          <div className="mt-6 h-14 w-4/5 rounded-2xl bg-slate-100" />
          <div className="mt-6 space-y-3">
            <div className="h-3 w-full rounded-full bg-slate-100" />
            <div className="h-3 w-11/12 rounded-full bg-slate-100" />
            <div className="h-3 w-3/4 rounded-full bg-slate-100" />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[430px] animate-pulse rounded-[22px] border border-blue-100 bg-white shadow-[0_18px_55px_rgba(15,91,191,0.08)]"
            >
              <div className="h-[58%] rounded-t-[22px] bg-blue-100" />
              <div className="p-4">
                <div className="h-5 w-2/3 rounded-full bg-slate-100" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full rounded-full bg-slate-100" />
                  <div className="h-3 w-5/6 rounded-full bg-slate-100" />
                  <div className="h-3 w-2/3 rounded-full bg-slate-100" />
                </div>
                <div className="mt-6 h-11 rounded-full bg-blue-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function StateCard({ title, description, tone = "default" }) {
  const isError = tone === "error";

  return (
    <div
      className={[
        "mx-auto max-w-4xl rounded-[28px] border bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,91,191,0.10)]",
        isError ? "border-red-100" : "border-blue-100",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto grid h-14 w-14 place-items-center rounded-2xl",
          isError ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-600",
        ].join(" ")}
      >
        {isError ? <AlertIcon className="h-7 w-7" /> : <GridIcon className="h-7 w-7" />}
      </div>
      <h2 className="mt-5 text-2xl font-black text-slate-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function MetricPill({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/82 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur">
      <span className="text-blue-600">{icon}</span>
      {children}
    </span>
  );
}

function getProductImage(product, index) {
  return getProductImages(product)[0] || fallbackImages[index % fallbackImages.length];
}

function getProductImages(product) {
  return (product?.images || [])
    .map((item) => {
      if (typeof item === "string") return item;
      return item?.url || item?.path || item?.image || "";
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

function BoltIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m13 2-9 12h7l-1 8 10-13h-7l0-7Z" />
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

function AlertIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z" />
    </IconShell>
  );
}

export default ClientsSubCategory;
