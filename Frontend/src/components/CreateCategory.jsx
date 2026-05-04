import { useEffect, useRef, useState } from "react";
import {
  useCreateCategoriesMutation,
  useUpdateCategoriesMutation,
} from "../services/api";
import Loader from "./loader/Loader";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  id: "",
  name: "",
  description: "",
  image: null,
  previewUrl: "",
};

function CreateCategory({
  isOpen,
  onClose,
  initialData = null,
  mode = "create",
  setIsCreateModalOpen,
}) {
  const [createCategories, { isLoading: isCreateLoading }] =
    useCreateCategoriesMutation();
  const [updateCategories, { isLoading: isUpdateLoading }] =
    useUpdateCategoriesMutation();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);

  const isSubmitting = isCreateLoading || isUpdateLoading;
  const isUpdateMode = mode === "update";
  const isLoading = isCreateLoading || isUpdateLoading;

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      id: initialData?.id || initialData?._id || "",
      name: initialData?.categoryName || initialData?.categories_name || "",
      description:
        initialData?.categories_description || initialData?.description || "",
      image: null,
      previewUrl: initialData?.image?.url || initialData?.image || "",
    });
    setFormError("");
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormError("");
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file.");
      toast.error("Please select a valid image file.");
      return;
    }

     // ✅ SIZE VALIDATION (ADD THIS)
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  if (file.size > MAX_SIZE) {
    setFormError("Image must be less than 10MB.");
    toast.error("Image must be less than 10MB.");
    return;
  }


    setFormError("");
    setFormData((prev) => ({
      ...prev,
      image: file,
      previewUrl: URL.createObjectURL(file),
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setFormError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const closeModal = () => {
    setIsCreateModalOpen?.(false);
    resetForm();
    onClose();
  };

  const submitForm = async (event) => {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedDescription = formData.description.trim();

    if (!trimmedName) {
      setFormError("Category name is required.");
      return;
    }

    if (!trimmedDescription) {
      setFormError("Category description is required.");
      return;
    }

    if (!isUpdateMode && !formData.image) {
      setFormError("Category image is required.");
      return;
    }

    const submitData = new FormData();
    submitData.append("categories_name", trimmedName);
    submitData.append("categories_description", trimmedDescription);

    if (formData.image) {
      submitData.append("image", formData.image);
    }

    try {
      if (isUpdateMode) {
        const response = await updateCategories({
            id: formData.id,
            body: submitData
          }).unwrap();

          toast.success(response?.message)

        }else {
        const response = await createCategories(submitData).unwrap();
        toast.success(response?.message)
      }

      closeModal();
    } catch (error) {
      setFormError(
        error?.data?.message || error?.message || "Something went wrong.",
      );
      toast.error(error?.data?.message || error?.message || "Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {<Loader isLoading={isLoading} />}
      <button
        type="button"
        aria-label="Close create category modal"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[3px]"
        onClick={handleCancel}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-4xl border border-blue-100 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.20)]">
        <div className="flex items-start justify-between gap-4 border-b border-blue-100 bg-linear-to-r from-white via-blue-50 to-slate-50 px-5 py-5 sm:px-6">
          <div>
            <h2 className="mt-2 text-lg font-bold text-slate-800 sm:text-lg">
              {isUpdateMode ? "Update Category" : "Create Category"}
            </h2>

            {formError ? (
                <p className=" mt-2 rounded-2xl border border-red-100 bg-red-50 px-2 py-2 text-sm font-medium text-red-500">
                  {formError}
                </p>
              ) : null}
          </div>

          <button
            type="button"
            aria-label="Cancel create category"
            onClick={handleCancel}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-white text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submitForm} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="grid gap-5">
              <FieldShell
                label="Category Name"
                htmlFor="categoryName"
                helperText="Enter a clear category title for your catalog."
              >
                <input
                  id="categoryName"
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  placeholder="e.g. Electronics"
                  className="w-full rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </FieldShell>

              <FieldShell
                label="Description"
                htmlFor="categoryDescription"
                helperText="Add a concise but informative description for this category."
              >
                <textarea
                  id="categoryDescription"
                  rows={6}
                  value={formData.description}
                  onChange={(event) =>
                    handleChange("description", event.target.value)
                  }
                  placeholder="Write category description here..."
                  className="min-h-32 w-full resize-y rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </FieldShell>

              <FieldShell
                label="Category Image"
                htmlFor="categoryImage"
                helperText="Upload a clean category image. PNG, JPG, and WebP are recommended."
              >
                <input
                  id="categoryImage"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div
                  onClick={triggerFileInput}
                  className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-blue-200 bg-slate-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50 sm:px-6"
                >
                  {formData.previewUrl ? (
                    <div className="flex w-full flex-col items-center gap-4">
                      <img
                        src={formData.previewUrl}
                        alt="Category preview"
                        className="max-h-44 w-full max-w-sm rounded-2xl object-contain shadow-sm"
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-700">
                          Click to replace image
                        </p>
                        <p className="text-xs text-slate-500">
                          Image must be less then 10 mb
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-slate-500">
                      <UploadImageIcon className="mb-3 h-9 w-9 text-blue-400" />
                      <span className="text-sm font-semibold text-slate-700">
                        Click to upload image
                      </span>
                      <span className="mt-1 text-xs text-slate-500">
                        Image must be less then 10 mb
                      </span>
                    </div>
                  )}
                </div>
              </FieldShell>

              
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-blue-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-2xl bg-blue-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:shadow-none"
            >
              {isSubmitting
                ? "Please wait..."
                : isUpdateMode
                  ? "Save Changes"
                  : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldShell({ label, htmlFor, helperText, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      {children}
      <p className="mt-2 text-xs text-slate-400">{helperText}</p>
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

function CloseIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </IconShell>
  );
}

function UploadImageIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5" />
      <path d="M12 3v12" />
    </IconShell>
  );
}

export default CreateCategory;
