import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCategoriesByIdQuery } from "../../../services/api";

const batteryDescription =
  "Exulted India offers energy efficient Batteries uniquely designed as bigger electrolyte reserve volume requires less topping up during service periods. Deep Cycle Design. Extra thick tubular plates with superfine grain structure, minimizes grid corrosion at high temperature. Exulted is offering Tubular batteries in the variants of 150Ah, 200Ah, 220Ah, 240Ah of 12V as per the requirements.";

const heroImages = {
  battery:
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1800&q=85",
  inverter:
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1800&q=85",
  transformer:
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1800&q=85",
  ups: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=85",
  default:
    "https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=1800&q=85",
};

const subCategoryImages = [
  {
    key: "vrla",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "tubular",
    image:
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "lithium",
    image:
      "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "automotive",
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80",
  },
];

const fallbackCardImages = [
  "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=900&q=80",
];

function ClientCategoryProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, error } = useGetCategoriesByIdQuery(id);

  const category = data?.data || {};
  const categoryName = category?.categories_name || "Power Solutions";
  const subCategories = useMemo(() => {
    if (Array.isArray(category?.subCategories)) return category.subCategories;
    return [];
  }, [category?.subCategories]);

  const heroImage = getHeroImage(categoryName);

  const goToSubCategory = (subCategoryId) => {
    if (!subCategoryId) return;
    navigate(`/products/subcategory/${subCategoryId}`);
  };

  if (isLoading) return <LoadingState />;

  if (error) {
    return (
      <main className="bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-red-100 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,91,191,0.1)]">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-500">
            <AlertIcon className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-2xl font-black text-slate-950">
            Category load nahi ho paayi
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Backend response check karein ya thodi der baad retry karein.
            {error?.status ? ` Status: ${error.status}` : ""}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="overflow-hidden bg-[#F8FAFC] text-slate-950">
      <section className="relative flex min-h-[calc(100vh-72px)] w-full items-center overflow-hidden bg-slate-950">
        <img
          src={heroImage}
          alt={`${categoryName} category`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.94)_0%,rgba(15,23,42,0.78)_42%,rgba(15,23,42,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.1),rgba(15,23,42,0.72))]" />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-blue-100 backdrop-blur">
              Exulted India Range
            </p>
            <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
              {categoryName}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-100 sm:text-lg">
              {batteryDescription}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                <GridIcon className="h-4 w-4" />
                {subCategories.length || 0} Sub Categories
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                <ShieldIcon className="h-4 w-4" />
                Deep Cycle Design
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">
              Explore Products
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              {categoryName}
            </h2>
          </div>
          {/* <p className="max-w-xl text-sm leading-6 text-slate-600">
            Choose a product family to view matched catalog and products.
          </p> */}
        </div>

        {subCategories.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {subCategories.map((subCategory, index) => (
              <SubCategoryCard
                key={subCategory._id || subCategory.name}
                subCategory={subCategory}
                index={index}
                onOpen={() => goToSubCategory(subCategory._id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-blue-100 bg-white p-8 text-center shadow-[0_20px_70px_rgba(15,91,191,0.08)]">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
              <GridIcon className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-2xl font-black text-slate-950">
              No sub categories found
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Backend me sub categories add hote hi yahan cards automatic show
              honge.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function SubCategoryCard({ subCategory, index, onOpen }) {
  const title = subCategory?.name || "Sub Category";
  const image = getSubCategoryImage(title, index);

  return (
    <article
      tabIndex={0}
      role="button"
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onOpen();
      }}
      className="group flex h-[430px] cursor-pointer flex-col overflow-hidden rounded-[22px] border border-blue-100 bg-white shadow-[0_18px_55px_rgba(15,91,191,0.10)] outline-none transition duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-[0_28px_85px_rgba(15,91,191,0.18)] focus-visible:ring-4 focus-visible:ring-blue-200"
    >
      <div className="relative h-[68%] w-full overflow-hidden bg-blue-50">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0.54))]" />
        <span className="absolute left-4 top-4 rounded-full border border-white/35 bg-white/82 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-700 shadow-sm backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-2 min-h-12 text-lg font-black leading-6 text-slate-950">
            {title}
          </h3>
          {/* <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Premium Power Range
          </p> */}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-3 text-xs font-black text-blue-700 transition hover:border-blue-500 hover:bg-blue-100"
          >
            View Catalogue
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-blue-600 px-3 text-xs font-black text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
          >
            View Products
          </button>
        </div>
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <main className="bg-[#F8FAFC]">
      <section className="min-h-[calc(100vh-72px)] animate-pulse bg-slate-900 px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-full max-w-7xl items-center">
          <div className="w-full max-w-3xl">
            <div className="h-9 w-52 rounded-full bg-white/12" />
            <div className="mt-6 h-16 w-4/5 rounded-2xl bg-white/12" />
            <div className="mt-6 space-y-3">
              <div className="h-3 w-full rounded-full bg-white/10" />
              <div className="h-3 w-11/12 rounded-full bg-white/10" />
              <div className="h-3 w-3/4 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:px-8 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-[430px] animate-pulse rounded-[22px] border border-blue-100 bg-white shadow-[0_18px_55px_rgba(15,91,191,0.08)]"
          >
            <div className="h-[68%] rounded-t-[22px] bg-blue-100" />
            <div className="p-4">
              <div className="h-5 w-2/3 rounded-full bg-slate-100" />
              <div className="mt-3 h-3 w-1/2 rounded-full bg-slate-100" />
              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="h-10 rounded-full bg-blue-50" />
                <div className="h-10 rounded-full bg-blue-100" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

function getHeroImage(categoryName) {
  const key = String(categoryName || "").toLowerCase();
  const matchedKey = Object.keys(heroImages).find((item) => key.includes(item));
  return heroImages[matchedKey] || heroImages.default;
}

function getSubCategoryImage(name, index) {
  const key = String(name || "").toLowerCase();
  const matched = subCategoryImages.find((item) => key.includes(item.key));
  return matched?.image || fallbackCardImages[index % fallbackCardImages.length];
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

function ShieldIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-5" />
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

export default ClientCategoryProduct;
