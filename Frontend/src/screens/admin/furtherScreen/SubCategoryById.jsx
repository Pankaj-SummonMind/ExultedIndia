import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateSubCategory from "../../../components/createSubCategory";
import {
  useDeleteSubCategoriesMutation,
  useGetSubCategoryByIdQuery,
} from "../../../services/api";

function SubCategoryById() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: subCategorybyId, isLoading } = useGetSubCategoryByIdQuery(id);
  console.log("data in by id:", subCategorybyId);

  const [deleteSubCategories, { isLoading: isDeleteLoading }] =
    useDeleteSubCategoriesMutation();
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const subCategory = useMemo(() => {
    const responseData = subCategorybyId?.data;

    if (!responseData) return null;

    return {
      ...responseData,
      category_Id: responseData.category_Id
        ? {
            ...responseData.category_Id,
            _id: responseData.category_Id?._id || "",
            categories_name:
              responseData.category_Id?.categories_name ||
              responseData.category_Id?.name ||
              "Unassigned Category",
          }
        : null,
    };
  }, [subCategorybyId]);

  const summaryCards = useMemo(
    () => [
      {
        label: "Sub Category Name",
        value: subCategory?.name || "N/A",
      },
      {
        label: "Parent Category",
        value: subCategory?.category_Id?.categories_name || "N/A",
      },
      {
        label: "Created At",
        value: formatDate(subCategory?.createdAt),
      },
    ],
    [subCategory],
  );

  const handleDelete = async () => {
    try {
      await deleteSubCategories(id).unwrap();
      navigate("/admin/subcategory");
    } catch (deleteError) {
      console.log("error while deleting sub category:", deleteError);
    }
  };

  if (isLoading && !subCategory) {
    return (
      <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
        <div className="rounded-[32px] border border-blue-100 bg-white p-6 shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
          <div className="animate-pulse space-y-5">
            <div className="h-6 w-56 rounded-full bg-blue-100" />
            <div className="h-64 rounded-[28px] bg-slate-100" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-28 rounded-[24px] bg-slate-100" />
              <div className="h-28 rounded-[24px] bg-slate-100" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!subCategory) {
    return (
      <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
        <div className="rounded-[32px] border border-red-100 bg-white p-6 shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
          <div className="rounded-[28px] border border-red-100 bg-red-50 px-5 py-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-400">
              Sub Category Detail
            </p>
            <h1 className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
              Unable to load sub category
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              This sub category could not be fetched right now.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <div className="overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
        <div className="bg-linear-to-br from-white via-blue-50 to-slate-50 px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-400">
                Sub Category Detail
              </p>
              <h1 className="mt-3 text-2xl font-bold text-slate-800 sm:text-3xl">
                {subCategory.name}
              </h1>
              {/* <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full bg-blue-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                  {subCategory.category_Id?.categories_name || "Unassigned Category"}
                </span>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                {subCategory.description || "No description available."}
              </p> */}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsUpdateOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
              >
                <EditIcon className="h-5 w-5" />
                Update
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleteLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <DeleteIcon className="h-5 w-5" />
                {isDeleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <section className="overflow-hidden rounded-[30px] border border-blue-100 bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
            <div className="flex h-full min-h-[320px] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.25),transparent_55%)] p-4 sm:p-6">
              {subCategory.image?.url ? (
                <img
                  src={subCategory.image.url}
                  alt={subCategory.name}
                  className="max-h-[420px] w-full rounded-[24px] border border-white/10 bg-white/5 object-cover shadow-[0_20px_50px_rgba(15,23,42,0.35)]"
                />
              ) : (
                <div className="flex h-full min-h-[280px] w-full flex-col items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-white/5 px-6 text-center">
                  <ImageIcon className="h-10 w-10 text-blue-200" />
                  <p className="mt-4 text-sm font-semibold text-white">
                    No sub category image available
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-blue-100/70">
                    Uploading an image makes this detail page more informative
                    and visually complete.
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="grid gap-5">
            <section className="rounded-[30px] border border-blue-100 bg-white p-5 shadow-[0_14px_35px_rgba(148,163,184,0.10)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-200">
                  <OverviewIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                    Overview
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-800">
                    Sub category information
                  </h2>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                {summaryCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {card.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 sm:text-base">
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[30px] border border-blue-100 bg-white p-5 shadow-[0_14px_35px_rgba(148,163,184,0.10)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-200">
                  <DescriptionIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Description
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-800">
                    Detailed summary
                  </h2>
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-5">
                <p className="text-sm leading-7 text-slate-600 sm:text-base">
                  {subCategory.description ||
                    "No description has been added for this sub category yet."}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <CreateSubCategory
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        setIsCreateModalOpen={setIsUpdateOpen}
        mode="update"
        initialData={subCategory}
      />
    </section>
  );
}

function formatDate(value) {
  if (!value) return "N/A";

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

function ImageIcon({ className }) {
  return (
    <IconShell className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m21 15-5-5L5 20" />
    </IconShell>
  );
}

function OverviewIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M12 3v18" />
      <path d="M3 12h18" />
      <path d="M4.93 4.93 19.07 19.07" />
      <path d="M19.07 4.93 4.93 19.07" />
    </IconShell>
  );
}

function DescriptionIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </IconShell>
  );
}

export default SubCategoryById;
