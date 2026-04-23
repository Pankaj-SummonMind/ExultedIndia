import { useEffect, useMemo, useRef, useState } from "react";
import {
  useCreateSubCategoriesMutation,
  useGetCategoriesQuery,
  useUpdateSubCategoriesMutation,
} from "../services/api";

const EMPTY_FORM = {
  id: "",
  name: "",
  categoryId: "",
  categoryName: "",
  description: "",
  image: null,
  previewUrl: "",
};

function CreateSubCategory({
  isOpen,
  onClose,
  initialData = null,
  mode = "create",
  setIsCreateModalOpen,
}) {
  const [createSubCategories, { isLoading: isCreateLoading }] =
    useCreateSubCategoriesMutation();
  const [updateSubCategories, { isLoading: isUpdateLoading }] =
    useUpdateSubCategoriesMutation();
  const { data: categoriesResponse } = useGetCategoriesQuery();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const fileInputRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const isUpdateMode = mode === "update";
  const isSubmitting = isCreateLoading || isUpdateLoading;

  const categoryOptions = useMemo(
    () =>
      categoriesResponse?.data?.map((item) => ({
        id: item._id,
        name: item.categories_name || item.name || "Unnamed Category",
      })) || [],
    [categoriesResponse],
  );

  const filteredCategories = useMemo(() => {
    const normalizedQuery = categorySearch.trim().toLowerCase();

    if (!normalizedQuery) return categoryOptions;

    return categoryOptions.filter((item) =>
      item.name.toLowerCase().includes(normalizedQuery),
    );
  }, [categoryOptions, categorySearch]);

  useEffect(() => {
    if (!isOpen) return;

    const selectedCategoryName =
      initialData?.categoryName ||
      initialData?.category_Id?.categories_name ||
      initialData?.category_Id?.name ||
      "";

    const selectedCategoryId =
      initialData?.categoryId || initialData?.category_Id?._id || "";

    setFormData({
      id: initialData?.id || initialData?._id || "",
      name:
        initialData?.subCategoryName ||
        initialData?.name ||
        initialData?.subCategories_Name ||
        "",
      categoryId: selectedCategoryId,
      categoryName: selectedCategoryName,
      description:
        initialData?.description ||
        initialData?.subCategories_Description ||
        "",
      image: null,
      previewUrl: initialData?.image?.url || initialData?.image || "",
    });
    setCategorySearch(selectedCategoryName);
    setFormError("");
    setIsCategoryMenuOpen(false);
  }, [isOpen, initialData]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!categoryMenuRef.current?.contains(event.target)) {
        setIsCategoryMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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

  const handleCategorySelect = (category) => {
    setFormError("");
    setFormData((prev) => ({
      ...prev,
      categoryId: category.id,
      categoryName: category.name,
    }));
    setCategorySearch(category.name);
    setIsCategoryMenuOpen(false);
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setFormError("");
    setCategorySearch("");
    setIsCategoryMenuOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeModal = () => {
    setIsCreateModalOpen?.(false);
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedDescription = formData.description.trim();

    if (!trimmedName) {
      setFormError("Sub category name is required.");
      return;
    }

    if (!formData.categoryId) {
      setFormError("Please select a category.");
      return;
    }

    if (!trimmedDescription) {
      setFormError("Description is required.");
      return;
    }

    if (!isUpdateMode && !formData.image) {
      setFormError("Sub category image is required.");
      return;
    }

    const submitData = new FormData();
    submitData.append("subCategories_Name", trimmedName);
    submitData.append("subCategories_Description", trimmedDescription);

    if (!isUpdateMode) {
      submitData.append("category_Id", formData.categoryId);
    }

    if (formData.image) {
      submitData.append("image", formData.image);
    }

    try {
      if (isUpdateMode) {
        await updateSubCategories({
          id: formData.id,
          body: submitData,
        }).unwrap();
      } else {
        await createSubCategories(submitData).unwrap();
      }

      closeModal();
    } catch (error) {
      setFormError(
        error?.data?.message || error?.message || "Something went wrong.",
      );
      console.log("error while submitting sub category:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close create sub category modal"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[3px]"
        onClick={handleCancel}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-4xl border border-blue-100 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.20)]">
        <div className="flex items-start justify-between gap-4 border-b border-blue-100 bg-linear-to-r from-white via-blue-50 to-slate-50 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-400">
              {isUpdateMode ? "Update Sub Category" : "Sub Category Modal"}
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
              {isUpdateMode ? "Update Sub Category" : "Create Sub Category"}
            </h2>
          </div>

          <button
            type="button"
            aria-label="Cancel create sub category"
            onClick={handleCancel}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-white text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="grid gap-5">
              <FieldShell
                label="Sub Category Name"
                htmlFor="subCategoryName"
                helperText="Choose a clear name that fits the selected parent category."
              >
                <input
                  id="subCategoryName"
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  placeholder="e.g. Mobile Accessories"
                  className="w-full rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </FieldShell>

              <FieldShell
                label="Select Category"
                htmlFor="subCategoryCategory"
                helperText={
                  isUpdateMode
                    ? "Existing category reference is shown here during update."
                    : "Search and choose the parent category for this sub category."
                }
              >
                <div className="relative" ref={categoryMenuRef}>
                  <input
                    id="subCategoryCategory"
                    type="text"
                    value={categorySearch}
                    disabled={isUpdateMode}
                    onFocus={() => !isUpdateMode && setIsCategoryMenuOpen(true)}
                    onChange={(event) => {
                      setCategorySearch(event.target.value);
                      setIsCategoryMenuOpen(true);
                      handleChange("categoryId", "");
                      handleChange("categoryName", "");
                    }}
                    placeholder="Search category name"
                    className="w-full rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                  <SearchIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  {!isUpdateMode && isCategoryMenuOpen ? (
                    <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 max-h-56 overflow-auto rounded-3xl border border-blue-100 bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                      {filteredCategories.length ? (
                        filteredCategories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => handleCategorySelect(category)}
                            className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                          >
                            <span className="font-medium">{category.name}</span>
                            {formData.categoryId === category.id ? (
                              <CheckIcon className="h-4 w-4 text-blue-500" />
                            ) : null}
                          </button>
                        ))
                      ) : (
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                          No matching category found.
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </FieldShell>

              <FieldShell
                label="Description"
                htmlFor="subCategoryDescription"
                helperText="Write a concise description that helps define this sub category."
              >
                <textarea
                  id="subCategoryDescription"
                  rows={6}
                  value={formData.description}
                  onChange={(event) =>
                    handleChange("description", event.target.value)
                  }
                  placeholder="Write sub category description here..."
                  className="min-h-32 w-full resize-y rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </FieldShell>

              <FieldShell
                label="Sub Category Image"
                htmlFor="subCategoryImage"
                helperText="Upload a clean image that represents this sub category."
              >
                <input
                  id="subCategoryImage"
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
                        alt="Sub category preview"
                        className="max-h-44 w-full max-w-sm rounded-2xl object-contain shadow-sm"
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-700">
                          Click to replace image
                        </p>
                        <p className="text-xs text-slate-500">
                          Best results with a sharp and category-specific image.
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
                        Recommended: high-quality square or landscape image
                      </span>
                    </div>
                  )}
                </div>
              </FieldShell>

              {formError ? (
                <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
                  {formError}
                </p>
              ) : null}
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

function SearchIcon({ className }) {
  return (
    <IconShell className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </IconShell>
  );
}

function CheckIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m5 12 5 5L20 7" />
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

export default CreateSubCategory;
