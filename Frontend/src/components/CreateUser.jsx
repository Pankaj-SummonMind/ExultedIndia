import { useEffect, useState } from "react";
import { useRegisterUserMutation } from "../services/api";
import toast from "react-hot-toast";
import Loader from "./loader/Loader";

const initialFormState = {
  name: "",
  mobileNumber: "",
  email: "",
  message: "",
};

const initialErrorState = {
  name: "",
  mobileNumber: "",
  email: "",
  message: "",
};

function CreateUser({
  isOpen = true,
  onClose = () => {},
  setIsCreateModalOpen,
}) {
  const [registerUser, { isLoading}] = useRegisterUserMutation();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormState);
      setErrors(initialErrorState);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {
      name: formData.name.trim() ? "" : "Name is required.",
      mobileNumber: formData.mobileNumber.trim()
        ? ""
        : "Mobile number is required.",
      email: formData.email.trim() ? "" : "Email is required.",
      message: formData.message.trim() ? "" : "Message is required.",
    };

    if (
      formData.mobileNumber.trim() &&
      !/^\d{10,15}$/.test(formData.mobileNumber.trim())
    ) {
      nextErrors.mobileNumber =
        "Enter a valid mobile number with 10 to 15 digits.";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors(initialErrorState);
  };

  const handleCancel = () => {
    resetForm();
    setIsCreateModalOpen?.(false);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    };

    try {
      const response = await registerUser(payload).unwrap();
      toast.success(response?.message || "User created successfully!");
      resetForm();
      setIsCreateModalOpen?.(false);
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create user. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* <Loader isLoading={isLoading} /> */}
      <button
        type="button"
        aria-label="Close create user modal"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur"
        onClick={handleCancel}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-4xl border border-blue-100 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.22)]">
        <div className="border-b border-blue-100 bg-linear-to-r from-white via-blue-50 to-slate-50 px-4 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            
            <div className="flex-1 text-left sm:pt-1">

              <h2 className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
                Create User
              </h2>

            </div>

            <button
              type="button"
              aria-label="Cancel create user"
              onClick={handleCancel}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-white text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
            <div className="grid gap-5 md:grid-cols-2">
              <FieldShell
                label="Name"
                htmlFor="userName"
                error={errors.name}
              >
                <input
                  id="userName"
                  type="text"
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className={getInputClassName(Boolean(errors.name))}
                />
              </FieldShell>

              <FieldShell
                label="Mobile Number"
                htmlFor="mobileNumber"
                error={errors.mobileNumber}
              >
                <input
                  id="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(event) =>
                    updateField("mobileNumber", event.target.value)
                  }
                  placeholder="e.g. 9876543210"
                  className={getInputClassName(Boolean(errors.mobileNumber))}
                />
              </FieldShell>

              <div className="md:col-span-2">
                <FieldShell
                  label="Email"
                  htmlFor="email"
                  error={errors.email}
                >
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="e.g. aarav@example.com"
                    className={getInputClassName(Boolean(errors.email))}
                  />
                </FieldShell>
              </div>

              <div className="md:col-span-2">
                <FieldShell
                  label="Message"
                  htmlFor="message"
                  error={errors.message}
                >
                  <textarea
                    id="message"
                    rows="6"
                    value={formData.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    placeholder="Write your message here..."
                    className={[
                      getInputClassName(Boolean(errors.message)),
                      "resize-none leading-6",
                    ].join(" ")}
                  />
                </FieldShell>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-blue-100 bg-white px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-2xl bg-blue-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:shadow-none"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldShell({ label, htmlFor, error, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-2 text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}

function getInputClassName(hasError) {
  return [
    "w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4",
    hasError
      ? "border-red-200 focus:border-red-300 focus:ring-red-100"
      : "border-blue-100 focus:border-blue-300 focus:ring-blue-100",
  ].join(" ");
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

export default CreateUser;
