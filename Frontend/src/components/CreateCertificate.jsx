import { useEffect, useState, useRef } from "react";
import {
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
} from "../services/api";
import toast from "react-hot-toast";
import Loader from "./loader/Loader";
// import {
//   useCreateCertificateMutation,
//   useUpdateCertificateMutation,
// } from "../services/api";

const EMPTY_FORM = {
  id: "",
  name: "",
  image: null,
  previewUrl: "",
};

function CreateCertificate({ isOpen, onClose, activeCertificate }) {
  const [createCertificate, { isLoading: isCreateLoading }] =
    useCreateCertificateMutation();
  const [updateCertificate, { isLoading: isUpdateLoading }] =
    useUpdateCertificateMutation();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);

  const isSubmitting = isCreateLoading || isUpdateLoading;

  useEffect(() => {
    if (activeCertificate) {
      setFormData({
        id: activeCertificate.id,
        name: activeCertificate.name,
        image: null, // Don't set File object, we only have URL initially
        previewUrl: activeCertificate.image.url || "",
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setFormError("");
  }, [activeCertificate, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // ✅ TYPE VALIDATION
  if (!file.type.startsWith("image/")) {
    setFormError("Please select a valid image file.");
    return;
  }

  // ✅ SIZE VALIDATION
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  if (file.size > MAX_SIZE) {
    setFormError("Image must be less than 10MB.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setFormError("Certificate name is required");
      return;
    }
    if (!activeCertificate && !formData.image) {
      setFormError("An image is required for new certificates");
      return;
    }

    try {
      // Using FormData because we are uploading a file
      const submitData = new FormData();
      submitData.append("certificate_name", trimmedName);
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      if (activeCertificate) {
        submitData.append("id", formData.id);
        // Note: Depending on your RTK setup, you might need to pass { id: formData.id, data: submitData }
        const res = await updateCertificate(submitData).unwrap();
        toast.success(res?.message || "Certificate updated successfully");
      } else {
        const res = await createCertificate(submitData).unwrap();
        toast.success(res?.message || "Certificate created successfully");
      }

      onClose();
    } catch (error) {
      toast.error(error?.data?.message || error.message || "Failed to save certificate. Please try again.");
      setFormError(
        error?.data?.message || error.message || "Something went wrong",
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[3px]">
      <Loader isLoading={isSubmitting} />
      <div className="w-full max-w-lg overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.20)]">
        <div className="border-b border-blue-100 bg-linear-to-r from-white via-blue-50 to-slate-50 px-5 py-5 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
            Certificates
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
            {activeCertificate ? "Update Certificate" : "Add Certificate"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5 sm:px-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Certificate Name
            </label>
            <input
              type="text"
              placeholder="e.g. ISO 9001:2015"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Certificate Image
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            <div
              onClick={triggerFileInput}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-slate-50 p-6 transition hover:border-blue-400 hover:bg-blue-50"
            >
              {formData.previewUrl ? (
                <img
                  src={formData.previewUrl}
                  alt="Preview"
                  className="max-h-40 rounded-lg object-contain shadow-sm"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-500">
                  <svg
                    className="mb-2 h-8 w-8 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Click to upload image
                  </span>
                </div>
              )}
            </div>
          </div>

          {formError && (
            <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
              {formError}
            </p>
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
                : activeCertificate
                  ? "Update Certificate"
                  : "Upload Certificate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCertificate;
