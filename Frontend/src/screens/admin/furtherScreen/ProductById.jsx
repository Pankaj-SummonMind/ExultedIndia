import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CreateProduct from "../../../components/CreateProduct";
import {
  useDeleteProductMutation,
  useGetProductByidQuery,
} from "../../../services/api";
import Loader from "../../../components/loader/Loader";
import toast from "react-hot-toast";

function ProductById() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState({});
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {
    data: productDetail,
    isLoading: isProductLoading,
    error,
  } = useGetProductByidQuery(id);
  const [deleteProduct, { isLoading: isDeleteLoading }] =
    useDeleteProductMutation();
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const isLoading = isProductLoading || isDeleteLoading;
  const productData = productDetail?.data;
  const productImages = useMemo(
    () =>
      (productData?.images || [])
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return item?.url || item?.path || item?.image || "";
        })
        .filter(Boolean),
    [productData?.images],
  );


  useEffect(() => {
    if (error) {
      toast.error("Internal Server Error:");
    }
  }, [error]);

  const handleDelete = async () => {
    try {
      const res = await deleteProduct(id).unwrap();
      navigate("/admin/product");
      toast.success(res?.message || "Product deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  const handleUpdateProduct = (formData) => {
    const updatedCategory = updateCategory(id, formData);
    setCategory(updatedCategory);
    setIsUpdateOpen(false);
  };

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [productImages.length, id]);

  const handlePreviousImage = () => {
    if (productImages.length <= 1) {
      return;
    }

    setCurrentImageIndex((current) =>
      current === 0 ? productImages.length - 1 : current - 1,
    );
  };

  const handleNextImage = () => {
    if (productImages.length <= 1) {
      return;
    }

    setCurrentImageIndex((current) =>
      current === productImages.length - 1 ? 0 : current + 1,
    );
  };

  if (showCreateProduct) {
    return (
      <CreateProduct
        onShowList={() => setShowCreateProduct(false)}
        mode="update"
        initialData={productDetail.data}
        productImages={productImages}
      />
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5 overflow-x-hidden">
      <Loader isLoading={isLoading} />
      <div className="`rounded-4xl border border-blue-100 bg-linear-to-br from-white via-blue-50 to-slate-50 p-5 shadow-[0_18px_45px_rgba(59,130,246,0.10)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="mt-2 text-xl font-bold text-slate-800 sm:text-xl">
              {productDetail?.data?.product_name || ""}
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => setShowCreateProduct(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
            >
              <EditIcon className="h-5 w-5" />
              Update
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <DeleteIcon className="h-5 w-5" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-1">
        <div className="rounded-4xl border border-blue-100 bg-white p-5 shadow-[0_20px_50px_rgba(148,163,184,0.12)] sm:p-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-blue-50">
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4">

                  {productImages.length > 1 ? (
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

                <div className="flex w-full min-w-0 items-center justify-center p-4 sm:p-6">
                  {productImages.length > 0 ? (
                    <img
                      src={productImages[currentImageIndex]}
                      alt={productData?.product_name || "Product image"}
                      className="max-h-95 w-full rounded-[28px] object-contain sm:max-h-115"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center rounded-[28px] border border-dashed border-blue-200 bg-white/80 px-6 py-12 text-center">
                      <ImageGalleryIcon className="h-14 w-14 text-blue-300" />
                      <p className="mt-4 text-lg font-semibold text-slate-700">
                        Product image not available
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {productImages.length > 1 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {productImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={[
                        "group overflow-hidden rounded-3xl border bg-slate-50 transition",
                        currentImageIndex === index
                          ? "border-blue-400 shadow-[0_12px_30px_rgba(59,130,246,0.18)]"
                          : "border-slate-200 hover:border-blue-200",
                      ].join(" ")}
                      aria-label={`Show product image ${index + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${productData?.product_name || "Product"} ${index + 1}`}
                        className="h-24 w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="space-y-3 min-w-0">
              <DetailSection
                title="Product Name"
                icon={<CubeIcon className="h-5 w-5" />}
              >
                <p className="text-xl font-bold tracking-tight text-slate-900 sm:text-xl">
                  {productData?.product_name || "N/A"}
                </p>
              </DetailSection>

              <div className="grid gap-2 sm:grid-cols-2">
                <DetailSection
                  title="Category"
                  icon={<CategoryIcon className="h-5 w-5" />}
                >
                  <p className="text-base font-semibold text-slate-800">
                    {productData?.product_category?.categories_name || "N/A"}
                  </p>
                </DetailSection>

                <DetailSection
                  title="Sub Category"
                  icon={<SubCategoryIcon className="h-5 w-5" />}
                >
                  <p className="text-base font-semibold text-slate-800">
                    {productData?.product_subCategory?.name || "N/A"}
                  </p>
                </DetailSection>
              </div>

              <DetailSection
                title="Description"
                icon={<InfoIcon className="h-5 w-5" />}
              >
                <p className="text-sm leading-7 text-slate-600 sm:text-base">
                  {productData?.description ||
                    "No description available for this product."}
                </p>
              </DetailSection>

              <DetailSection
                title="Features"
                icon={<SparklesIcon className="h-5 w-5" />}
              >
                {productData?.features?.length ? (
                  <div className="grid gap-3">
                    {productData.features.map((feature, index) => (
                      <div
                        key={`${feature}-${index}`}
                        className="flex items-start gap-3 "
                      >
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm">
                          <FeatureStarIcon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="mt-1 text-sm font-medium leading-6 text-slate-700 sm:text-base">
                            {feature}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState label="No features added for this product." />
                )}
              </DetailSection>

              <DetailSection
                title="Specifications"
                icon={<SpecificationIcon className="h-5 w-5" />}
              >
                {productData?.specifications?.length ? (
                  <div className="overflow-hidden rounded-[28px] border border-slate-200">

                    <div className="divide-y divide-slate-200 bg-white">
                      {productData.specifications.map((item, index) => (
                        <div
                          key={item._id || `${item.key}-${index}`}
                          className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:px-5"
                        >
                          <p className="text-sm font-semibold text-slate-800">
                            {formatLabel(item.key) || "N/A"}
                          </p>
                          <p className="text-sm leading-6 text-slate-600">
                            {item.value || "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptyState label="No specifications available for this product." />
                )}
              </DetailSection>

              <DetailSection
                title="Product Catalog"
                icon={<CatalogIcon className="h-5 w-5" />}
              >
                {productData?.pdf?.url ? (
                  <a
                    href={productData.pdf.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-between gap-3 rounded-3xl border border-blue-100 bg-white px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                        <PdfIcon className="h-5 w-5" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block overflow-hidden text-ellipsis break-all">
                          {productData.pdf.fileName || "Open product catalog"}
                        </span>
                      </span>
                    </div>

                    <ExternalLinkIcon className="h-4 w-4 shrink-0" />
                  </a>
                ) : (
                  <EmptyState label="No product catalog PDF available." />
                )}
              </DetailSection>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DetailSection({ title, icon, children }) {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-linear-to-br from-white via-slate-50 to-blue-50/70 p-5 shadow-[0_14px_35px_rgba(148,163,184,0.10)] sm:p-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-200">
          {icon}
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
            {title}
          </p>
        </div>
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

function EmptyState({ label }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
      {label}
    </div>
  );
}

function formatLabel(value) {
  return value?.trim?.() || "";
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

function EditIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </IconShell>
  );
}

function DeleteIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </IconShell>
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

function CubeIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="M12 12 4 7.5" />
      <path d="M12 12l8-4.5" />
      <path d="M12 12v9" />
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

function FeatureStarIcon({ className }) {
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

function ImageGalleryIcon({ className }) {
  return (
    <IconShell className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m21 15-4.5-4.5L10 17" />
      <path d="m3 15 4-4 4 4" />
    </IconShell>
  );
}

function CatalogIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </IconShell>
  );
}

function PdfIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h1.5a1.5 1.5 0 0 1 0 3H8v-5" />
      <path d="M12 11v5h1.5a1.5 1.5 0 0 0 1.5-1.5v-2A1.5 1.5 0 0 0 13.5 11Z" />
      <path d="M17 11h2" />
      <path d="M17 13.5h1.5" />
      <path d="M17 16v-5" />
    </IconShell>
  );
}

function ExternalLinkIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </IconShell>
  );
}

export default ProductById;
