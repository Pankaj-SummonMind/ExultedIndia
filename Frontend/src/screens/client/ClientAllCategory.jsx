import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useGetCategoriesQuery } from "../../services/api";
import { Helmet } from "react-helmet-async";
import Loader from "../../components/loader/Loader";
import { useEffect } from "react";
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom";


function ClientAllCategory() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetCategoriesQuery();

  const categories = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  useEffect(() => {
    if(error){
      toast.error("Internal server Error")
    }
  })

  return (
    <main className="relative overflow-hidden bg-[#F8FAFC] text-[#111827]">
      <Helmet>
        <title>Products | Exulted India</title>
        <meta name="description" content="Explore Exulted India's premium range of batteries, inverters, transformers, online UPS, gensets, and power ecosystem products. Discover high-quality solutions for reliable energy storage, efficient power conversion, and seamless backup across residential, commercial, and industrial applications." />
        <meta name="keywords" content="Exulted India products, batteries, inverters, transformers, online UPS, gensets, power ecosystem, energy storage solutions, reliable power backup" />
      </Helmet>

      <Loader isLoading={isLoading}/>
      {/* <BackgroundDecor /> */}
      <CategoriesBackground />

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-blue-500 shadow-sm backdrop-blur">
            Exulted India
          </p>
          <h1 className="mt-8 text-2xl font-bold leading-tight text-[#111827] sm:text-2xl lg:text-2xl">
            Categories
          </h1>
        </div>
        {isLoading ? <CategorySkeletons /> : null}

        {!isLoading && isError ? <ErrorState error={error} /> : null}

        {!isLoading && !isError && categories.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-2 xl:grid-cols-4">   
            {categories.map((category, index) => (
              <CategoryPanel
                key={category._id || category.categories_name}
                category={category}
                index={index}
                onOpen={() => navigate(`/products/category/${category._id}`)}
              />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

function CategoryPanel({ category, index,onOpen }) {
  const title = category.categories_name;
  const description =
    category.categories_description ||
    getCategoryDescription(title, subCategories.length);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-[0_28px_80px_rgba(37,99,235,0.16)]">
      <button
        type="button"
        onClick={() => onOpen()}
        className="relative text-left" 
        aria-label={`View ${title}`}
      >
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),transparent)]" />
        <div className="overflow-hidden bg-slate-100">
          <img
            src={category.image?.url}
            alt={`${title} category by Exaulted India`}
            loading="lazy"
            className="h-52 w-full object-fit transition duration-700 group-hover:scale-105 sm:h-56"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0.54))]" />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">

        <h2 className=" text-lg font-bold leading-snug text-slate-900 sm:text-lg">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-600 line-clamp-3">
          {description}
        </p>
      </div>
        
      </button>
    </article>
  );
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
    <div className=" mt-10 rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,91,191,0.1)]">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-500">
        <AlertIcon className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-xl font-black text-[#111827]">
        Failed to load All Catagories
      </h2>
    </div>
  );
}

function CategoriesBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(96,165,250,0.2),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(34,197,94,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(248,250,252,1))]" />
      <div className="absolute left-0 top-32 h-px w-full bg-linear-to-r from-transparent via-blue-200 to-transparent" />
      <div className="absolute bottom-20 left-0 h-px w-full bg-linear-to-r from-transparent via-emerald-200 to-transparent" />
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

export default ClientAllCategory;
