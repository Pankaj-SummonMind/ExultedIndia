import { useEffect, useRef, useState } from "react";

const EMPTY_STATS = [
  { key: "", value: "" },
  { key: "", value: "" },
  { key: "", value: "" },
];

const EMPTY_FORM = {
  id: "",
  title: "",
  stats: EMPTY_STATS,
  image: null,
  previewUrl: "",
};

function HeroDetailForm({ isOpen, onClose, activeHeroDetail, onSubmit }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    if (activeHeroDetail) {
      const incomingStats = Array.isArray(activeHeroDetail.stats)
        ? activeHeroDetail.stats.slice(0, 3)
        : [];
      const normalizedStats = Array.from({ length: 3 }, (_, index) => ({
        key: incomingStats[index]?.key || "",
        value: incomingStats[index]?.value || "",
      }));
      const previewUrl =
        activeHeroDetail.image?.url || activeHeroDetail.image || "";

      setFormData({
        id: activeHeroDetail.id || "",
        title: activeHeroDetail.title || "",
        stats: normalizedStats,
        image: null,
        previewUrl,
      });
    } else {
      setFormData({
        ...EMPTY_FORM,
        stats: EMPTY_STATS.map((item) => ({ ...item })),
      });
    }

    setFieldErrors({});
    setFormError("");

    return undefined;
  }, [activeHeroDetail, isOpen]);

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

  const updateStatField = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.map((item, currentIndex) =>
        currentIndex === index ? { ...item, [field]: value } : item,
      ),
    }));

    const errorKey = `stats.${index}.${field}`;

    if (fieldErrors[errorKey]) {
      setFieldErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }

    if (formError) {
      setFormError("");
    }
  };

  const handleImageChange = (event) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  // ✅ TYPE VALIDATION
  if (!file.type.startsWith("image/")) {
    setFormError("Please select a valid image file.");
    setFieldErrors((prev) => ({
      ...prev,
      image: "Please select a valid image file.",
    }));
    return;
  }

  // ✅ SIZE VALIDATION
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  if (file.size > MAX_SIZE) {
    setFormError("Image must be less than 10MB.");
    setFieldErrors((prev) => ({
      ...prev,
      image: "Image must be less than 10MB.",
    }));
    return;
  }

  // ✅ REVOKE OLD PREVIEW (memory leak fix)
  if (formData.previewUrl) {
    URL.revokeObjectURL(formData.previewUrl);
  }

  const previewUrl = URL.createObjectURL(file);

  setFormData((prev) => ({
    ...prev,
    image: file,
    previewUrl,
  }));

  setFieldErrors((prev) => ({
    ...prev,
    image: "",
  }));

  setFormError("");
};

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    formData.stats.forEach((item, index) => {
      if (!item.key.trim()) {
        nextErrors[`stats.${index}.key`] = `Stat ${index + 1} key is required.`;
      }

      if (!item.value.trim()) {
        nextErrors[`stats.${index}.value`] =
          `Stat ${index + 1} value is required.`;
      }
    });

    if (!formData.previewUrl && !formData.image) {
      nextErrors.image = "Image is required.";
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFormError("Please fill in all required fields before submitting.");
      return false;
    }

    return true;
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const trimmedTitle = formData.title.trim();
    const trimmedStats = formData.stats.map((item) => ({
      key: item.key.trim(),
      value: item.value.trim(),
    }));

    const payload = new FormData();
    payload.append("title", trimmedTitle);
    payload.append("stats", JSON.stringify(trimmedStats));

    if (formData.id) {
      payload.append("id", formData.id);
    }

    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      setIsSubmitting(true);

      await onSubmit?.(payload, {
        id: formData.id,
        title: trimmedTitle,
        stats: trimmedStats,
        image: formData.image,
        previewUrl: formData.previewUrl,
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
            {activeHeroDetail ? "Update Hero Detail" : "Add Hero Detail"}
          </h2>
          
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <FormField
              label="Title"
              error={fieldErrors.title}
              htmlFor="hero-detail-title"
            >
              <input
                id="hero-detail-title"
                type="text"
                placeholder="Enter hero detail title"
                value={formData.title}
                onChange={(event) => updateField("title", event.target.value)}
                className={getInputClassName(Boolean(fieldErrors.title))}
              />
            </FormField>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">Stats</p>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  Exactly 3 Stats are required.
                </p>
              </div>

              {formData.stats.map((item, index) => (
                <div
                  key={`stat-${index + 1}`}
                  className="rounded-3xl border border-blue-100 bg-slate-50/80 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
                    Stat {index + 1}
                  </p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="Key"
                      htmlFor={`hero-detail-stat-key-${index}`}
                      error={fieldErrors[`stats.${index}.key`]}
                    >
                      <input
                        id={`hero-detail-stat-key-${index}`}
                        type="text"
                        placeholder={`Enter stat ${index + 1} key`}
                        value={item.key}
                        onChange={(event) =>
                          updateStatField(index, "key", event.target.value)
                        }
                        className={getInputClassName(
                          Boolean(fieldErrors[`stats.${index}.key`]),
                        )}
                      />
                    </FormField>

                    <FormField
                      label="Value"
                      htmlFor={`hero-detail-stat-value-${index}`}
                      error={fieldErrors[`stats.${index}.value`]}
                    >
                      <input
                        id={`hero-detail-stat-value-${index}`}
                        type="text"
                        placeholder={`Enter stat ${index + 1} value`}
                        value={item.value}
                        onChange={(event) =>
                          updateStatField(index, "value", event.target.value)
                        }
                        className={getInputClassName(
                          Boolean(fieldErrors[`stats.${index}.value`]),
                        )}
                      />
                    </FormField>
                  </div>
                </div>
              ))}
            </div>

            <FormField label="Hero Detail Image" error={fieldErrors.image}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />

              <div
                onClick={triggerFileInput}
                className={`group flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-slate-50 transition ${
                  fieldErrors.image
                    ? "border-red-200 bg-red-50/40"
                    : "border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                {formData.previewUrl ? (
                  <div className="w-full space-y-4 p-4">
                    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white">
                      <img
                        src={formData.previewUrl}
                        alt="Hero detail preview"
                        className="h-56 w-full object-cover sm:h-64"
                      />
                    </div>
                    <p className="text-center text-sm font-medium text-slate-500">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div className="flex min-h-56 flex-col items-center justify-center px-6 py-8 text-center">
                    <UploadIllustration />
                    <p className="mt-4 text-sm font-semibold text-slate-700">
                      Image must be less then 10 mb,
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-400">
                      PNG, JPG, WEBP or any image format
                    </p>
                  </div>
                )}
              </div>
            </FormField>

            {formError && (
              <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
                {formError}
              </p>
            )}
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
                  : activeHeroDetail
                    ? "Update Hero Detail"
                    : "Save Hero Detail"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
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

function UploadIllustration() {
  return (
    <svg
      className="h-9 w-9 text-blue-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function getInputClassName(hasError) {
  return `w-full rounded-2xl border px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
    hasError
      ? "border-red-200 bg-red-50/40 focus:border-red-300 focus:ring-red-100"
      : "border-blue-100 bg-white focus:border-blue-300 focus:ring-blue-100"
  }`;
}

export default HeroDetailForm;
