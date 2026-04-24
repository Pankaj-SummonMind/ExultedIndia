import { useEffect, useMemo, useState } from "react";
import {
  useAddProductMutation,
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
  useUpdateProductMutation,
} from "../services/api";

const initialFormState = {
  id: "",
  productName: "",
  category: "",
  subCategory: "",
  description: "",
  features: [""],
  specifications: [{ key: "", value: "" }],
  images: [],
};

function CreateProduct({
  onShowList,
  isOpen,
  onClose,
  setIsCreateModalOpen,
  mode = "create",
  initialData = null,
}) {
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdateLoading }] =
  useUpdateProductMutation();
  const { data: categoryData } = useGetCategoriesQuery();
  const { data: subCategoryData } = useGetSubCategoriesQuery();
  console.log("category data:", categoryData);
  console.log("subCategory Data", subCategoryData);

  const [formData, setFormData] = useState(initialFormState);
  const [categorySearch, setCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  console.log("initial data ", initialData);

  const categoryOptions = useMemo(
    () =>
      categoryData?.data?.map((item) => ({
        ...item,
        categories_name: item.categories_name || item.name || "",
      })) || [],
    [categoryData],
  );

  const subCategoryOptions = useMemo(
    () =>
      subCategoryData?.data?.map((item) => ({
        ...item,
        name: item.name || item.subCategories_Name || "",
        category_Id: item.category_Id
          ? {
              ...item.category_Id,
              _id: item.category_Id?._id || "",
              categories_name:
                item.category_Id?.categories_name || item.category_Id?.name || "",
            }
          : null,
      })) || [],
    [subCategoryData],
  );

  useEffect(() => {
    if (mode === "update" && initialData) {
      setFormData({
        id: initialData._id || "",
        productName: initialData.product_name || "",
        category: initialData.product_category?._id || "",
        subCategory: initialData.product_subCategory?._id || "",
        description: initialData.description || "",
        features:
          initialData.features?.length > 0 ? initialData.features : [""],
        specifications:
          initialData.specifications?.length > 0
            ? initialData.specifications.map((item) => ({
                key: item.key || "",
                value: item.value || "",
              }))
            : [{ key: "", value: "" }],
        images: initialData.images || [],
      });

      setCategorySearch(initialData.product_category?.categories_name || "");

      setSubCategorySearch(initialData.product_subCategory?.name || "");
    }

    if (mode === "create") {
      setFormData(initialFormState);
      setCategorySearch("");
      setSubCategorySearch("");
    }
  }, [mode, initialData]);

  const filteredCategories = useMemo(() => {
    return categoryOptions.filter((item) =>
      item.categories_name.toLowerCase().includes(categorySearch.toLowerCase()),
    );
  }, [categoryOptions, categorySearch]);

  const availableSubCategories = useMemo(() => {
    return subCategoryOptions.filter(
      (item) => item.category_Id?._id === formData.category,
    );
  }, [subCategoryOptions, formData.category]);

  const filteredSubCategories = useMemo(() => {
    return availableSubCategories.filter((item) =>
      item.name.toLowerCase().includes(subCategorySearch.toLowerCase()),
    );
  }, [availableSubCategories, subCategorySearch]);

  const canAddFeature = useMemo(
    () => formData.features.every((item) => item.trim() !== ""),
    [formData.features],
  );

  const canAddSpecification = useMemo(
    () =>
      formData.specifications.every(
        (item) => item.key.trim() !== "" && item.value.trim() !== "",
      ),
    [formData.specifications],
  );

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleCategorySelect = (item) => {
    setFormData((current) => ({
      ...current,
      category: item._id,
      subCategory: "",
    }));

    setCategorySearch(item.categories_name);
    setSubCategorySearch("");
    setIsCategoryOpen(false);
  };

  const handleSubCategorySelect = (item) => {
    setFormData((current) => ({
      ...current,
      subCategory: item._id,
    }));

    setSubCategorySearch(item.name);
    setIsSubCategoryOpen(false);
  };

  const handleFeatureChange = (index, value) => {
    setFormData((current) => ({
      ...current,
      features: current.features.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  };

  const addFeature = () => {
    if (!canAddFeature) {
      return;
    }

    setFormData((current) => ({
      ...current,
      features: [...current.features, ""],
    }));
  };

  const removeFeature = (indexToRemove) => {
    setFormData((current) => ({
      ...current,
      features:
        current.features.length === 1
          ? [""]
          : current.features.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSpecificationChange = (index, field, value) => {
    setFormData((current) => ({
      ...current,
      specifications: current.specifications.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addSpecification = () => {
    if (!canAddSpecification) {
      return;
    }

    setFormData((current) => ({
      ...current,
      specifications: [...current.specifications, { key: "", value: "" }],
    }));
  };

  const removeSpecification = (indexToRemove) => {
    setFormData((current) => ({
      ...current,
      specifications:
        current.specifications.length === 1
          ? [{ key: "", value: "" }]
          : current.specifications.filter(
              (_, index) => index !== indexToRemove,
            ),
    }));
  };

  const handleImagesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    updateField("images", selectedFiles);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = new FormData();

      payload.append("product_name", formData.productName.trim());
      payload.append("product_category", formData.category);
      payload.append("product_subCategory", formData.subCategory);
      payload.append("description", formData.description.trim());

      // features
      formData.features
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => {
          payload.append("features[]", item);
        });

      // specifications
      formData.specifications
        .filter((item) => item.key.trim() && item.value.trim())
        .forEach((item) => {
          payload.append(
            "specifications[]",
            JSON.stringify({
              key: item.key.trim(),
              value: item.value.trim(),
            }),
          );
        });

      // images
      formData.images.forEach((file) => {
        payload.append("images", file);
      });

      // CREATE
      if (mode === "create") {
        const res = await addProduct(payload).unwrap();
        console.log("Created:", res);
      }

      // UPDATE
      if (mode === "update") {
        const res = await updateProduct({
          id: formData.id,
          body: payload,
        }).unwrap();

        console.log("Updated:", res);
      }

      onShowList();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <div className="rounded-4xl border border-blue-100 bg-linear-to-br from-white via-blue-50 to-slate-50 p-5 shadow-[0_18px_45px_rgba(59,130,246,0.10)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
              Product Workspace
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">
              {mode === "create" ? "Create Product" : "Update Product"}
            </h1>
            {/* <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
              Build a complete product entry with searchable category fields,
              rich description, repeatable features, specifications, and
              multiple images in one clean responsive form.
            </p> */}
          </div>

          <button
            type="button"
            onClick={onShowList}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
          >
            <ListIcon className="h-5 w-5" />
            {mode === "create" ? "Show List" : "Show Detail"}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-4xl border border-blue-100 bg-white p-4 shadow-[0_20px_50px_rgba(148,163,184,0.12)] sm:p-6"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <FieldShell
            label="Product Name"
            htmlFor="productName"
            // helperText="Add a clean and customer-friendly product title."
          >
            <input
              id="productName"
              type="text"
              value={formData.productName}
              onChange={(event) =>
                updateField("productName", event.target.value)
              }
              placeholder="e.g. iPhone 15 Pro"
              className="w-full rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </FieldShell>

          <SearchableSelect
            id="productCategory"
            label="Product Category"
            // helperText="Search and select the best matching category."
            searchValue={categorySearch}
            selectedValue={formData.category}
            placeholder="Search category..."
            isOpen={isCategoryOpen}
            setIsOpen={setIsCategoryOpen}
            onSearchChange={(value) => {
              setCategorySearch(value);
              if (formData.category) {
                updateField("category", "");
                updateField("subCategory", "");
                setSubCategorySearch("");
              }
            }}
            options={filteredCategories}
            onSelect={handleCategorySelect}
            emptyLabel="No category found"
          />

          <SearchableSelect
            id="productSubCategory"
            label="Sub Category"
            // helperText="Search within the selected category."
            searchValue={subCategorySearch}
            selectedValue={formData.subCategory}
            placeholder={
              formData.category
                ? "Search sub category..."
                : "Select category first"
            }
            isOpen={isSubCategoryOpen}
            setIsOpen={setIsSubCategoryOpen}
            onSearchChange={(value) => {
              setSubCategorySearch(value);
              if (formData.subCategory) {
                updateField("subCategory", "");
              }
            }}
            options={filteredSubCategories}
            onSelect={handleSubCategorySelect}
            emptyLabel="No sub category found"
            disabled={!formData.category}
          />

          <FieldShell
            label="Product Image"
            htmlFor="productImages"
            // helperText="Select one or more product images."
          >
            <label
              htmlFor="productImages"
              className="flex min-h-30 cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-blue-200 bg-slate-50 px-4 py-5 text-center transition hover:border-blue-300 hover:bg-blue-50"
            >
              <ImageIcon className="h-8 w-8 text-blue-400" />
              <p className="mt-3 text-sm font-semibold text-slate-700">
                Choose Product Images
              </p>
              <p className="mt-1 text-sm text-slate-500">
                PNG, JPG, WEBP and multiple files supported
              </p>
              <input
                id="productImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="hidden"
              />
            </label>

            {formData.images.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.images.map((file, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                  >
                    {file.name}
                    {mode === "create" ? `${file.name}` : `${file.url}`}
                  </span>
                ))}
              </div>
            ) : null}
          </FieldShell>
        </div>

        <FieldShell
          label="Description"
          htmlFor="productDescription"
          //   helperText="Use this area for a longer and more detailed description."
        >
          <textarea
            id="productDescription"
            rows="6"
            value={formData.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Write a detailed product description..."
            className="w-full resize-none rounded-[28px] border border-blue-100 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </FieldShell>

        <DynamicPanel
          title="Features"
          //   description="Add multiple product features with the same smooth add/remove flow."
          actionLabel="Add More"
          actionIcon={<PlusIcon className="h-4 w-4" />}
          onAction={addFeature}
          disabled={!canAddFeature}
        >
          <div className="flex max-h-80 flex-col gap-4 overflow-y-auto pr-1">
            {formData.features.map((feature, index) => (
              <div
                key={`feature-${index}`}
                className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label
                      htmlFor={`feature-${index}`}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      {`Feature ${index + 1}`}
                    </label>
                    <input
                      id={`feature-${index}`}
                      type="text"
                      value={feature}
                      onChange={(event) =>
                        handleFeatureChange(index, event.target.value)
                      }
                      placeholder={`Enter feature ${index + 1}`}
                      className="w-full rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <DeleteButton
                    label={`Delete feature ${index + 1}`}
                    onClick={() => removeFeature(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </DynamicPanel>

        <DynamicPanel
          title="Specifications"
          //   description="Create key-value specification pairs for technical details."
          actionLabel="Add More"
          actionIcon={<PlusIcon className="h-4 w-4" />}
          onAction={addSpecification}
          disabled={!canAddSpecification}
        >
          <div className="flex max-h-80 flex-col gap-4 overflow-y-auto pr-1">
            {formData.specifications.map((item, index) => (
              <div
                key={`specification-${index}`}
                className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm"
              >
                <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
                  <div>
                    <label
                      htmlFor={`specification-key-${index}`}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      {`Key ${index + 1}`}
                    </label>
                    <input
                      id={`specification-key-${index}`}
                      type="text"
                      value={item.key}
                      onChange={(event) =>
                        handleSpecificationChange(
                          index,
                          "key",
                          event.target.value,
                        )
                      }
                      placeholder="e.g. Display"
                      className="w-full rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`specification-value-${index}`}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      {`Value ${index + 1}`}
                    </label>
                    <input
                      id={`specification-value-${index}`}
                      type="text"
                      value={item.value}
                      onChange={(event) =>
                        handleSpecificationChange(
                          index,
                          "value",
                          event.target.value,
                        )
                      }
                      placeholder="e.g. 6.1 inch OLED"
                      className="w-full rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div className="flex items-end">
                    <DeleteButton
                      label={`Delete specification ${index + 1}`}
                      onClick={() => removeSpecification(index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DynamicPanel>

        <div className="flex flex-col-reverse gap-3 border-t border-blue-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onShowList}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
          >
            {mode === "create" ? "Submit Product" : "Update Product"}
          </button>
        </div>
      </form>
    </section>
  );
}

function SearchableSelect({
  id,
  label,
  helperText,
  searchValue,
  selectedValue,
  placeholder,
  isOpen,
  setIsOpen,
  onSearchChange,
  options,
  onSelect,
  emptyLabel,
  disabled = false,
}) {
  return (
    <FieldShell label={label} htmlFor={id} helperText={helperText}>
      <div className="relative">
        <div className="relative">
          <input
            id={id}
            type="text"
            value={searchValue}
            disabled={disabled}
            onFocus={() => {
              if (!disabled) {
                setIsOpen(true);
              }
            }}
            onChange={(event) => {
              onSearchChange(event.target.value);
              if (!disabled) {
                setIsOpen(true);
              }
            }}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          />

          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen((current) => !current)}
            className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-xl p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed"
          >
            <ChevronIcon
              className={[
                "h-4 w-4 transition",
                isOpen ? "rotate-180" : "",
              ].join(" ")}
            />
          </button>
        </div>

        {isOpen && !disabled ? (
          <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 max-h-64 overflow-y-auto rounded-3xl border border-blue-100 bg-white p-2 shadow-[0_18px_50px_rgba(148,163,184,0.22)]">
            {options.length > 0 ? (
              options.map((item) => {
                const isSelected = selectedValue === item._id;

                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => onSelect(item)}
                    className={[
                      "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition",
                      isSelected
                        ? "bg-blue-400 text-white"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                    ].join(" ")}
                  >
                    <span>{item.categories_name || item.name}</span>
                    {isSelected ? <CheckIcon className="h-4 w-4" /> : null}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-slate-400">
                {emptyLabel}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </FieldShell>
  );
}

function DynamicPanel({
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  disabled,
  children,
}) {
  return (
    <div className="rounded-[28px] border border-blue-100 bg-slate-50/80 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700">{title}</p>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>

        <button
          type="button"
          onClick={onAction}
          disabled={disabled}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:shadow-none"
        >
          {actionIcon}
          {actionLabel}
        </button>
      </div>

      <div className="mt-5">{children}</div>
    </div>
  );
}

function DeleteButton({ label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-12 w-12 items-center justify-center self-end rounded-2xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
    >
      <DeleteIcon className="h-5 w-5" />
    </button>
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

function PlusIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
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

function CheckIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m5 12 5 5L20 7" />
    </IconShell>
  );
}

function ChevronIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m6 9 6 6 6-6" />
    </IconShell>
  );
}

function ImageIcon({ className }) {
  return (
    <IconShell className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </IconShell>
  );
}

function ListIcon({ className }) {
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

export default CreateProduct;
