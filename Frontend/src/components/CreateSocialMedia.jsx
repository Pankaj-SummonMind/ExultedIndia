
import { useEffect, useState } from "react";
import { useCreateSocialMediaMutation, useUpdateSocialMediaMutation } from "../services/api";
// import { api } from "../../services/api";

const EMPTY_FORM = {
  id:"",
  key: "",
  value: "",
};

function CreateSocialMedia({
  isOpen,
  onClose,
  activeAccount,
//   refetch,
}) {

  const[createSocialMedia,{isLoading}] =  useCreateSocialMediaMutation() 
  const[updateSocialMedia,{isLoading:isUpdateLoading}] = useUpdateSocialMediaMutation()

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiBaseUrl = String(import.meta.env.VITE_API_URL || "").replace(
    /\/$/,
    ""
  );

  useEffect(() => {
    if (activeAccount) {
      setFormData({
        id:activeAccount.id,
        key: activeAccount.key,
        value: activeAccount.value,
      });
    } else {
      setFormData(EMPTY_FORM);
    }

    setFormError("");
  }, [activeAccount, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedKey = formData.key.trim();
    const trimmedValue = formData.value.trim();

    if (!trimmedKey || !trimmedValue) {
      setFormError("Both fields are required");
      return;
    }

    setIsSubmitting(true);

    try {
        console.log("form data:",formData);
        if(activeAccount){
            const res = await updateSocialMedia({
                id : formData.id,
                key:trimmedKey,
                value:trimmedValue
            })
            console.log("res after updating Value",res )
        }
        else{
            const res = await createSocialMedia({
              key: trimmedKey,
              value: trimmedValue,
            }).unwrap();
            console.log("res after creating account",res)
        }
    //   await refetch();
    } catch (error) {
      setFormError(error.message || "Something went wrong");
      console.log("error while handling social Media : ",error )
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[3px]">
      <div className="w-full max-w-lg overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.20)]">
        <div className="border-b border-blue-100 bg-linear-to-r from-white via-blue-50 to-slate-50 px-5 py-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
            Social Media
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
            {activeAccount ? "Update Account" : "Create Account"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5 sm:px-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Account Name
            </label>
            <input
              type="text"
              placeholder="Social Media Name"
              value={formData.key}
              onChange={(e) => handleChange("key", e.target.value)}
              className="w-full rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Value / Link
            </label>
            <input
              type="text"
              placeholder="Value / Link"
              value={formData.value}
              onChange={(e) => handleChange("value", e.target.value)}
              className="w-full rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {formError && (
            <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-500">{formError}</p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-400 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:shadow-none"
            >
              {isSubmitting
                ? "Please wait..."
                : activeAccount
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSocialMedia;

