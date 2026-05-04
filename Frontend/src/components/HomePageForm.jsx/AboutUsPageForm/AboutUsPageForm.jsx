import { useEffect, useMemo, useState } from "react";
import {
  useCreateAboutUsMutation,
  useUpdateAboutUsMutation,
} from "../../../services/api";
import toast from "react-hot-toast";
import Loader from "../../loader/Loader";

const CONTENT_SECTION_KEYS = [
  "companyOverview",
  "mission",
  "research",
  "vision",
];

const IMAGE_FIELD_MAP = {
  companyOverview: "overviewImage",
  mission: "missionImage",
  research: "researchImage",
  vision: "visionImage",
};

const EMPTY_STAT = {
  key: "",
  value: "",
};

function createEmptyContentSection() {
  return {
    heading: "",
    subHeading: "",
    detail: "",
    imageFile: null,
    previewUrl: "",
    existingUrl: "",
  };
}

function createInitialFormState(initialData) {
  const normalized = normalizeAboutUsData(initialData);

  return {
    hero: {
      heading: normalized.hero.heading,
      subHeading: normalized.hero.subHeading,
      images: normalized.hero.images.map((item) => ({ ...item })),
    },
    companyOverview: { ...normalized.companyOverview },
    mission: { ...normalized.mission },
    research: { ...normalized.research },
    vision: { ...normalized.vision },
    companyStats: normalized.companyStats.map((item) => ({ ...item })),
  };
}

function normalizeAboutUsData(data) {
  const heroImages = Array.isArray(data?.hero?.images) ? data.hero.images : [];
  const normalizedHeroImages = heroImages
    .map((item, index) => {
      const url = getImageUrl(item);

      if (!url) {
        return null;
      }

      return {
        id: `existing-hero-${index}`,
        file: null,
        previewUrl: url,
        existingUrl: url,
        label: `Current image ${index + 1}`,
      };
    })
    .filter(Boolean);

  return {
    hero: {
      heading: data?.hero?.heading || "",
      subHeading: data?.hero?.subHeading || "",
      images: normalizedHeroImages,
    },
    companyOverview: normalizeContentSection(data?.companyOverview),
    mission: normalizeContentSection(data?.mission),
    research: normalizeContentSection(data?.research),
    vision: normalizeContentSection(data?.vision),
    companyStats:
      Array.isArray(data?.companyStats) && data.companyStats.length > 0
        ? data.companyStats.map((item) => ({
            key: item?.key || "",
            value: item?.value || "",
          }))
        : [{ ...EMPTY_STAT }],
  };
}

function normalizeContentSection(section) {
  const previewUrl = getImageUrl(section?.image);

  return {
    heading: section?.heading || "",
    subHeading: section?.subHeading || "",
    detail: section?.detail || "",
    imageFile: null,
    previewUrl,
    existingUrl: previewUrl,
  };
}

function getImageUrl(image) {
  if (typeof image === "string") {
    return image;
  }

  if (typeof image?.url === "string") {
    return image.url;
  }

  return "";
}

