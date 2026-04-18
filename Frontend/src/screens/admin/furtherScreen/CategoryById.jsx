import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CreateCategory from "../../../components/CreateCategory";
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "../../../data/categoryStore";
import { useDeleteCategoriesMutation, useGetCategoriesByIdQuery } from "../../../services/api";

function CategoryById() {
  const navigate = useNavigate();
  const { id } = useParams();
  const {data , isLoading,error} = useGetCategoriesByIdQuery(id);
  const [deleteCategories,{isLoading:isDeleteLoading}] = useDeleteCategoriesMutation()
  const [category, setCategory] = useState({});
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  console.log("id inside getcategoryByid:",id )
  console.log("data for id :",data)

  useEffect(() => {
    setCategory({
    id: 1,
    name: "Electronics",
    subCategory: ["Mobiles", "Laptops", "Accessories"],
    createdAt: "15 Apr 2026",
  });
  }, [id]);


  const handleDelete = async () => {
    try {
      const res = await deleteCategories(id).unwrap()
      console.log("respone while deleting categories", res)
      navigate("/admin/category");
    } catch (error) {
      console.log("error: ", error)
    }
  };

  const handleUpdateCategory = (formData) => {
    const updatedCategory = updateCategory(id, formData);
    setCategory(updatedCategory);
    setIsUpdateOpen(false);
  };

  function EmptyState({ label }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
      {label}
    </div>
  );
}

function FeatureStarIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.2 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </IconShell>
  );
}

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <div className="`rounded-4xl border border-blue-100 bg-linear-to-br from-white via-blue-50 to-slate-50 p-5 shadow-[0_18px_45px_rgba(59,130,246,0.10)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            {/* <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-400">
              Category Detail
            </p> */}
            <h1 className="mt-2 text-xl font-bold text-slate-800 sm:text-xl">
              {data?.data?.categories_name || ""}
            </h1>
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
          <section className="rounded-[30px] border border-slate-200 bg-linear-to-br from-white via-slate-50 to-blue-50/70 p-5 shadow-[0_14px_35px_rgba(148,163,184,0.10)] sm:p-6">
  <div className="flex items-center gap-3">
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-200">
      <SubCategoryIcon className="h-5 w-5" />
    </span>

    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
        Sub Category
      </p>
    </div>
  </div>

  <div className="mt-4">
    {data?.data?.subCategories?.length ? (
      <div className="grid gap-3">
        {data.data.subCategories.map((item, index) => (
          <div
            key={item._id}
            className="flex items-start gap-3"
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm">
              <FeatureStarIcon className="h-4 w-4" />
            </span>

            <div>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-700 sm:text-base">
                {item.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <EmptyState label="No sub categories found." />
    )}
  </div>
</section>
        </div>
      </div>

      <CreateCategory
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        setIsCreateModalOpen={setIsUpdateOpen}
        mode="update"
        initialData={{
          id: data?.data?._id,
          categoryName: data?.data?.categories_name,
          subCategory: data?.data?.subCategories
        }}
      />

    </section>
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

export default CategoryById;



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