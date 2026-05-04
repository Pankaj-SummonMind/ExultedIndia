import { useEffect, useMemo, useState } from "react";
import {
  useCreateContactMutation,
  useUpdateContactMutation,
} from "../../../services/api";
import toast from "react-hot-toast";
import Loader from "../../loader/Loader";

const EMPTY_FORM = {
  mapLocation: "",
  phoneNumber: "",
  whatsappNumber: "",
  email: "",
  heading: "",
  detail: "",
  address: "",
};

function normalizeContactData(data) {
  return {
    id: data?._id || data?.id || "",
    mapLocation: data?.mapLocation || "",
    phoneNumber: data?.phoneNumber || "",
    whatsappNumber: data?.whatappNumber || data?.whatsappNumber || "",
    email: data?.email || "",
    heading: data?.heading || "",
    detail: data?.detail || "",
    address: data?.address || "",
  };
}

function ContactUsPageForm({
  mode = "create",
  initialData = null,
  onCancel,
  onSuccess,
}) {
  const normalizedInitialData = useMemo(
    () => normalizeContactData(initialData),
    [initialData],
  );
  const [createContact] = useCreateContactMutation();
  const [updateContact] = useUpdateContactMutation();
  const [formData, setFormData] = useState(() =>
    initialData ? normalizeContactData(initialData) : { ...EMPTY_FORM, id: "" },
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(
      initialData ? normalizeContactData(initialData) : { ...EMPTY_FORM, id: "" },
    );
    setFieldErrors({});
    setFormError("");
    setSuccessMessage("");
  }, [initialData]);

  const isUpdateMode = mode === "update";

  const clearFieldError = (field) => {
    if (!fieldErrors[field]) {
      return;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const clearMessages = () => {
    if (formError) {
      setFormError("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    clearFieldError(field);
    clearMessages();
  };

  const validateForm = () => {
    const nextErrors = {};

    Object.entries({
      mapLocation: "Map location is required.",
      phoneNumber: "Phone number is required.",
      whatsappNumber: "WhatsApp number is required.",
      email: "Email is required.",
      heading: "Heading is required.",
      detail: "Detail is required.",
      address: "Address is required.",
    }).forEach(([field, message]) => {
      if (!String(formData[field] || "").trim()) {
        nextErrors[field] = message;
      }
    });

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFormError("Please fill in all required fields before submitting.");
      setSuccessMessage("");
      return false;
    }

    return true;
  };

  const buildPayload = () => ({
    mapLocation: formData.mapLocation.trim(),
    phoneNumber: formData.phoneNumber.trim(),
    whatappNumber: formData.whatsappNumber.trim(),
    email: formData.email.trim(),
    heading: formData.heading.trim(),
    detail: formData.detail.trim(),
    address: formData.address.trim(),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isUpdateMode && !normalizedInitialData.id) {
      setFormError("Contact id not found for update.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError("");

      const payload = buildPayload();
      const response = isUpdateMode
        ? await updateContact({
            id: normalizedInitialData.id,
            body: payload,
          }).unwrap()
        : await createContact(payload).unwrap();

      setFieldErrors({});
      setSuccessMessage(
        isUpdateMode
          ? "Contact content updated successfully."
          : "Contact content created successfully.",
      );

      if (onSuccess) {
        onSuccess(response?.data || response);
      }
      toast.success(response?.message || "Contact created successfully.");
    } catch (error) {
      setSuccessMessage("");
      setFormError(
        error?.data?.message || error?.message || "Something went wrong.",
      );
      toast.error(error?.data?.message || error?.message || "Failed to create contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#f4fbff_0%,#f8fafc_30%,#ffffff_100%)] px-4 py-6 sm:px-5 lg:px-6">
      <Loader isLoading={isSubmitting} />
      <div className="mx-auto max-w-6xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {formError ? <MessageBanner tone="error">{formError}</MessageBanner> : null}
          {successMessage ? (
            <MessageBanner tone="success">{successMessage}</MessageBanner>
          ) : null}

          <SectionCard
            eyebrow="Contact Page"
            title={isUpdateMode ? "Update contact content" : "Create contact content"}
            description="Map location, contact details, heading, detail, aur address yahin se manage honge."
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <FormField
                label="Map Location URL"
                htmlFor="contact-map-location"
                error={fieldErrors.mapLocation}
              >
                <input
                  id="contact-map-location"
                  type="url"
                  value={formData.mapLocation}
                  onChange={(event) =>
                    updateField("mapLocation", event.target.value)
                  }
                  placeholder="https://maps.google.com/..."
                  className={getInputClassName(Boolean(fieldErrors.mapLocation))}
                />
              </FormField>

              <FormField
                label="Phone Number"
                htmlFor="contact-phone-number"
                error={fieldErrors.phoneNumber}
              >
                <input
                  id="contact-phone-number"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(event) =>
                    updateField("phoneNumber", event.target.value)
                  }
                  placeholder="Enter phone number"
                  className={getInputClassName(Boolean(fieldErrors.phoneNumber))}
                />
              </FormField>

              <FormField
                label="WhatsApp Number"
                htmlFor="contact-whatsapp-number"
                error={fieldErrors.whatsappNumber}
              >
                <input
                  id="contact-whatsapp-number"
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(event) =>
                    updateField("whatsappNumber", event.target.value)
                  }
                  placeholder="Enter WhatsApp number"
                  className={getInputClassName(Boolean(fieldErrors.whatsappNumber))}
                />
              </FormField>

              <FormField
                label="Email"
                htmlFor="contact-email"
                error={fieldErrors.email}
              >
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="Enter email address"
                  className={getInputClassName(Boolean(fieldErrors.email))}
                />
              </FormField>

              <div className="lg:col-span-2">
                <FormField
                  label="Heading"
                  htmlFor="contact-heading"
                  error={fieldErrors.heading}
                >
                  <input
                    id="contact-heading"
                    type="text"
                    value={formData.heading}
                    onChange={(event) => updateField("heading", event.target.value)}
                    placeholder="Enter contact page heading"
                    className={getInputClassName(Boolean(fieldErrors.heading))}
                  />
                </FormField>
              </div>

              <div className="lg:col-span-2">
                <FormField
                  label="Detail"
                  htmlFor="contact-detail"
                  error={fieldErrors.detail}
                >
                  <textarea
                    id="contact-detail"
                    rows={5}
                    value={formData.detail}
                    onChange={(event) => updateField("detail", event.target.value)}
                    placeholder="Write contact page detail"
                    className={`${getInputClassName(Boolean(fieldErrors.detail))} resize-none`}
                  />
                </FormField>
              </div>

              <div className="lg:col-span-2">
                <FormField
                  label="Address"
                  htmlFor="contact-address"
                  error={fieldErrors.address}
                >
                  <textarea
                    id="contact-address"
                    rows={4}
                    value={formData.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    placeholder="Enter full address"
                    className={`${getInputClassName(Boolean(fieldErrors.address))} resize-none`}
                  />
                </FormField>
              </div>
            </div>
          </SectionCard>

          <div className="sticky bottom-4 z-10">
            <div className="rounded-[28px] border border-sky-100 bg-white/94 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Ready to {isUpdateMode ? "update" : "create"} Contact page content?
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {onCancel ? (
                    <button
                      type="button"
                      onClick={onCancel}
                      className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
                    >
                      Cancel
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-sky-600 px-6 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300 disabled:shadow-none"
                  >
                    {isSubmitting
                      ? isUpdateMode
                        ? "Updating..."
                        : "Creating..."
                      : isUpdateMode
                        ? "Update Contact"
                        : "Create Contact"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function SectionCard({ eyebrow, title, description, children }) {
  return (
    <section className="overflow-hidden rounded-4xl border border-slate-200/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200/80 bg-linear-to-r from-white via-slate-50 to-sky-50 px-5 py-5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
          {title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
          {description}
        </p>
      </div>

      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
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

function MessageBanner({ tone = "error", children }) {
  const toneClassName =
    tone === "success"
      ? "border-emerald-100 bg-emerald-50 text-emerald-600"
      : "border-red-100 bg-red-50 text-red-500";

  return (
    <div
      className={`rounded-3xl border px-4 py-4 text-sm font-medium ${toneClassName}`}
    >
      {children}
    </div>
  );
}

function getInputClassName(hasError) {
  return `w-full rounded-2xl border px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
    hasError
      ? "border-red-200 bg-red-50/40 focus:border-red-300 focus:ring-red-100"
      : "border-sky-100 bg-slate-50 focus:border-sky-300 focus:ring-sky-100"
  }`;
}

export default ContactUsPageForm;
