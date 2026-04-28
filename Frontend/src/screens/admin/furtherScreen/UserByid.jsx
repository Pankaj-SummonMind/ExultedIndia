import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserByidQuery } from "../../../services/api";
import Loader from "../../../components/loader/Loader";

function UserById() {
  const navigate = useNavigate();
  const { id } = useParams();
  // const {data , isLoading,error} = useGetCategoriesByIdQuery(id);
  // const [deleteCategories,{isLoading:isDeleteLoading}] = useDeleteCategoriesMutation()
  const {data : userData, isLoading,error} = useGetUserByidQuery(id)
  const [category, setCategory] = useState({});
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  console.log("id inside getcategoryByid:",id )
  console.log("data for id :",userData)

  useEffect(() => {
    if (error) {
      console.log("error while fetching category by id:", error);
    }
  }, [error]);

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
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-6">
  <div className="rounded-4xl border border-blue-100 bg-linear-to-br from-white via-blue-50 to-slate-50 p-4 shadow-[0_18px_45px_rgba(59,130,246,0.10)] sm:p-6 lg:p-8">
    <Loader isLoading={isLoading} />
    {/* Header */}
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-800 sm:text-xl">
          {userData?.data?.name || ""}
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Customer complete details overview
        </p>
      </div>
    </div>

    {/* Main Full Width Content */}
    <div className="grid gap-6 lg:grid-cols-2">

      {/* Left Side */}
      <div className="space-y-5">
        <div className="rounded-3xl bg-white p-5 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            Full Name
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-800">
            {userData?.data?.name}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            Email Address
          </p>
          <p className="mt-2 break-all text-base font-medium text-slate-700">
            {userData?.data?.email}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            Mobile Number
          </p>
          <p className="mt-2 text-base font-medium text-slate-700">
            +91 {userData?.data?.mobileNumber}
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="space-y-5">
        

        <div className="rounded-3xl bg-white p-5 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            Registered Date
          </p>
          <p className="mt-2 text-base font-medium text-slate-700">
            {new Date(userData?.data?.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* <div className="rounded-3xl bg-white p-5 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            Last Updated
          </p>
          <p className="mt-2 text-base font-medium text-slate-700">
            {new Date(userData?.data?.updatedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div> */}

        <div className="rounded-3xl h-50 bg-white p-5 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
            Message
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
            {userData?.data?.message}
          </p>
        </div>
      </div>
    </div>
  </div>
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

export default UserById;



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