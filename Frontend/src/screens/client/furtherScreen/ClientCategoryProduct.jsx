import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCategoriesByIdQuery,
  useGetSubCategoriesQuery,
} from "../../../services/api";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import toast from "react-hot-toast";


function ClientCategoryProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, error } = useGetCategoriesByIdQuery(id);
  const { data: allSubCategories, isLoading: subCatogriesLoading } =
    useGetSubCategoriesQuery();

  useEffect(() => {
    if(error){
      toast.error("Internal Server Error")
    }
  },[error])

  const category = data?.data || {};
  const categoryName = category?.categories_name || "Power Solutions";

  const subCategories = useMemo(() => {
    const list = allSubCategories?.data || [];

    return list.filter((item) => item.category_Id?._id === id);
  }, [allSubCategories, id]);

  const heroImage = category?.image?.url;

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
          <h1 className="mt-5 text-xl font-bold text-slate-950">
            Failed To load category 
          </h1>

        </div>
      </main>
    );
  }

  return (
    <main className="overflow-x-hidden bg-[#F8FAFC] text-slate-950">
      <Helmet>
        <title>{`${categoryName} | Exulted India`}</title>
        <meta name="description" content={category?.categories_description || `Explore our range of ${categoryName} at Exulted India. Discover high-quality products, certifications, and pan-India service coverage for all your power needs.`} />
        <meta name="keywords" content={`Exulted India, ${categoryName}, power solutions, product range, certifications, pan-India service`} />
      </Helmet>

      <section className="relative w-full overflow-x-hidden bg-linear-to-r from-blue-300 via-blue-100 to-white">
  
  <div className="mx-auto grid grid-cols-1 max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
    
    {/* LEFT CONTENT */}
    <div className="max-w-xl w-full">
      
      <h1 className="text-2xl sm:text-3xl font-black leading-tight text-black wrap-break-words">
        {categoryName}
      </h1>

      <p className="mt-4 text-sm sm:text-base leading-7 font-bold text-black max-w-full sm:max-w-md wrap-break-words">
        {category?.categories_description}
      </p>

    </div>

    {/* RIGHT IMAGE */}
    <div className="flex items-center justify-center">
      
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        
        <div className="absolute -inset-4 blur-2xl rounded-full" />

        <img
          src={heroImage}
          alt={categoryName}
          className="relative w-full h-55 sm:h-65 md:h-80 lg:h-95 object-contain"
        />
      </div>

    </div>

  </div>
</section>

      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
              Explore Sub Categories
            </p>
            <h2 className="mt-2 text-xl font-black text-slate-950 sm:text-xl">
              {categoryName}
            </h2>
          </div>
        </div>

        {subCategories.length ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
            <h3 className="mt-5 text-xl font-black text-slate-950">
              No sub categories found
            </h3>
            
          </div>
        )}
      </section>
    </main>
  );
}

function SubCategoryCard({ subCategory, index, onOpen }) {
  const title = subCategory?.name ;
  const image = subCategory?.image.url;
  const description = subCategory?.description;

  return (
    <article
      tabIndex={0}
      role="button"
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onOpen();
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[22px] border border-blue-100 bg-white shadow-[0_18px_55px_rgba(15,91,191,0.10)] outline-none transition duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-[0_28px_85px_rgba(15,91,191,0.18)] focus-visible:ring-4 focus-visible:ring-blue-200"
    >
      <div className="relative overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-52 w-full object-fit transition duration-700 group-hover:scale-108 sm:h-56"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0.54))]" />
      </div>

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">

        <h2 className=" text-lg font-bold leading-snug text-slate-900 sm:text-lg">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-600 line-clamp-3">
          {description}
        </p>
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
            className="h-107.5 animate-pulse rounded-[22px] border border-blue-100 bg-white shadow-[0_18px_55px_rgba(15,91,191,0.08)]"
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
