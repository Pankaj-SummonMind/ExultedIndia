import { useEffect, useState } from "react";

const EMPTY_FEATURE = {
  label: "",
  detail: "",
};

const EMPTY_FORM = {
  id: "",
  title: "",
  points: [{ ...EMPTY_FEATURE }],
};

function HomeWhyChooseUs({ isOpen, onClose, activeWhyChooseUs, onSubmit }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    if (activeWhyChooseUs) {
      const normalizedPoints =
        Array.isArray(activeWhyChooseUs.points) &&
        activeWhyChooseUs.points.length > 0
          ? activeWhyChooseUs.points.map((item) => ({
              label: item?.label || item?.name || "",
              detail: item?.detail || item?.description || "",
            }))
          : [{ ...EMPTY_FEATURE }];

      setFormData({
        id: activeWhyChooseUs.id || activeWhyChooseUs._id || "",
        title: activeWhyChooseUs.title || "",
        points: normalizedPoints,
      });
    } else {
      setFormData({
        ...EMPTY_FORM,
        points: [{ ...EMPTY_FEATURE }],
      });
    }

    setFieldErrors({});
    setFormError("");

    return undefined;
  }, [activeWhyChooseUs, isOpen]);

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

  const updatePointField = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      points: prev.points.map((item, currentIndex) =>
        currentIndex === index ? { ...item, [field]: value } : item,
      ),
    }));

    const errorKey = `points.${index}.${field}`;

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

  const addFeatureBlock = () => {
    setFormData((prev) => ({
      ...prev,
      points: [...prev.points, { ...EMPTY_FEATURE }],
    }));
  };

  const removeFeatureBlock = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      points:
        prev.points.length === 1
          ? [{ ...EMPTY_FEATURE }]
          : prev.points.filter((_, index) => index !== indexToRemove),
    }));

    setFieldErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors[`points.${indexToRemove}.label`];
      delete nextErrors[`points.${indexToRemove}.detail`];
      return nextErrors;
    });
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    formData.points.forEach((item, index) => {
      if (!item.label.trim()) {
        nextErrors[`points.${index}.label`] =
          `Feature ${index + 1} name is required.`;
      }

      if (!item.detail.trim()) {
        nextErrors[`points.${index}.detail`] =
          `Feature ${index + 1} description is required.`;
      }
    });

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
    const trimmedPoints = formData.points.map((item) => ({
      label: item.label.trim(),
      detail: item.detail.trim(),
    }));

    const payload = new FormData();
    payload.append("title", trimmedTitle);
    payload.append("points", JSON.stringify(trimmedPoints));

    if (formData.id) {
      payload.append("id", formData.id);
    }

    try {
      setIsSubmitting(true);

      await onSubmit?.(payload, {
        id: formData.id,
        title: trimmedTitle,
        points: trimmedPoints,
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
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.20)]">
        <div className="border-b border-blue-100 bg-linear-to-r from-white via-blue-50 to-slate-50 px-5 py-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
            Home Page
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
            {activeWhyChooseUs ? "Update Why Choose Us" : "Add Why Choose Us"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Add a title and multiple feature blocks with short descriptions.
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
              htmlFor="why-choose-us-title"
            >
              <input
                id="why-choose-us-title"
                type="text"
                placeholder="Enter section title"
                value={formData.title}
                onChange={(event) => updateField("title", event.target.value)}
                className={getInputClassName(Boolean(fieldErrors.title))}
              />
            </FormField>

            <div className="rounded-[28px] border border-blue-100 bg-slate-50/80 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Feature Blocks
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Add feature name and a small description for each item.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addFeatureBlock}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Feature
                </button>
              </div>

              <div className="mt-5 flex max-h-96 flex-col gap-4 overflow-y-auto pr-1">
                {formData.points.map((item, index) => (
                  <div
                    key={`feature-${index}`}
                    className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
                          Feature {index + 1}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeFeatureBlock(index)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                          aria-label={`Delete feature ${index + 1}`}
                        >
                          <DeleteIcon className="h-4.5 w-4.5" />
                        </button>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                        <FormField
                          label="Feature Name"
                          htmlFor={`why-choose-us-feature-name-${index}`}
                          error={fieldErrors[`points.${index}.label`]}
                        >
                          <input
                            id={`why-choose-us-feature-name-${index}`}
                            type="text"
                            placeholder={`Enter feature ${index + 1} name`}
                            value={item.label}
                            onChange={(event) =>
                              updatePointField(index, "label", event.target.value)
                            }
                            className={getInputClassName(
                              Boolean(fieldErrors[`points.${index}.label`]),
                            )}
                          />
                        </FormField>

                        <FormField
                          label="Feature Description"
                          htmlFor={`why-choose-us-feature-detail-${index}`}
                          error={fieldErrors[`points.${index}.detail`]}
                        >
                          <textarea
                            id={`why-choose-us-feature-detail-${index}`}
                            rows={3}
                            placeholder={`Enter feature ${index + 1} description`}
                            value={item.detail}
                            onChange={(event) =>
                              updatePointField(index, "detail", event.target.value)
                            }
                            className={`${getInputClassName(
                              Boolean(fieldErrors[`points.${index}.detail`]),
                            )} resize-none`}
                          />
                        </FormField>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                  : activeWhyChooseUs
                    ? "Update Why Choose Us"
                    : "Save Why Choose Us"}
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

function getInputClassName(hasError) {
  return `w-full rounded-2xl border px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
    hasError
      ? "border-red-200 bg-red-50/40 focus:border-red-300 focus:ring-red-100"
      : "border-blue-100 bg-slate-50 focus:border-blue-300 focus:ring-blue-100"
  }`;
}

export default HomeWhyChooseUs;
