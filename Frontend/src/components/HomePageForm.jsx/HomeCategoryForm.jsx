import { useEffect, useMemo, useRef, useState } from "react";
import { useGetCategoriesQuery } from "../../services/api";

const EMPTY_FORM = {
  id: "",
  title: "",
  categories: [],
};

function HomeCategoryForm({
  isOpen,
  onClose,
  activeHomeCategory,
  onSubmit,
}) {
  const { data, isLoading } = useGetCategoriesQuery();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef(null);

  const categoryOptions = useMemo(() => {
    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data)) {
      return data;
    }

    return [];
  }, [data]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const normalizedCategories = normalizeSelectedCategories(
      activeHomeCategory?.categories,
    );

    if (activeHomeCategory) {
      setFormData({
        id: activeHomeCategory.id || activeHomeCategory._id || "",
        title: activeHomeCategory.title || "",
        categories: normalizedCategories,
      });
    } else {
      setFormData(EMPTY_FORM);
    }

    setSearchValue("");
    setFieldErrors({});
    setFormError("");
    setIsDropdownOpen(false);

    return undefined;
  }, [activeHomeCategory, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const filteredCategories = useMemo(() => {
    const selectedIds = new Set(formData.categories.map((item) => item.id));
    const normalizedSearch = searchValue.trim().toLowerCase();

    return categoryOptions.filter((item) => {
      const itemId = item._id || item.id;
      const itemName = item.categories_name || item.name || "";

      if (!itemId || selectedIds.has(itemId)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return itemName.toLowerCase().includes(normalizedSearch);
    });
  }, [categoryOptions, formData.categories, searchValue]);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    if (formError) {
      setFormError("");
    }
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setIsDropdownOpen(true);

    if (fieldErrors.categories) {
      setFieldErrors((prev) => ({
        ...prev,
        categories: "",
      }));
    }

    if (formError) {
      setFormError("");
    }
  };

  const handleSelectCategory = (item) => {
    const selectedCategory = {
      id: item._id || item.id || "",
      name: item.categories_name || item.name || "",
    };

    setFormData((prev) => ({
      ...prev,
      categories: [...prev.categories, selectedCategory],
    }));
    setSearchValue("");
    setIsDropdownOpen(false);
    setFieldErrors((prev) => ({
      ...prev,
      categories: "",
    }));
    setFormError("");
  };

  const handleRemoveCategory = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((item) => item.id !== categoryId),
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (formData.categories.length === 0) {
      nextErrors.categories = "At least one category is required.";
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFormError("Please fill in all required fields before submitting.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const trimmedTitle = formData.title.trim();
    const selectedCategoryIds = formData.categories.map((item) => item.id);

    const payload = new FormData();
    payload.append("title", trimmedTitle);
    payload.append("categories", JSON.stringify(selectedCategoryIds));

    if (formData.id) {
      payload.append("id", formData.id);
    }

    try {
      setIsSubmitting(true);

      await onSubmit?.(payload, {
        id: formData.id,
        title: trimmedTitle,
        categories: formData.categories,
      });

      onClose();
    } catch (error) {
      setFormError(
        error?.data?.message || error?.message || "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-slate-900/45 p-4 backdrop-blur-[3px]">
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.20)]">
        <div className="border-b border-blue-100 bg-linear-to-r from-white via-blue-50 to-slate-50 px-5 py-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
            Home Page
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
            {activeHomeCategory ? "Update Home Category" : "Add Home Category"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage the section title and choose multiple categories for the home
            page.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <FormField
              label="Title"
              error={fieldErrors.title}
              htmlFor="home-category-title"
            >
              <input
                id="home-category-title"
                type="text"
                placeholder="Enter section title"
                value={formData.title}
                onChange={(event) => updateField("title", event.target.value)}
                className={getInputClassName(Boolean(fieldErrors.title))}
              />
            </FormField>

            <FormField
              label="Categories"
              error={fieldErrors.categories}
              htmlFor="home-category-search"
            >
              <div ref={containerRef} className="relative">
                <div
                  className={`rounded-3xl border bg-slate-50 p-3 transition ${
                    fieldErrors.categories
                      ? "border-red-200 bg-red-50/40"
                      : "border-blue-100 focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100"
                  }`}
                >
                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                      >
                        {item.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(item.id)}
                          className="inline-flex h-5 w-5 items-center justify-center rounded-full text-blue-500 transition hover:bg-blue-100 hover:text-blue-700"
                          aria-label={`Remove ${item.name}`}
                        >
                          <CloseIcon className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}

                    <input
                      id="home-category-search"
                      type="text"
                      value={searchValue}
                      onFocus={() => setIsDropdownOpen(true)}
                      onChange={(event) =>
                        handleSearchChange(event.target.value)
                      }
                      placeholder={
                        formData.categories.length > 0
                          ? "Search and add more categories"
                          : "Search categories"
                      }
                      className="min-w-45 flex-1 bg-transparent px-2 py-2 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {isDropdownOpen ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 max-h-64 overflow-y-auto rounded-3xl border border-blue-100 bg-white p-2 shadow-[0_18px_50px_rgba(148,163,184,0.22)]">
                    {isLoading ? (
                      <div className="px-4 py-3 text-sm text-slate-400">
                        Loading categories...
                      </div>
                    ) : filteredCategories.length > 0 ? (
                      filteredCategories.map((item) => (
                        <button
                          key={item._id || item.id}
                          type="button"
                          onClick={() => handleSelectCategory(item)}
                          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                        >
                          <span>{item.categories_name || item.name}</span>
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-slate-400">
                        {categoryOptions.length === 0
                          ? "No categories available"
                          : "No matching category found"}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </FormField>

            {formError ? (
              <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
                {formError}
              </p>
            ) : null}
          </div>

          <div className="border-t border-blue-100 px-5 py-4 sm:px-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
                  : activeHomeCategory
                    ? "Update Home Category"
                    : "Save Home Category"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function normalizeSelectedCategories(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return {
          id: item,
          name: item,
        };
      }

      const id = item?._id || item?.id || item?.categoryId || "";
      const name =
        item?.categories_name || item?.name || item?.title || item?.label || "";

      if (!id && !name) {
        return null;
      }

      return {
        id: id || name,
        name: name || id,
      };
    })
    .filter(Boolean);
}

function FormField({ label, htmlFor, error, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-2 text-xs font-medium text-red-500">{error}</p>
      ) : null}
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

function PlusIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconShell>
  );
}

function getInputClassName(hasError) {
  return `w-full rounded-2xl border px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
    hasError
      ? "border-red-200 bg-red-50/40 focus:border-red-300 focus:ring-red-100"
      : "border-blue-100 bg-slate-50 focus:border-blue-300 focus:ring-blue-100"
  }`;
}

export default HomeCategoryForm;
