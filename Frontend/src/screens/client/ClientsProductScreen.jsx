import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useGetCategoriesQuery } from "../../services/api";

const categoryImages = [
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=1200&q=80",
];

const categoryCopy = {
  battery:
    "High endurance energy storage built for dependable backup, renewable integration, and long operating life across demanding power environments.",
  inverter:
    "Smart conversion systems designed for clean output, low-noise performance, intelligent charging, and reliable operation during voltage fluctuation.",
  transformer:
    "Industrial-grade transformer solutions focused on safe distribution, efficient conversion, thermal stability, and long-term durability.",
  ups: "Online UPS systems engineered for zero-interruption continuity across offices, medical environments, IT rooms, and critical infrastructure.",
  genset:
    "Rugged power generation solutions tuned for consistent backup, efficient operation, field serviceability, and business continuity.",
  generator:
    "Reliable generator platforms for industrial, commercial, and residential backup with strong service support and robust build quality.",
  accessories:
    "Premium electrical accessories and supporting components that complete a dependable, integrated power ecosystem.",
};

function ClientsProductScreen() {
  const { data, isLoading, isError, error } = useGetCategoriesQuery();

  const categories = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  console.log("Fetched categories:", categories);

  return (
    <main className="relative overflow-hidden bg-[#F8FAFC] text-[#111827]">
      <BackgroundDecor />

      {/* <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-blue-500 shadow-sm backdrop-blur">
            Product Categories
          </p>
          <h1 className="mt-5 text-4xl font-black leading-tight text-[#111827] sm:text-5xl">
            Engineered power solutions for modern India.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Explore Exaulted India's premium range of batteries, inverters,
            transformers, online UPS, gensets, and power ecosystem products.
          </p>
        </div>
      </section> */}

      <section className="relative mx-auto max-w-7xl px-4 mt-4 pb-18 sm:px-6 lg:px-8">
        {isLoading ? <CategorySkeletons /> : null}

        {!isLoading && isError ? <ErrorState error={error} /> : null}

        {!isLoading && !isError && categories.length === 0 ? (
          <EmptyState />
        ) : null}

        {!isLoading && !isError && categories.length > 0 ? (
          <div className="grid gap-8 lg:gap-10">
            {categories.map((category, index) => (
              <CategoryPanel
                key={category._id || category.categories_name}
                category={category}
                index={index}
              />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

function CategoryPanel({ category, index }) {
  const imageOnLeft = index % 2 === 0;
  const title = category.categories_name;
  const subCategories = Array.isArray(category.subCategories)
    ? category.subCategories
    : [];
  const description = category.categories_description;

  return (
    <article className="group relative overflow-hidden rounded-4xl border border-blue-100 bg-white shadow-[0_24px_90px_rgba(15,91,191,0.1)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_34px_110px_rgba(15,91,191,0.16)]">
      <div
        className={[
          "absolute inset-0 opacity-95",
          imageOnLeft
            ? "bg-[linear-gradient(90deg,rgba(255,255,255,0.06),rgba(17,24,39,0.96)_50%,rgba(17,24,39,1))]"
            : "bg-[linear-gradient(90deg,rgba(17,24,39,1),rgba(17,24,39,0.96)_50%,rgba(255,255,255,0.06))]",
        ].join(" ")}
      />

      <div
        className={[
          "relative grid h-130 lg:grid-cols-2",
          imageOnLeft ? "" : "lg:[&_.category-image]:order-2",
        ].join(" ")}
      >
        {/* IMAGE */}
        <div className="category-image relative h-full overflow-hidden bg-blue-50">
          <img
            src={category.image.url}
            alt={`${title} category by Exaulted India`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>

        {/* CONTENT */}
        <div className="relative flex h-full items-center bg-[#111827] p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(96,165,250,0.24),transparent_32%),radial-gradient(circle_at_20%_82%,rgba(34,197,94,0.18),transparent_28%)]" />

          <div className="relative flex h-full max-w-xl flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-400 text-white shadow-lg shadow-blue-400/25">
                <BoltIcon className="h-6 w-6" />
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl">
              {title}
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base line-clamp-6">
              {description}
            </p>

            {subCategories.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {subCategories.slice(0, 5).map((subCategory) => (
                  <NavLink
                    key={subCategory._id || subCategory.name}
                    to={`/products/subcategory/${subCategory._id}`}
                    className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-xs font-bold text-slate-200 backdrop-blur transition hover:border-blue-300 hover:bg-blue-400/20 hover:text-white"
                  >
                    {subCategory.name}
                  </NavLink>
                ))}

                {subCategories.length > 5 ? (
                  <span className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-xs font-bold text-slate-300">
                    +{subCategories.length - 5} more
                  </span>
                ) : null}
              </div>
            ) : null}

            <NavLink
              to={`/products/category/${category._id}`}
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-blue-400 px-5 py-3 text-sm font-black text-white shadow-xl shadow-blue-400/25 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              View More
              <ArrowUpRightIcon className="h-4 w-4" />
            </NavLink>
          </div>
        </div>
      </div>
    </article>
  );
}

function getCategoryDescription(title, subCategoryCount) {
  const key = title.toLowerCase();
  const matchedKey = Object.keys(categoryCopy).find((item) =>
    key.includes(item),
  );
  const base =
    categoryCopy[matchedKey] ||
    "A carefully built product category from Exaulted India, focused on premium performance, dependable operation, and professional-grade support.";

  if (!subCategoryCount) return base;

  return `${base} This range includes ${subCategoryCount} curated sub-category${
    subCategoryCount > 1 ? "ies" : ""
  } for more specific customer requirements.`;
}

function CategorySkeletons() {
  return (
    <div className="grid gap-8">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="grid min-h-105 overflow-hidden rounded-4xl border border-blue-100 bg-white shadow-[0_24px_90px_rgba(15,91,191,0.08)] lg:grid-cols-2"
        >
          <div className="animate-pulse bg-blue-100" />
          <div className="bg-[#111827] p-8">
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-white/10" />
            <div className="mt-6 h-8 w-2/3 animate-pulse rounded-full bg-white/12" />
            <div className="mt-5 space-y-3">
              <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-3/4 animate-pulse rounded-full bg-white/10" />
            </div>
            <div className="mt-8 h-12 w-32 animate-pulse rounded-full bg-blue-400/30" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ error }) {
  return (
    <div className="rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,91,191,0.1)]">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-500">
        <AlertIcon className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-2xl font-black text-[#111827]">
        Categories load nahi ho paayi
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
        Backend response check karein ya thodi der baad retry karein.
        {error?.status ? ` Status: ${error.status}` : ""}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[28px] border border-blue-100 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,91,191,0.1)]">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-500">
        <GridIcon className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-2xl font-black text-[#111827]">
        No categories found
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
        Jab backend se categories add hongi, yahan automatic premium category
        sections show hone lagenge.
      </p>
    </div>
  );
}

function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
      <div className="absolute right-0 top-96 h-96 w-96 rounded-full bg-emerald-300/16 blur-3xl" />
      <div className="absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-blue-400/12 blur-3xl" />
    </div>
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

export default ClientsProductScreen;