function revokeBlobPreview(url) {
  if (typeof url === "string" && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

function revokeBlobPreviews(formState) {
  formState.hero.images.forEach((item) => {
    revokeBlobPreview(item.previewUrl);
  });

  CONTENT_SECTION_KEYS.forEach((sectionKey) => {
    revokeBlobPreview(formState[sectionKey].previewUrl);
  });
}

function AboutUsPageForm({
  mode = "create",
  initialData = null,
  onCancel,
  onSuccess,
}) {
  const normalizedInitialData = useMemo(
    () => normalizeAboutUsData(initialData),
    [initialData],
  );

  const [createAboutUs, { isLoading: isCreating }] = useCreateAboutUsMutation();
  const [updateAboutUs,{ isLoading: isUpdating }] = useUpdateAboutUsMutation();
  const [formData, setFormData] = useState(() =>
    createInitialFormState(initialData),
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    setFormData(createInitialFormState(initialData));
    setFieldErrors({});
    setFormError("");
    setSuccessMessage("");
  }, [initialData]);

  useEffect(
    () => () => {
      revokeBlobPreviews(formData);
    },
    [formData],
  );

  const clearFieldError = (key) => {
    if (!fieldErrors[key]) {
      return;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [key]: "",
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

  const updateHeroField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));

    clearFieldError(`hero.${field}`);
    clearMessages();
  };

  const updateContentField = (sectionKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }));

    clearFieldError(`${sectionKey}.${field}`);
    clearMessages();
  };

  const updateStatField = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      companyStats: prev.companyStats.map((item, currentIndex) =>
        currentIndex === index ? { ...item, [field]: value } : item,
      ),
    }));

    clearFieldError(`companyStats.${index}.${field}`);
    clearMessages();
  };

  const addStat = () => {
    setFormData((prev) => ({
      ...prev,
      companyStats: [...prev.companyStats, { ...EMPTY_STAT }],
    }));

    clearMessages();
  };

  const removeStat = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      companyStats:
        prev.companyStats.length === 1
          ? [{ ...EMPTY_STAT }]
          : prev.companyStats.filter((_, index) => index !== indexToRemove),
    }));

    clearMessages();
  };

  const handleHeroImagesSelect = (event) => {
  const selectedFiles = Array.from(event.target.files || []);

  if (selectedFiles.length === 0) {
    return;
  }

  const MAX_FILES = 3;
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  // ✅ count validation
  if (selectedFiles.length > MAX_FILES) {
    setFieldErrors((prev) => ({
      ...prev,
      "hero.images": "You can upload a maximum of 3 hero images.",
    }));
    setFormError("Please fix the highlighted image fields.");
    setSuccessMessage("");
    event.target.value = "";
    return;
  }

  // ✅ type validation
  const invalidFile = selectedFiles.find(
    (file) => !file.type.startsWith("image/")
  );

  if (invalidFile) {
    setFieldErrors((prev) => ({
      ...prev,
      "hero.images": "Only image files are allowed for the hero gallery.",
    }));
    setFormError("Please fix the highlighted image fields.");
    setSuccessMessage("");
    event.target.value = "";
    return;
  }

  // ✅ size validation (NEW)
  const oversizedFile = selectedFiles.find(
    (file) => file.size > MAX_SIZE
  );

  if (oversizedFile) {
    setFieldErrors((prev) => ({
      ...prev,
      "hero.images": `Image "${oversizedFile.name}" exceeds 10MB.`,
    }));
    setFormError("Please fix the highlighted image fields.");
    toast.error("Image must be less than 10MB.");
    setSuccessMessage("");
    event.target.value = "";
    return;
  }

  // ✅ update state (same as your logic)
  setFormData((prev) => {
    prev.hero.images.forEach((item) => {
      revokeBlobPreview(item.previewUrl);
    });

    return {
      ...prev,
      hero: {
        ...prev.hero,
        images: selectedFiles.map((file, index) => ({
          id: `${file.name}-${index}`,
          file,
          previewUrl: URL.createObjectURL(file),
          existingUrl: "",
          label: file.name,
        })),
      },
    };
  });

  clearFieldError("hero.images");
  clearMessages();
  event.target.value = "";
};

  const resetHeroImagesToCurrent = () => {
    setFormData((prev) => {
      prev.hero.images.forEach((item) => {
        revokeBlobPreview(item.previewUrl);
      });

      return {
        ...prev,
        hero: {
          ...prev.hero,
          images: normalizedInitialData.hero.images.map((item) => ({ ...item })),
        },
      };
    });

    clearFieldError("hero.images");
    clearMessages();
  };

  const handleSingleImageSelect = (sectionKey, event) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  // ✅ TYPE VALIDATION
  if (!file.type.startsWith("image/")) {
    setFieldErrors((prev) => ({
      ...prev,
      [`${sectionKey}.image`]: "Please select a valid image file.",
    }));
    setFormError("Please fix the highlighted image fields.");
    setSuccessMessage("");
    event.target.value = "";
    return;
  }

  // ✅ SIZE VALIDATION (ADD THIS)
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  if (file.size > MAX_SIZE) {
    setFieldErrors((prev) => ({
      ...prev,
      [`${sectionKey}.image`]: "Image must be less than 10MB.",
    }));
    setFormError("Please fix the highlighted image fields.");
    toast.error("Image must be less than 10MB.")
    setSuccessMessage("");
    event.target.value = "";
    return;
  }

  setFormData((prev) => {
    if (prev[sectionKey]?.previewUrl) {
      revokeBlobPreview(prev[sectionKey].previewUrl);
    }

    return {
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        imageFile: file,
        previewUrl: URL.createObjectURL(file),
        existingUrl: prev[sectionKey].existingUrl,
      },
    };
  });

  clearFieldError(`${sectionKey}.image`);
  clearMessages();
  event.target.value = "";
};

  const resetSingleImageToCurrent = (sectionKey) => {
    setFormData((prev) => {
      revokeBlobPreview(prev[sectionKey].previewUrl);

      return {
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          imageFile: null,
          previewUrl: normalizedInitialData[sectionKey].previewUrl,
          existingUrl: normalizedInitialData[sectionKey].existingUrl,
        },
      };
    });

    clearFieldError(`${sectionKey}.image`);
    clearMessages();
  };

  const hasSingleImage = (sectionKey) =>
    Boolean(formData[sectionKey].imageFile || formData[sectionKey].previewUrl);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.hero.heading.trim()) {
      nextErrors["hero.heading"] = "Hero heading is required.";
    }

    if (!formData.hero.subHeading.trim()) {
      nextErrors["hero.subHeading"] = "Hero sub-heading is required.";
    }

    if (formData.hero.images.length === 0) {
      nextErrors["hero.images"] = "At least one hero image is required.";
    }

    if (formData.hero.images.length > 3) {
      nextErrors["hero.images"] = "You can upload a maximum of 3 hero images.";
    }

    if (!formData.companyOverview.heading.trim()) {
      nextErrors["companyOverview.heading"] = "Overview heading is required.";
    }

    if (!formData.companyOverview.detail.trim()) {
      nextErrors["companyOverview.detail"] = "Overview detail is required.";
    }

    if (!hasSingleImage("companyOverview")) {
      nextErrors["companyOverview.image"] = "Overview image is required.";
    }

    formData.companyStats.forEach((item, index) => {
      if (!item.key.trim()) {
        nextErrors[`companyStats.${index}.key`] =
          `Stat ${index + 1} key is required.`;
      }

      if (!item.value.trim()) {
        nextErrors[`companyStats.${index}.value`] =
          `Stat ${index + 1} value is required.`;
      }
    });

    ["mission", "research", "vision"].forEach((sectionKey) => {
      const title =
        sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1).toLowerCase();

      if (!formData[sectionKey].heading.trim()) {
        nextErrors[`${sectionKey}.heading`] = `${title} heading is required.`;
      }

      if (!formData[sectionKey].subHeading.trim()) {
        nextErrors[`${sectionKey}.subHeading`] =
          `${title} sub-heading is required.`;
      }

      if (!formData[sectionKey].detail.trim()) {
        nextErrors[`${sectionKey}.detail`] = `${title} detail is required.`;
      }

      if (!hasSingleImage(sectionKey)) {
        nextErrors[`${sectionKey}.image`] = `${title} image is required.`;
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

  const buildPayload = () => {
    const payload = new FormData();

    const heroHasNewImages = formData.hero.images.some((item) => Boolean(item.file));

    payload.append(
      "hero",
      JSON.stringify({
        heading: formData.hero.heading.trim(),
        subHeading: formData.hero.subHeading.trim(),
      }),
    );

    if (heroHasNewImages) {
      formData.hero.images.forEach((item) => {
        if (item.file) {
          payload.append("heroImages", item.file);
        }
      });
    }

    payload.append(
      "companyOverview",
      JSON.stringify({
        heading: formData.companyOverview.heading.trim(),
        detail: formData.companyOverview.detail.trim(),
      }),
    );

    payload.append("companyStats", JSON.stringify(
      formData.companyStats.map((item) => ({
        key: item.key.trim(),
        value: item.value.trim(),
      })),
    ));

    ["mission", "research", "vision"].forEach((sectionKey) => {
      payload.append(
        sectionKey,
        JSON.stringify({
          heading: formData[sectionKey].heading.trim(),
          subHeading: formData[sectionKey].subHeading.trim(),
          detail: formData[sectionKey].detail.trim(),
        }),
      );
    });

    CONTENT_SECTION_KEYS.forEach((sectionKey) => {
      if (formData[sectionKey].imageFile) {
        payload.append(IMAGE_FIELD_MAP[sectionKey], formData[sectionKey].imageFile);
      }
    });

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = buildPayload();

    try {
      setIsSubmitting(true);
      setFormError("");

      const response =
        mode === "update"
          ? await updateAboutUs(payload).unwrap()
          : await createAboutUs(payload).unwrap();

      setSuccessMessage(
        mode === "update"
          ? "About Us content updated successfully."
          : "About Us content created successfully.",
      );
      setFieldErrors({});

      if (onSuccess) {
        onSuccess(response?.data || response);
      }

      toast.success(response?.message || "About Us content saved successfully!");
    } catch (error) {
      setSuccessMessage("");
      toast.error(error?.data?.message || "Failed to save About Us content.");
      setFormError(
        error?.data?.message || error?.message || "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedHeroCount = formData.hero.images.length;
  const newHeroImageCount = formData.hero.images.filter((item) => item.file).length;
  const isUpdateMode = mode === "update";

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#f4fbff_0%,#f8fafc_30%,#ffffff_100%)] px-4 py-6 sm:px-5 lg:px-6">
      <Loader isLoading={isLoading} />
      <div className="mx-auto max-w-7xl space-y-6">
       

        <form onSubmit={handleSubmit} className="space-y-6">
          {formError ? <MessageBanner tone="error">{formError}</MessageBanner> : null}
          {successMessage ? (
            <MessageBanner tone="success">{successMessage}</MessageBanner>
          ) : null}

          <SectionCard
  eyebrow="Section 01"
  title="Hero Section"
  description="Heading, sub-heading, aur 3 tak hero gallery images upload karein. Update mode mein bina new selection ke current images same rahengi."
>
  <div className="space-y-6">
    {/* Inputs Vertically */}
    <div className="space-y-5">
      <FormField
        label="Heading"
        htmlFor="about-hero-heading"
        error={fieldErrors["hero.heading"]}
      >
        <input
          id="about-hero-heading"
          type="text"
          value={formData.hero.heading}
          onChange={(event) =>
            updateHeroField("heading", event.target.value)
          }
          placeholder="Enter hero heading"
          className={getInputClassName(
            Boolean(fieldErrors["hero.heading"])
          )}
        />
      </FormField>

      <FormField
        label="Sub-Heading"
        htmlFor="about-hero-subheading"
        error={fieldErrors["hero.subHeading"]}
      >
        <textarea
          id="about-hero-subheading"
          rows={4}
          value={formData.hero.subHeading}
          onChange={(event) =>
            updateHeroField("subHeading", event.target.value)
          }
          placeholder="Write hero sub-heading"
          className={`${getInputClassName(
            Boolean(fieldErrors["hero.subHeading"])
          )} resize-none`}
        />
      </FormField>
    </div>

    {/* Images Last */}
    <div className="space-y-4">
      <FormField
        label="Hero Images"
        htmlFor="about-hero-images"
        error={fieldErrors["hero.images"]}
      >
        <label
          htmlFor="about-hero-images"
          className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-sky-200 bg-white/90 px-6 py-8 text-center transition hover:border-sky-400 hover:bg-sky-50/70"
        >
          <UploadIllustration />

          <p className="mt-4 text-sm font-semibold text-slate-800">
            Click to upload up to 3 hero images and Each Image must be less then 10 mb. 
          </p>

          <p className="mt-2 text-xs font-medium text-slate-400">
            PNG, JPG, WEBP and all image formats supported
          </p>

          <input
            id="about-hero-images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleHeroImagesSelect}
            className="hidden"
          />
        </label>
      </FormField>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {formData.hero.images.length > 0 ? (
          formData.hero.images.map((item, index) => (
            <ImageThumb
              key={item.id || `${item.previewUrl}-${index}`}
              src={item.previewUrl}
              title={`Image ${index + 1}`}
              badge={item.file ? "New" : "Current"}
              caption={item.label}
            />
          ))
        ) : (
          <EmptyImageState label="Hero preview will appear here" />
        )}
      </div>

    </div>
  </div>
</SectionCard>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <SectionCard
              eyebrow="Section 02"
              title="Company Overview"
              description="Overview heading, detail, aur supporting image define karein."
            >
              <SectionContentEditor
                sectionKey="companyOverview"
                title="Overview"
                data={formData.companyOverview}
                fieldErrors={fieldErrors}
                onTextChange={updateContentField}
                onImageChange={handleSingleImageSelect}
                onImageReset={resetSingleImageToCurrent}
                isUpdateMode={isUpdateMode}
                showSubHeading={false}
                detailRows={5}
              />
            </SectionCard>

            <SectionCard
              eyebrow="Section 03"
              title="Company Stats"
              description="Cards ke key-value pairs yahin se control honge. Har stat ko editable aur reorder-friendly blocks mein rakha gaya hai."
            >
              <div className="space-y-5">
                <PanelHeader
                  title="Stat Entries"
                  actionLabel="Add Stat"
                  onAction={addStat}
                />

                <div className="space-y-4">
                  {formData.companyStats.map((item, index) => (
                    <div
                      key={`about-stat-${index}`}
                      className="rounded-[26px] border border-slate-200/80 bg-slate-50/80 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                          Stat {index + 1}
                        </p>
                        <DeleteButton
                          label={`Delete stat ${index + 1}`}
                          onClick={() => removeStat(index)}
                        />
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <FormField
                          label="Key"
                          htmlFor={`about-stat-key-${index}`}
                          error={fieldErrors[`companyStats.${index}.key`]}
                        >
                          <input
                            id={`about-stat-key-${index}`}
                            type="text"
                            value={item.key}
                            onChange={(event) =>
                              updateStatField(index, "key", event.target.value)
                            }
                            placeholder={`Enter key ${index + 1}`}
                            className={getInputClassName(
                              Boolean(fieldErrors[`companyStats.${index}.key`]),
                            )}
                          />
                        </FormField>

                        <FormField
                          label="Value"
                          htmlFor={`about-stat-value-${index}`}
                          error={fieldErrors[`companyStats.${index}.value`]}
                        >
                          <input
                            id={`about-stat-value-${index}`}
                            type="text"
                            value={item.value}
                            onChange={(event) =>
                              updateStatField(index, "value", event.target.value)
                            }
                            placeholder={`Enter value ${index + 1}`}
                            className={getInputClassName(
                              Boolean(fieldErrors[`companyStats.${index}.value`]),
                            )}
                          />
                        </FormField>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard
              eyebrow="Section 04"
              title="Mission"
              description="Mission block ke liye heading, sub-heading, detail aur image configure karein."
            >
              <SectionContentEditor
                sectionKey="mission"
                title="Mission"
                data={formData.mission}
                fieldErrors={fieldErrors}
                onTextChange={updateContentField}
                onImageChange={handleSingleImageSelect}
                onImageReset={resetSingleImageToCurrent}
                isUpdateMode={isUpdateMode}
              />
            </SectionCard>

            <SectionCard
              eyebrow="Section 05"
              title="Research"
              description="Research block ke liye content aur visual upload yahin se manage hoga."
            >
              <SectionContentEditor
                sectionKey="research"
                title="Research"
                data={formData.research}
                fieldErrors={fieldErrors}
                onTextChange={updateContentField}
                onImageChange={handleSingleImageSelect}
                onImageReset={resetSingleImageToCurrent}
                isUpdateMode={isUpdateMode}
              />
            </SectionCard>
          </div>

          <SectionCard
            eyebrow="Section 06"
            title="Vision"
            description="Final highlight section ke liye polished copy aur strong image upload karein."
          >
            <SectionContentEditor
              sectionKey="vision"
              title="Vision"
              data={formData.vision}
              fieldErrors={fieldErrors}
              onTextChange={updateContentField}
              onImageChange={handleSingleImageSelect}
              onImageReset={resetSingleImageToCurrent}
              isUpdateMode={isUpdateMode}
              imageMinHeight="min-h-72"
            />
          </SectionCard>

          <div className="sticky bottom-4 z-10">
            <div className="rounded-[28px] border border-sky-100 bg-white/94 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Ready to {isUpdateMode ? "update" : "create"} About Us content?
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
                        ? "Update About Us"
                        : "Create About Us"}
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

function SectionContentEditor({
  sectionKey,
  title,
  data,
  fieldErrors,
  onTextChange,
  onImageChange,
  onImageReset,
  isUpdateMode,
  showSubHeading = true,
  detailRows = 4,
  imageMinHeight = "min-h-64",
}) {
  return (
    <div className="space-y-6">
      {/* All Inputs Vertically */}
      <div className="space-y-5">
        <FormField
          label="Heading"
          htmlFor={`${sectionKey}-heading`}
          error={fieldErrors[`${sectionKey}.heading`]}
        >
          <input
            id={`${sectionKey}-heading`}
            type="text"
            value={data.heading}
            onChange={(event) =>
              onTextChange(sectionKey, "heading", event.target.value)
            }
            placeholder={`Enter ${title.toLowerCase()} heading`}
            className={getInputClassName(
              Boolean(fieldErrors[`${sectionKey}.heading`])
            )}
          />
        </FormField>

        {showSubHeading ? (
          <FormField
            label="Sub-Heading"
            htmlFor={`${sectionKey}-subheading`}
            error={fieldErrors[`${sectionKey}.subHeading`]}
          >
            <textarea
              id={`${sectionKey}-subheading`}
              rows={3}
              value={data.subHeading}
              onChange={(event) =>
                onTextChange(sectionKey, "subHeading", event.target.value)
              }
              placeholder={`Enter ${title.toLowerCase()} sub-heading`}
              className={`${getInputClassName(
                Boolean(fieldErrors[`${sectionKey}.subHeading`])
              )} resize-none`}
            />
          </FormField>
        ) : null}

        <FormField
          label="Detail"
          htmlFor={`${sectionKey}-detail`}
          error={fieldErrors[`${sectionKey}.detail`]}
        >
          <textarea
            id={`${sectionKey}-detail`}
            rows={detailRows}
            value={data.detail}
            onChange={(event) =>
              onTextChange(sectionKey, "detail", event.target.value)
            }
            placeholder={`Write ${title.toLowerCase()} detail`}
            className={`${getInputClassName(
              Boolean(fieldErrors[`${sectionKey}.detail`])
            )} resize-none`}
          />
        </FormField>
      </div>

      {/* Image Upload Last */}
      <div className="space-y-4">
        <FormField
          label={`${title} Image`}
          htmlFor={`${sectionKey}-image`}
          error={fieldErrors[`${sectionKey}.image`]}
        >
          <ImageUploadCard
            id={`${sectionKey}-image`}
            previewUrl={data.previewUrl}
            onChange={(event) => onImageChange(sectionKey, event)}
            placeholder={`Upload ${title.toLowerCase()} image`}
            minHeightClassName={imageMinHeight}
          />
        </FormField>
      </div>
    </div>
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

      </div>

      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

function PanelHeader({ title, detail, actionLabel, onAction }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
      </div>

      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600"
      >
        <PlusIcon className="h-4 w-4" />
        {actionLabel}
      </button>
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

function StatChip({ label, value }) {
  return (
    <div className="rounded-[22px] border border-white/70 bg-white/78 px-4 py-3 shadow-[0_16px_40px_rgba(14,165,233,0.08)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
        {label}
      </p>
      <p className="mt-2 text-base font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ImageUploadCard({
  id,
  previewUrl,
  onChange,
  placeholder,
  minHeightClassName = "min-h-64",
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[26px] border-2 border-dashed border-sky-200 bg-slate-50 transition hover:border-sky-400 hover:bg-sky-50 ${minHeightClassName}`.trim()}
    >
      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="w-full space-y-4 p-4">
          <div className="overflow-hidden rounded-[22px] border border-sky-100 bg-white">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-64 w-full object-cover"
            />
          </div>
          <p className="text-center text-sm font-medium text-slate-500">
            Click to change image
          </p>
        </div>
      ) : (
        <div className="flex min-h-60 flex-col items-center justify-center px-6 py-8 text-center">
          <UploadIllustration />
          <p className="mt-4 text-sm font-semibold text-slate-700">
            {placeholder}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-400">
            PNG, JPG, WEBP or any image format
          </p>
        </div>
      )}
    </label>
  );
}

function ImageThumb({ src, title, caption, badge }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_35px_rgba(148,163,184,0.12)]">
      <div className="relative h-36 overflow-hidden bg-slate-100">
        <img src={src} alt={title} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-slate-900/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
          {badge}
        </span>
      </div>
      <div className="space-y-1 px-4 py-3">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="line-clamp-2 text-xs leading-5 text-slate-500">{caption}</p>
      </div>
    </div>
  );
}

function EmptyImageState({ label }) {
  return (
    <div className="sm:col-span-2 xl:col-span-3">
      <div className="flex min-h-32 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6 text-center text-sm font-medium text-slate-400">
        {label}
      </div>
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

function DeleteButton({ label, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
    >
      <DeleteIcon className="h-4.5 w-4.5" />
    </button>
  );
}

function UploadIllustration() {
  return (
    <svg
      className="h-9 w-9 text-sky-400"
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
      : "border-sky-100 bg-slate-50 focus:border-sky-300 focus:ring-sky-100"
  }`;
}

export default AboutUsPageForm;
