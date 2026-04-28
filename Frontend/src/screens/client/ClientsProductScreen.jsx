import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useGetCategoriesQuery } from "../../services/api";
import { Helmet } from "react-helmet-async";

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

  return (
    <main className="relative overflow-hidden bg-[#F8FAFC] text-[#111827]">
      <Helmet>
        <title>Products | Exulted India</title>
        <meta name="description" content="Explore Exulted India's premium range of batteries, inverters, transformers, online UPS, gensets, and power ecosystem products. Discover high-quality solutions for reliable energy storage, efficient power conversion, and seamless backup across residential, commercial, and industrial applications." />
        <meta name="keywords" content="Exulted India products, batteries, inverters, transformers, online UPS, gensets, power ecosystem, energy storage solutions, reliable power backup" />
      </Helmet>

      <BackgroundDecor />
      {/* <section className="relative mx-auto max-w-7xl px-4 pt-8 pb-18 sm:px-6 lg:px-8 lg:pt-12">
        <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-700">
                Categories
              </span>
              <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[2.1rem]">
                Explore our product categories
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
                Reliable power solutions, presented in a cleaner and more
                compact browsing experience for every screen size.
              </p>
            </div>

            {!isLoading && !isError && categories.length > 0 ? (
              <div className="-mx-2 flex gap-3 overflow-x-auto px-2 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categories.map((category) => (
                  <span
                    key={`pill-${category._id || category.categories_name}`}
                    className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                  >
                    {category.categories_name}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section> */}

      <section className="mt-10 relative mx-auto max-w-7xl px-4 pb-18 sm:px-6 lg:px-8">
        {isLoading ? <CategorySkeletons /> : null}

        {!isLoading && isError ? <ErrorState error={error} /> : null}

        {!isLoading && !isError && categories.length === 0 ? (
          <EmptyState />
        ) : null}

        {!isLoading && !isError && categories.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
  const title = category.categories_name;
  const subCategories = Array.isArray(category.subCategories)
    ? category.subCategories
    : [];
  const description =
    category.categories_description ||
    getCategoryDescription(title, subCategories.length);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_80px_rgba(37,99,235,0.16)]">
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),transparent)]" />
        <div className="absolute right-4 top-4 z-10 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700 shadow-sm backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="overflow-hidden bg-slate-100">
          <img
            src={category.image?.url}
            alt={`${title} category by Exaulted India`}
            loading="lazy"
            className="h-52 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-56"
          />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner shadow-blue-100">
            <BoltIcon className="h-5 w-5" />
          </span>
          {subCategories.length ? (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
              {subCategories.length} subcategories
            </span>
          ) : null}
        </div>

        <h2 className="mt-4 text-lg font-bold leading-snug text-slate-900 sm:text-xl">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-4">
          {description}
        </p>

        {subCategories.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {subCategories.slice(0, 3).map((subCategory) => (
              <NavLink
                key={subCategory._id || subCategory.name}
                to={`/products/subcategory/${subCategory._id}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:text-blue-700"
              >
                {subCategory.name}
              </NavLink>
            ))}

            {subCategories.length > 3 ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                +{subCategories.length - 3} more
              </span>
            ) : null}
          </div>
        ) : null}

        <NavLink
          to={`/products/category/${category._id}`}
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          Learn More
          <ArrowUpRightIcon className="h-4 w-4" />
        </NavLink>
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
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
        >
          <div className="h-52 animate-pulse bg-slate-200 sm:h-56" />
          <div className="p-6">
            <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-200" />
            <div className="mt-4 h-5 w-2/3 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-4 space-y-3">
              <div className="h-3 w-full animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-slate-200" />
              <div className="h-3 w-4/6 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="mt-6 h-10 w-28 animate-pulse rounded-full bg-slate-200" />
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
