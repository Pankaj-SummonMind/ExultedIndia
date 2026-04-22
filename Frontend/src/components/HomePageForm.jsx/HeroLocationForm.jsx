import { useEffect, useState } from "react";

const EMPTY_FORM = {
  id: "",
  title: "",
  detail: "",
  locations: [""],
};

function HeroLocationForm({ isOpen, onClose, activeHeroLocation, onSubmit }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    if (activeHeroLocation) {
      const normalizedLocations =
        Array.isArray(activeHeroLocation.locations) &&
        activeHeroLocation.locations.length > 0
          ? activeHeroLocation.locations.map((item) => `${item || ""}`)
          : [""];

      setFormData({
        id: activeHeroLocation.id || activeHeroLocation._id || "",
        title: activeHeroLocation.title || "",
        detail: activeHeroLocation.detail || activeHeroLocation.description || "",
        locations: normalizedLocations,
      });
    } else {
      setFormData({
        ...EMPTY_FORM,
        locations: [""],
      });
    }

    setFieldErrors({});
    setFormError("");

    return undefined;
  }, [activeHeroLocation, isOpen]);

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

  const updateLocation = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.map((item, currentIndex) =>
        currentIndex === index ? value : item,
      ),
    }));

    const errorKey = `locations.${index}`;

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

  const addLocation = () => {
    setFormData((prev) => ({
      ...prev,
      locations: [...prev.locations, ""],
    }));
  };

  const removeLocation = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      locations:
        prev.locations.length === 1
          ? [""]
          : prev.locations.filter((_, index) => index !== indexToRemove),
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!formData.detail.trim()) {
      nextErrors.detail = "Detail is required.";
    }

    formData.locations.forEach((item, index) => {
      if (!item.trim()) {
        nextErrors[`locations.${index}`] =
          `Location ${index + 1} is required.`;
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
    const trimmedDetail = formData.detail.trim();
    const trimmedLocations = formData.locations.map((item) => item.trim());

    const payload = new FormData();
    payload.append("title", trimmedTitle);
    payload.append("detail", trimmedDetail);
    payload.append("locations", JSON.stringify(trimmedLocations));

    if (formData.id) {
      payload.append("id", formData.id);
    }

    try {
      setIsSubmitting(true);

      await onSubmit?.(payload, {
        id: formData.id,
        title: trimmedTitle,
        detail: trimmedDetail,
        locations: trimmedLocations,
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
            {activeHeroLocation ? "Update Locations" : "Add Locations"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage the title, detail, and multiple service locations for this
            section.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <FormField
              label="Title"
              htmlFor="hero-location-title"
              error={fieldErrors.title}
            >
              <input
                id="hero-location-title"
                type="text"
                placeholder="Enter section title"
                value={formData.title}
                onChange={(event) => updateField("title", event.target.value)}
                className={getInputClassName(Boolean(fieldErrors.title))}
              />
            </FormField>

            <FormField
              label="Detail"
              htmlFor="hero-location-detail"
              error={fieldErrors.detail}
            >
              <textarea
                id="hero-location-detail"
                rows={4}
                placeholder="Write section detail"
                value={formData.detail}
                onChange={(event) => updateField("detail", event.target.value)}
                className={`${getInputClassName(Boolean(fieldErrors.detail))} resize-none`}
              />
            </FormField>

            <div className="rounded-[28px] border border-blue-100 bg-slate-50/80 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Locations
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Add all required locations. These will be saved as an array.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addLocation}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Location
                </button>
              </div>

              <div className="mt-5 flex max-h-96 flex-col gap-4 overflow-y-auto pr-1">
                {formData.locations.map((location, index) => (
                  <div
                    key={`location-${index}`}
                    className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                      <div className="flex-1">
                        <FormField
                          label={`Location ${index + 1}`}
                          htmlFor={`hero-location-${index}`}
                          error={fieldErrors[`locations.${index}`]}
                        >
                          <input
                            id={`hero-location-${index}`}
                            type="text"
                            placeholder={`Enter location ${index + 1}`}
                            value={location}
                            onChange={(event) =>
                              updateLocation(index, event.target.value)
                            }
                            className={getInputClassName(
                              Boolean(fieldErrors[`locations.${index}`]),
                            )}
                          />
                        </FormField>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeLocation(index)}
                        className="inline-flex h-12 w-12 items-center justify-center self-end rounded-2xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                        aria-label={`Delete location ${index + 1}`}
                      >
                        <DeleteIcon className="h-5 w-5" />
                      </button>
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
                  : activeHeroLocation
                    ? "Update Locations"
                    : "Save Locations"}
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

export default HeroLocationForm;
