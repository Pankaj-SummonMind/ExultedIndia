import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductByidQuery,
  useGetProductQuery,
  useGetSubCategoryByIdQuery,
} from "../../../services/api";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import toast from "react-hot-toast"


function ClientsSubCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading:isSubCategoryLoading,error:subCategoryByIdError } = useGetSubCategoryByIdQuery(id);
  const {
    data: allProduct,
    isLoading: isProductLoading,
    error : productError,
  } = useGetProductQuery();

  const subCategory = data?.data;

  const error  = productError || subCategoryByIdError;
  const isLoading  = isProductLoading || isSubCategoryLoading ;

  useEffect(() => {
    if(error){
      toast.error("Internal Server error")
    }
  },[error])

  const products = useMemo(() => {
    const rows = Array.isArray(allProduct?.data)
      ? allProduct.data
      : Array.isArray(allProduct)
        ? allProduct
        : [];

    return rows.filter((product) => product?.product_subCategory?._id === id);
  }, [allProduct, id]);

  const subCategoryName =
    products[0]?.product_subCategory?.name;
  const categoryName =
    products[0]?.product_category?.categories_name || "Products";

  if (isLoading) return <SubCategoryLoading />;

  if (error) {
    return (
      <main className="bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8">
        <StateCard
          title="Failed to load Product "
          tone="error"
        />
      </main>
    );
  }

  return (
    <main className="overflow-x-hidden bg-[#F8FAFC] text-slate-950">

      <Helmet>
        <title>{`${subCategory?.name} | Exulted India`}</title>
        <meta name="description" content={subCategory?.description || `Discover our range of ${subCategory?.name} at Exulted India. Explore high-quality products, certifications, and pan-India service coverage for all your power needs.`} />
        <meta name="keywords" content={`Exulted India, ${subCategory?.name}, power solutions, product range, certifications, pan-India service`} />
      </Helmet>


      <section className="relative w-full overflow-x-hidden bg-linear-to-r from-blue-300 via-blue-100 to-white">

  <div className="mx-auto grid grid-cols-1 max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">

    {/* LEFT CONTENT */}
    <div className="max-w-xl w-full">
      
      <h1 className="text-2xl sm:text-3xl font-black leading-tight text-black wrap-break-word">
        {subCategory?.name}
      </h1>

      <p className="mt-4 text-sm sm:text-base leading-7 font-bold text-black max-w-full sm:max-w-md wrap-break-words">
        {subCategory?.description}
      </p>

    </div>

    {/* RIGHT IMAGE */}
    <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
  
  <div className="absolute -inset-4 blur-2xl rounded-full" />

  <img
    src={subCategory?.image?.url}
    alt={subCategory?.name}
    className="relative w-full h-55 sm:h-65 md:h-80 lg:h-95 object-contain"
  />

</div>

  </div>
</section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
              Related Products
            </p>
            <h2 className="mt-2 text-xl font-black text-slate-950 sm:text-xl">
              Explore {subCategory?.name}
            </h2>
          </div>
        </div>

        {products.length ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          />
        )}
      </section>
    </main>
  );
}

function ProductCard({ product, index, onOpen }) {
  const image = product?.images?.[0]?.url;
  const title = product?.product_name;
  const description =product?.description;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-[0_28px_80px_rgba(37,99,235,0.16)]">
      <button
        type="button"
        onClick={onOpen}
        className="relative h-full w-full overflow-hidden bg-blue-50 text-left"
        aria-label={`View ${title}`}
      >
        <div className="relative">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-52 w-full object-fit transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.48))]" />

        </div>
      

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div>
          <h3 className="line-clamp-2 min-h-8 text-base font-black leading-6 text-slate-950">
            {title}
          </h3>
          <p className=" line-clamp-3 text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>
      </button>
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
              className="h-107.5 animate-pulse rounded-[22px] border border-blue-100 bg-white shadow-[0_18px_55px_rgba(15,91,191,0.08)]"
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

function StateCard({ title, tone = "default" }) {
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
        {isError ? (
          <AlertIcon className="h-7 w-7" />
        ) : (
          <GridIcon className="h-7 w-7" />
        )}
      </div>
      <h2 className="mt-5 text-xl font-black text-slate-950">{title}</h2>
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
  return (
    getProductImages(product)[0]);
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
