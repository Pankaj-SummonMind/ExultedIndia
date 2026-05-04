import { useEffect, useMemo, useState } from "react";
import CreateSocialMedia from "../../components/CreateSocialMedia";
import {useDeleteSocialMediaMutation, useGetAllSocialMediaQuery } from "../../services/api";
import Loader from "../../components/loader/Loader";
import toast from "react-hot-toast";
function SocialMediaScreen() {


  const {data,isLoading:isFetching,error:fetchError}  = useGetAllSocialMediaQuery()
  const [deleteSocialMedia,{isLoading: isDeleting}] = useDeleteSocialMediaMutation()
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const isLoading = isFetching || isDeleting;

  useEffect(() => {
    if (fetchError) {
      toast.error("internal server error");
    }
  }, [fetchError]);

  const socialAccounts = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data]);

  const filteredAccounts = useMemo(() => {
    return socialAccounts.filter((item) =>
      [item.key, item.value].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [socialAccounts, searchTerm]);

  const openCreate = () => {
    setActiveAccount(null);
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setActiveAccount({
      id: item._id,
      key: item.key,
      value: item.value,
    });
    setIsOpen(true);
  };

  const onDelete = async (item) => {
    try {
      const res = await deleteSocialMedia({
        id : item._id
      }).unwrap() 
      toast.success(res?.message || "Account deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete account");
    }
  }

  return (
    <section className="p-4 sm:p-5 lg:p-6">
      <Loader isLoading={isLoading} />
      <div className="mb-5 rounded-[30px] border border-blue-100 bg-linear-to-br from-white via-blue-50 to-slate-50 p-5 shadow-[0_18px_45px_rgba(59,130,246,0.10)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
              Admin
            </p>
            <h1 className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
              Social Media Accounts
            </h1>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <input
              type="text"
              placeholder="Search account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full rounded-2xl border border-blue-100 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 sm:w-72"
            />

            <button
              onClick={openCreate}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-400 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
            >
              Add Account
            </button>
          </div>
        </div>
      </div>

      {isFetching ? (
        <div className="rounded-3xl border border-blue-100 bg-white px-5 py-8 text-center text-sm font-medium text-slate-500 shadow-[0_14px_35px_rgba(148,163,184,0.10)]">
          Loading accounts...
        </div>
      ) : (
        <div className="overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
          <div className="border-b border-blue-100 px-5 py-4 sm:px-6">
            <p className="text-sm font-semibold text-slate-700">
              Account List
            </p>
          </div>

          {filteredAccounts.length > 0 ? (
  <div className="divide-y divide-blue-50">
    {filteredAccounts.map((item) => (
      <div
        key={item._id}
        className="flex flex-col gap-4 px-5 py-4 transition hover:bg-blue-50/50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-800">
            {item.key}
          </h3>

          <p className="mt-1 break-all text-sm leading-6 text-slate-500">
            {item.value}
          </p>
        </div>

        {/* buttons */}
        <div className="flex items-center justify-center gap-2 sm:justify-end">
          <button
            onClick={() => onDelete(item)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-200 bg-white text-red-600 transition hover:bg-red-50"
          >
            <DeleteIcon className="h-5 w-5" />
          </button>

          <button
            onClick={() => openEdit(item)}
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-blue-200 bg-white px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Edit
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
            <div className="px-5 py-10 text-center text-sm font-medium text-slate-500">
              No social media accounts found.
            </div>
          )}
        </div>
      )}

      <CreateSocialMedia
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        activeAccount={activeAccount}
        // refetch={refetch}
      />
    </section>
  );
}

export default SocialMediaScreen;

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