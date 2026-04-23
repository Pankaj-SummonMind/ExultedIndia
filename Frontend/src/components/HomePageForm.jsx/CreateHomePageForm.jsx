import { useEffect, useMemo, useRef, useState } from "react";
import { useCreateHomePageMutation, useGetCategoriesQuery } from "../../services/api";

const EMPTY_HERO_CARD = {
  title: "",
  subHeading: "",
  description: "",
  image: null,
  previewUrl: "",
};

const EMPTY_HERO_DETAIL = {
  title: "",
  stats: [
    { key: "", value: "" },
    { key: "", value: "" },
    { key: "", value: "" },
  ],
  image: null,
  previewUrl: "",
};

const EMPTY_HOME_CATEGORY = {
  title: "",
  categories: [],
};

const EMPTY_WHY_CHOOSE_US = {
  title: "",
  points: [{ label: "", detail: "" }],
};

const EMPTY_LOCATIONS = {
  title: "",
  detail: "",
  locations: [""],
};

const EMPTY_TESTIMONIALS = {
  title: "",
  testimonials: [{ name: "", role: "", message: "" }],
};

const EMPTY_JOIN_US = {
  title: "",
  detail: "",
};

const INITIAL_FORM = {
  heroCard: EMPTY_HERO_CARD,
  heroDetail: EMPTY_HERO_DETAIL,
  homeCategory: EMPTY_HOME_CATEGORY,
  whyChooseUs: EMPTY_WHY_CHOOSE_US,
  locations: EMPTY_LOCATIONS,
  testimonials: EMPTY_TESTIMONIALS,
  joinUs: EMPTY_JOIN_US,
};

function createInitialFormState() {
  return {
    heroCard: { ...EMPTY_HERO_CARD },
    heroDetail: {
      ...EMPTY_HERO_DETAIL,
      stats: EMPTY_HERO_DETAIL.stats.map((item) => ({ ...item })),
    },
    homeCategory: { ...EMPTY_HOME_CATEGORY, categories: [] },
    whyChooseUs: {
      ...EMPTY_WHY_CHOOSE_US,
      points: EMPTY_WHY_CHOOSE_US.points.map((item) => ({ ...item })),
    },
    locations: {
      ...EMPTY_LOCATIONS,
      locations: [...EMPTY_LOCATIONS.locations],
    },
    testimonials: {
      ...EMPTY_TESTIMONIALS,
      testimonials: EMPTY_TESTIMONIALS.testimonials.map((item) => ({ ...item })),
    },
    joinUs: { ...EMPTY_JOIN_US },
  };
}

function CreateHomePageForm({setShowCreateForm}) {
  const { data, isLoading: isCategoryLoading } = useGetCategoriesQuery();
  const [createHomePage,{isLoading,error}]  = useCreateHomePageMutation()
  const [formData, setFormData] = useState(() => createInitialFormState());
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  const categoryOptions = useMemo(() => {
    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data)) {
      return data;
    }

    return [];
  }, [data]);

  const filteredCategories = useMemo(() => {
    const selectedIds = new Set(
      formData.homeCategory.categories.map((item) => item.id),
    );
    const normalizedSearch = categorySearch.trim().toLowerCase();

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
  }, [categoryOptions, categorySearch, formData.homeCategory.categories]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!categoryDropdownRef.current?.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const clearFieldError = (key) => {
    if (!fieldErrors[key]) {
      return;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const clearGlobalMessages = () => {
    if (formError) {
      setFormError("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const updateHeroCardField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      heroCard: {
        ...prev.heroCard,
        [field]: value,
      },
    }));

    clearFieldError(`heroCard.${field}`);
    clearGlobalMessages();
  };

  const updateHeroDetailField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      heroDetail: {
        ...prev.heroDetail,
        [field]: value,
      },
    }));

    clearFieldError(`heroDetail.${field}`);
    clearGlobalMessages();
  };

  const updateHeroDetailStatField = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      heroDetail: {
        ...prev.heroDetail,
        stats: prev.heroDetail.stats.map((item, currentIndex) =>
          currentIndex === index ? { ...item, [field]: value } : item,
        ),
      },
    }));

    clearFieldError(`heroDetail.stats.${index}.${field}`);
    clearGlobalMessages();
  };

  const updateHomeCategoryField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      homeCategory: {
        ...prev.homeCategory,
        [field]: value,
      },
    }));

    clearFieldError(`homeCategory.${field}`);
    clearGlobalMessages();
  };

  const updateWhyChooseUsField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      whyChooseUs: {
        ...prev.whyChooseUs,
        [field]: value,
      },
    }));

    clearFieldError(`whyChooseUs.${field}`);
    clearGlobalMessages();
  };

  const updateWhyChooseUsPointField = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      whyChooseUs: {
        ...prev.whyChooseUs,
        points: prev.whyChooseUs.points.map((item, currentIndex) =>
          currentIndex === index ? { ...item, [field]: value } : item,
        ),
      },
    }));

    clearFieldError(`whyChooseUs.points.${index}.${field}`);
    clearGlobalMessages();
  };

  const addWhyChooseUsPoint = () => {
    setFormData((prev) => ({
      ...prev,
      whyChooseUs: {
        ...prev.whyChooseUs,
        points: [...prev.whyChooseUs.points, { label: "", detail: "" }],
      },
    }));

    clearGlobalMessages();
  };

  const removeWhyChooseUsPoint = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      whyChooseUs: {
        ...prev.whyChooseUs,
        points:
          prev.whyChooseUs.points.length === 1
            ? [{ label: "", detail: "" }]
            : prev.whyChooseUs.points.filter(
                (_, index) => index !== indexToRemove,
              ),
      },
    }));

    clearGlobalMessages();
  };

  const updateLocationsField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      locations: {
        ...prev.locations,
        [field]: value,
      },
    }));

    clearFieldError(`locations.${field}`);
    clearGlobalMessages();
  };

  const updateLocationValue = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      locations: {
        ...prev.locations,
        locations: prev.locations.locations.map((item, currentIndex) =>
          currentIndex === index ? value : item,
        ),
      },
    }));

    clearFieldError(`locations.items.${index}`);
    clearGlobalMessages();
  };

  const addLocation = () => {
    setFormData((prev) => ({
      ...prev,
      locations: {
        ...prev.locations,
        locations: [...prev.locations.locations, ""],
      },
    }));

    clearGlobalMessages();
  };

  const removeLocation = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      locations: {
        ...prev.locations,
        locations:
          prev.locations.locations.length === 1
            ? [""]
            : prev.locations.locations.filter(
                (_, index) => index !== indexToRemove,
              ),
      },
    }));

    clearGlobalMessages();
  };

  const updateTestimonialsField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        [field]: value,
      },
    }));

    clearFieldError(`testimonials.${field}`);
    clearGlobalMessages();
  };

  const updateTestimonialItemField = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        testimonials: prev.testimonials.testimonials.map(
          (item, currentIndex) =>
            currentIndex === index ? { ...item, [field]: value } : item,
        ),
      },
    }));

    clearFieldError(`testimonials.items.${index}.${field}`);
    clearGlobalMessages();
  };

  const addTestimonial = () => {
    setFormData((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        testimonials: [
          ...prev.testimonials.testimonials,
          { name: "", role: "", message: "" },
        ],
      },
    }));

    clearGlobalMessages();
  };

  const removeTestimonial = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        testimonials:
          prev.testimonials.testimonials.length === 1
            ? [{ name: "", role: "", message: "" }]
            : prev.testimonials.testimonials.filter(
                (_, index) => index !== indexToRemove,
              ),
      },
    }));

    clearGlobalMessages();
  };

  const updateJoinUsField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      joinUs: {
        ...prev.joinUs,
        [field]: value,
      },
    }));

    clearFieldError(`joinUs.${field}`);
    clearGlobalMessages();
  };

  const handleImageSelect = (section, event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({
        ...prev,
        [`${section}.image`]: "Please select a valid image file.",
      }));
      setFormError("Please fix the highlighted image fields.");
      setSuccessMessage("");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (section === "heroCard") {
      setFormData((prev) => ({
        ...prev,
        heroCard: {
          ...prev.heroCard,
          image: file,
          previewUrl,
        },
      }));
    }

    if (section === "heroDetail") {
      setFormData((prev) => ({
        ...prev,
        heroDetail: {
          ...prev.heroDetail,
          image: file,
          previewUrl,
        },
      }));
    }

    clearFieldError(`${section}.image`);
    clearGlobalMessages();
  };

  const handleCategorySearchChange = (value) => {
    setCategorySearch(value);
    setIsCategoryDropdownOpen(true);
    clearFieldError("homeCategory.categories");
    clearGlobalMessages();
  };

  const handleSelectCategory = (item) => {
    const selectedCategory = {
      id: item._id || item.id || "",
      name: item.categories_name || item.name || "",
    };

    setFormData((prev) => ({
      ...prev,
      homeCategory: {
        ...prev.homeCategory,
        categories: [...prev.homeCategory.categories, selectedCategory],
      },
    }));
    setCategorySearch("");
    setIsCategoryDropdownOpen(false);
    clearFieldError("homeCategory.categories");
    clearGlobalMessages();
  };

  const handleRemoveCategory = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      homeCategory: {
        ...prev.homeCategory,
        categories: prev.homeCategory.categories.filter(
          (item) => item.id !== categoryId,
        ),
      },
    }));

    clearGlobalMessages();
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.heroCard.title.trim()) {
      nextErrors["heroCard.title"] = "Title is required.";
    }

    if (!formData.heroCard.subHeading.trim()) {
      nextErrors["heroCard.subHeading"] = "Sub-heading is required.";
    }

    if (!formData.heroCard.description.trim()) {
      nextErrors["heroCard.description"] = "Description is required.";
    }

    if (!formData.heroCard.previewUrl || !formData.heroCard.image) {
      nextErrors["heroCard.image"] = "Image is required.";
    }

    if (!formData.heroDetail.title.trim()) {
      nextErrors["heroDetail.title"] = "Title is required.";
    }

    formData.heroDetail.stats.forEach((item, index) => {
      if (!item.key.trim()) {
        nextErrors[`heroDetail.stats.${index}.key`] =
          `Stat ${index + 1} key is required.`;
      }

      if (!item.value.trim()) {
        nextErrors[`heroDetail.stats.${index}.value`] =
          `Stat ${index + 1} value is required.`;
      }
    });

    if (!formData.heroDetail.previewUrl || !formData.heroDetail.image) {
      nextErrors["heroDetail.image"] = "Image is required.";
    }

    if (!formData.homeCategory.title.trim()) {
      nextErrors["homeCategory.title"] = "Title is required.";
    }

    if (formData.homeCategory.categories.length === 0) {
      nextErrors["homeCategory.categories"] =
        "At least one category is required.";
    }

    if (!formData.whyChooseUs.title.trim()) {
      nextErrors["whyChooseUs.title"] = "Title is required.";
    }

    formData.whyChooseUs.points.forEach((item, index) => {
      if (!item.label.trim()) {
        nextErrors[`whyChooseUs.points.${index}.label`] =
          `Feature ${index + 1} name is required.`;
      }

      if (!item.detail.trim()) {
        nextErrors[`whyChooseUs.points.${index}.detail`] =
          `Feature ${index + 1} description is required.`;
      }
    });

    if (!formData.locations.title.trim()) {
      nextErrors["locations.title"] = "Title is required.";
    }

    if (!formData.locations.detail.trim()) {
      nextErrors["locations.detail"] = "Detail is required.";
    }

    formData.locations.locations.forEach((item, index) => {
      if (!item.trim()) {
        nextErrors[`locations.items.${index}`] =
          `Location ${index + 1} is required.`;
      }
    });

    if (!formData.testimonials.title.trim()) {
      nextErrors["testimonials.title"] = "Title is required.";
    }

    formData.testimonials.testimonials.forEach((item, index) => {
      if (!item.name.trim()) {
        nextErrors[`testimonials.items.${index}.name`] =
          `User / Employee Name ${index + 1} is required.`;
      }

      if (!item.role.trim()) {
        nextErrors[`testimonials.items.${index}.role`] =
          `Designation / Role ${index + 1} is required.`;
      }

      if (!item.message.trim()) {
        nextErrors[`testimonials.items.${index}.message`] =
          `Message ${index + 1} is required.`;
      }
    });

    if (!formData.joinUs.title.trim()) {
      nextErrors["joinUs.title"] = "Title is required.";
    }

    if (!formData.joinUs.detail.trim()) {
      nextErrors["joinUs.detail"] = "Detail is required.";
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFormError("Please fill in all required fields before submitting.");
      setSuccessMessage("");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const normalizedData = {
      heroCard: {
        title: formData.heroCard.title.trim(),
        subHeading: formData.heroCard.subHeading.trim(),
        description: formData.heroCard.description.trim(),
        image: formData.heroCard.image,
      },
      heroDetail: {
        title: formData.heroDetail.title.trim(),
        stats: formData.heroDetail.stats.map((item) => ({
          key: item.key.trim(),
          value: item.value.trim(),
        })),
        image: formData.heroDetail.image,
      },
      homeCategory: {
        title: formData.homeCategory.title.trim(),
        categories: formData.homeCategory.categories,
      },
      whyChooseUs: {
        title: formData.whyChooseUs.title.trim(),
        points: formData.whyChooseUs.points.map((item) => ({
          label: item.label.trim(),
          detail: item.detail.trim(),
        })),
      },
      locations: {
        title: formData.locations.title.trim(),
        detail: formData.locations.detail.trim(),
        locations: formData.locations.locations.map((item) => item.trim()),
      },
      testimonials: {
        title: formData.testimonials.title.trim(),
        testimonials: formData.testimonials.testimonials.map((item) => ({
          name: item.name.trim(),
          role: item.role.trim(),
          message: item.message.trim(),
        })),
      },
      joinUs: {
        title: formData.joinUs.title.trim(),
        detail: formData.joinUs.detail.trim(),
      },
    };

    const payload = new FormData();
    payload.append(
      "hero",
      JSON.stringify({
        title: normalizedData.heroCard.title,
        sub_heading: normalizedData.heroCard.subHeading,
        description: normalizedData.heroCard.description,
      }),
    );
    payload.append("heroImage", normalizedData.heroCard.image);

    payload.append(
      "heroDetail",
      JSON.stringify({
        title: normalizedData.heroDetail.title,
        stats: normalizedData.heroDetail.stats,
      }),
    );
    payload.append("heroDetailImage", normalizedData.heroDetail.image);

    payload.append(
      "homeCategory",
      JSON.stringify({
        title: normalizedData.homeCategory.title,
        categories: normalizedData.homeCategory.categories.map((item) => item.id),
      }),
    );

    payload.append(
      "whyChooseUs",
      JSON.stringify(normalizedData.whyChooseUs),
    );
    payload.append("locations", JSON.stringify(normalizedData.locations));
    payload.append("testimonials", JSON.stringify(normalizedData.testimonials));
    payload.append("joinUs", JSON.stringify(normalizedData.joinUs));

    try {
      setIsSubmitting(true);
      const res = await createHomePage(payload).unwrap()

      console.log("response after creating home page :",res)
      setShowCreateForm(false);
      setSuccessMessage("Home page content created successfully.");
      setFormError("");
      setFieldErrors({});
      setCategorySearch("");
      setIsCategoryDropdownOpen(false);
      setFormData(createInitialFormState());
    } catch (error) {
      setSuccessMessage("");
      setFormError(
        error?.data?.message || error?.message || "Something went wrong.",
      );
      console.log("erorr whle creating home page :",error)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,#eff6ff_0%,#f8fafc_28%,#ffffff_100%)] px-4 py-6 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        

        <form onSubmit={handleSubmit} className="space-y-6">
          {formError ? (
            <MessageBanner tone="error">{formError}</MessageBanner>
          ) : null}

          {successMessage ? (
            <MessageBanner tone="success">{successMessage}</MessageBanner>
          ) : null}

          <SectionCard
            eyebrow="Section 01"
            title="Hero Card"
            description="Add the hero title, sub-heading, description, and main banner image."
          >
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
              <div className="space-y-5">
                <FormField
                  label="Title"
                  htmlFor="single-hero-title"
                  error={fieldErrors["heroCard.title"]}
                >
                  <input
                    id="single-hero-title"
                    type="text"
                    value={formData.heroCard.title}
                    onChange={(event) =>
                      updateHeroCardField("title", event.target.value)
                    }
                    placeholder="Enter hero title"
                    className={getInputClassName(
                      Boolean(fieldErrors["heroCard.title"]),
                    )}
                  />
                </FormField>

                <FormField
                  label="Sub-Heading"
                  htmlFor="single-hero-sub-heading"
                  error={fieldErrors["heroCard.subHeading"]}
                >
                  <input
                    id="single-hero-sub-heading"
                    type="text"
                    value={formData.heroCard.subHeading}
                    onChange={(event) =>
                      updateHeroCardField("subHeading", event.target.value)
                    }
                    placeholder="Enter hero sub-heading"
                    className={getInputClassName(
                      Boolean(fieldErrors["heroCard.subHeading"]),
                    )}
                  />
                </FormField>

                <FormField
                  label="Description"
                  htmlFor="single-hero-description"
                  error={fieldErrors["heroCard.description"]}
                >
                  <textarea
                    id="single-hero-description"
                    rows={5}
                    value={formData.heroCard.description}
                    onChange={(event) =>
                      updateHeroCardField("description", event.target.value)
                    }
                    placeholder="Write hero card description"
                    className={`${getInputClassName(
                      Boolean(fieldErrors["heroCard.description"]),
                    )} resize-none`}
                  />
                </FormField>
              </div>

              <div>
                <FormField
                  label="Hero Image"
                  error={fieldErrors["heroCard.image"]}
                >
                  <ImageUploadCard
                    id="single-hero-image"
                    previewUrl={formData.heroCard.previewUrl}
                    onChange={(event) => handleImageSelect("heroCard", event)}
                    placeholder="Click to upload hero image"
                  />
                </FormField>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Section 02"
            title="Hero Detail"
            description="Add the hero detail title, exactly three stats, and the supporting image."
          >
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
              <div className="space-y-5">
                <FormField
                  label="Title"
                  htmlFor="single-hero-detail-title"
                  error={fieldErrors["heroDetail.title"]}
                >
                  <input
                    id="single-hero-detail-title"
                    type="text"
                    value={formData.heroDetail.title}
                    onChange={(event) =>
                      updateHeroDetailField("title", event.target.value)
                    }
                    placeholder="Enter hero detail title"
                    className={getInputClassName(
                      Boolean(fieldErrors["heroDetail.title"]),
                    )}
                  />
                </FormField>

                <div className="space-y-4">
                  {formData.heroDetail.stats.map((item, index) => (
                    <div
                      key={`single-stat-${index}`}
                      className="rounded-[26px] border border-slate-200/80 bg-slate-50/85 p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                        Stat {index + 1}
                      </p>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <FormField
                          label="Key"
                          htmlFor={`single-stat-key-${index}`}
                          error={
                            fieldErrors[`heroDetail.stats.${index}.key`]
                          }
                        >
                          <input
                            id={`single-stat-key-${index}`}
                            type="text"
                            value={item.key}
                            onChange={(event) =>
                              updateHeroDetailStatField(
                                index,
                                "key",
                                event.target.value,
                              )
                            }
                            placeholder={`Enter stat ${index + 1} key`}
                            className={getInputClassName(
                              Boolean(
                                fieldErrors[`heroDetail.stats.${index}.key`],
                              ),
                            )}
                          />
                        </FormField>

                        <FormField
                          label="Value"
                          htmlFor={`single-stat-value-${index}`}
                          error={
                            fieldErrors[`heroDetail.stats.${index}.value`]
                          }
                        >
                          <input
                            id={`single-stat-value-${index}`}
                            type="text"
                            value={item.value}
                            onChange={(event) =>
                              updateHeroDetailStatField(
                                index,
                                "value",
                                event.target.value,
                              )
                            }
                            placeholder={`Enter stat ${index + 1} value`}
                            className={getInputClassName(
                              Boolean(
                                fieldErrors[`heroDetail.stats.${index}.value`],
                              ),
                            )}
                          />
                        </FormField>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <FormField
                  label="Hero Detail Image"
                  error={fieldErrors["heroDetail.image"]}
                >
                  <ImageUploadCard
                    id="single-hero-detail-image"
                    previewUrl={formData.heroDetail.previewUrl}
                    onChange={(event) => handleImageSelect("heroDetail", event)}
                    placeholder="Click to upload hero detail image"
                  />
                </FormField>
              </div>
            </div>
          </SectionCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard
              eyebrow="Section 03"
              title="Home Category"
              description="Add the section title and select multiple categories with searchable input."
            >
              <div className="space-y-5">
                <FormField
                  label="Title"
                  htmlFor="single-home-category-title"
                  error={fieldErrors["homeCategory.title"]}
                >
                  <input
                    id="single-home-category-title"
                    type="text"
                    value={formData.homeCategory.title}
                    onChange={(event) =>
                      updateHomeCategoryField("title", event.target.value)
                    }
                    placeholder="Enter category section title"
                    className={getInputClassName(
                      Boolean(fieldErrors["homeCategory.title"]),
                    )}
                  />
                </FormField>

                <FormField
                  label="Categories"
                  htmlFor="single-home-category-search"
                  error={fieldErrors["homeCategory.categories"]}
                >
                  <div ref={categoryDropdownRef} className="relative">
                    <div
                      className={`rounded-[26px] border bg-slate-50 p-3 transition ${
                        fieldErrors["homeCategory.categories"]
                          ? "border-red-200 bg-red-50/40"
                          : "border-blue-100 focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100"
                      }`}
                    >
                      <div className="flex flex-wrap gap-2">
                        {formData.homeCategory.categories.map((item) => (
                          <span
                            key={item.id}
                            className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
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
                          id="single-home-category-search"
                          type="text"
                          value={categorySearch}
                          onFocus={() => setIsCategoryDropdownOpen(true)}
                          onChange={(event) =>
                            handleCategorySearchChange(event.target.value)
                          }
                          placeholder={
                            formData.homeCategory.categories.length > 0
                              ? "Search and add more categories"
                              : "Search categories"
                          }
                          className="min-w-[180px] flex-1 bg-transparent px-2 py-2 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {isCategoryDropdownOpen ? (
                      <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 max-h-64 overflow-y-auto rounded-[26px] border border-blue-100 bg-white p-2 shadow-[0_18px_50px_rgba(148,163,184,0.22)]">
                        {isCategoryLoading ? (
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
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Section 04"
              title="Join Us"
              description="Add the join us title and supporting detail text."
            >
              <div className="space-y-5">
                <FormField
                  label="Title"
                  htmlFor="single-join-us-title"
                  error={fieldErrors["joinUs.title"]}
                >
                  <input
                    id="single-join-us-title"
                    type="text"
                    value={formData.joinUs.title}
                    onChange={(event) =>
                      updateJoinUsField("title", event.target.value)
                    }
                    placeholder="Enter join us title"
                    className={getInputClassName(
                      Boolean(fieldErrors["joinUs.title"]),
                    )}
                  />
                </FormField>

                <FormField
                  label="Detail"
                  htmlFor="single-join-us-detail"
                  error={fieldErrors["joinUs.detail"]}
                >
                  <textarea
                    id="single-join-us-detail"
                    rows={6}
                    value={formData.joinUs.detail}
                    onChange={(event) =>
                      updateJoinUsField("detail", event.target.value)
                    }
                    placeholder="Write join us detail"
                    className={`${getInputClassName(
                      Boolean(fieldErrors["joinUs.detail"]),
                    )} resize-none`}
                  />
                </FormField>
              </div>
            </SectionCard>
          </div>

          <SectionCard
            eyebrow="Section 05"
            title="Why Choose Us"
            description="Add the title and multiple feature blocks with short descriptions."
          >
            <div className="space-y-5">
              <FormField
                label="Title"
                htmlFor="single-why-title"
                error={fieldErrors["whyChooseUs.title"]}
              >
                <input
                  id="single-why-title"
                  type="text"
                  value={formData.whyChooseUs.title}
                  onChange={(event) =>
                    updateWhyChooseUsField("title", event.target.value)
                  }
                  placeholder="Enter why choose us title"
                  className={getInputClassName(
                    Boolean(fieldErrors["whyChooseUs.title"]),
                  )}
                />
              </FormField>

              <PanelHeader
                title="Feature Blocks"
                detail="Add multiple feature name and description pairs."
                actionLabel="Add Feature"
                onAction={addWhyChooseUsPoint}
              />

              <div className="space-y-4">
                {formData.whyChooseUs.points.map((item, index) => (
                  <div
                    key={`single-why-point-${index}`}
                    className="rounded-[26px] border border-slate-200/80 bg-slate-50/80 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                        Feature {index + 1}
                      </p>
                      <DeleteButton
                        label={`Delete feature ${index + 1}`}
                        onClick={() => removeWhyChooseUsPoint(index)}
                      />
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                      <FormField
                        label="Feature Name"
                        htmlFor={`single-why-label-${index}`}
                        error={fieldErrors[`whyChooseUs.points.${index}.label`]}
                      >
                        <input
                          id={`single-why-label-${index}`}
                          type="text"
                          value={item.label}
                          onChange={(event) =>
                            updateWhyChooseUsPointField(
                              index,
                              "label",
                              event.target.value,
                            )
                          }
                          placeholder={`Enter feature ${index + 1} name`}
                          className={getInputClassName(
                            Boolean(
                              fieldErrors[`whyChooseUs.points.${index}.label`],
                            ),
                          )}
                        />
                      </FormField>

                      <FormField
                        label="Feature Description"
                        htmlFor={`single-why-detail-${index}`}
                        error={
                          fieldErrors[`whyChooseUs.points.${index}.detail`]
                        }
                      >
                        <textarea
                          id={`single-why-detail-${index}`}
                          rows={3}
                          value={item.detail}
                          onChange={(event) =>
                            updateWhyChooseUsPointField(
                              index,
                              "detail",
                              event.target.value,
                            )
                          }
                          placeholder={`Enter feature ${index + 1} description`}
                          className={`${getInputClassName(
                            Boolean(
                              fieldErrors[`whyChooseUs.points.${index}.detail`],
                            ),
                          )} resize-none`}
                        />
                      </FormField>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard
              eyebrow="Section 06"
              title="Our Locations"
              description="Add the location section title, detail, and multiple location entries."
            >
              <div className="space-y-5">
                <FormField
                  label="Title"
                  htmlFor="single-locations-title"
                  error={fieldErrors["locations.title"]}
                >
                  <input
                    id="single-locations-title"
                    type="text"
                    value={formData.locations.title}
                    onChange={(event) =>
                      updateLocationsField("title", event.target.value)
                    }
                    placeholder="Enter locations title"
                    className={getInputClassName(
                      Boolean(fieldErrors["locations.title"]),
                    )}
                  />
                </FormField>

                <FormField
                  label="Detail"
                  htmlFor="single-locations-detail"
                  error={fieldErrors["locations.detail"]}
                >
                  <textarea
                    id="single-locations-detail"
                    rows={4}
                    value={formData.locations.detail}
                    onChange={(event) =>
                      updateLocationsField("detail", event.target.value)
                    }
                    placeholder="Write location section detail"
                    className={`${getInputClassName(
                      Boolean(fieldErrors["locations.detail"]),
                    )} resize-none`}
                  />
                </FormField>

                <PanelHeader
                  title="Location Inputs"
                  detail="Every location is saved as part of one array."
                  actionLabel="Add Location"
                  onAction={addLocation}
                />

                <div className="space-y-4">
                  {formData.locations.locations.map((item, index) => (
                    <div
                      key={`single-location-${index}`}
                      className="rounded-[26px] border border-slate-200/80 bg-slate-50/80 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex-1">
                          <FormField
                            label={`Location ${index + 1}`}
                            htmlFor={`single-location-input-${index}`}
                            error={fieldErrors[`locations.items.${index}`]}
                          >
                            <input
                              id={`single-location-input-${index}`}
                              type="text"
                              value={item}
                              onChange={(event) =>
                                updateLocationValue(index, event.target.value)
                              }
                              placeholder={`Enter location ${index + 1}`}
                              className={getInputClassName(
                                Boolean(
                                  fieldErrors[`locations.items.${index}`],
                                ),
                              )}
                            />
                          </FormField>
                        </div>

                        <DeleteButton
                          label={`Delete location ${index + 1}`}
                          onClick={() => removeLocation(index)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Section 07"
              title="Testimonials"
              description="Add the title and multiple user or employee testimonials."
            >
              <div className="space-y-5">
                <FormField
                  label="Title"
                  htmlFor="single-testimonial-title"
                  error={fieldErrors["testimonials.title"]}
                >
                  <input
                    id="single-testimonial-title"
                    type="text"
                    value={formData.testimonials.title}
                    onChange={(event) =>
                      updateTestimonialsField("title", event.target.value)
                    }
                    placeholder="Enter testimonial title"
                    className={getInputClassName(
                      Boolean(fieldErrors["testimonials.title"]),
                    )}
                  />
                </FormField>

                <PanelHeader
                  title="Testimonial Entries"
                  detail="Add multiple names, designations, and messages."
                  actionLabel="Add Testimonial"
                  onAction={addTestimonial}
                />

                <div className="space-y-4">
                  {formData.testimonials.testimonials.map((item, index) => (
                    <div
                      key={`single-testimonial-${index}`}
                      className="rounded-[26px] border border-slate-200/80 bg-slate-50/80 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                          Testimonial {index + 1}
                        </p>
                        <DeleteButton
                          label={`Delete testimonial ${index + 1}`}
                          onClick={() => removeTestimonial(index)}
                        />
                      </div>

                      <div className="mt-4 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <FormField
                            label="User / Employee Name"
                            htmlFor={`single-testimonial-name-${index}`}
                            error={
                              fieldErrors[`testimonials.items.${index}.name`]
                            }
                          >
                            <input
                              id={`single-testimonial-name-${index}`}
                              type="text"
                              value={item.name}
                              onChange={(event) =>
                                updateTestimonialItemField(
                                  index,
                                  "name",
                                  event.target.value,
                                )
                              }
                              placeholder={`Enter name ${index + 1}`}
                              className={getInputClassName(
                                Boolean(
                                  fieldErrors[`testimonials.items.${index}.name`],
                                ),
                              )}
                            />
                          </FormField>

                          <FormField
                            label="Designation / Role"
                            htmlFor={`single-testimonial-role-${index}`}
                            error={
                              fieldErrors[`testimonials.items.${index}.role`]
                            }
                          >
                            <input
                              id={`single-testimonial-role-${index}`}
                              type="text"
                              value={item.role}
                              onChange={(event) =>
                                updateTestimonialItemField(
                                  index,
                                  "role",
                                  event.target.value,
                                )
                              }
                              placeholder={`Enter role ${index + 1}`}
                              className={getInputClassName(
                                Boolean(
                                  fieldErrors[`testimonials.items.${index}.role`],
                                ),
                              )}
                            />
                          </FormField>
                        </div>

                        <FormField
                          label="Message"
                          htmlFor={`single-testimonial-message-${index}`}
                          error={
                            fieldErrors[`testimonials.items.${index}.message`]
                          }
                        >
                          <textarea
                            id={`single-testimonial-message-${index}`}
                            rows={4}
                            value={item.message}
                            onChange={(event) =>
                              updateTestimonialItemField(
                                index,
                                "message",
                                event.target.value,
                              )
                            }
                            placeholder={`Enter message ${index + 1}`}
                            className={`${getInputClassName(
                              Boolean(
                                fieldErrors[
                                  `testimonials.items.${index}.message`
                                ],
                              ),
                            )} resize-none`}
                          />
                        </FormField>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="sticky bottom-4 z-10">
            <div className="rounded-[28px] border border-blue-100 bg-white/92 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Ready to create the home page content?
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    All sections will be validated together and submitted in one
                    structured payload.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-500 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:shadow-none"
                >
                  {isSubmitting ? "Creating..." : "Create Home Page"}
                </button>
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
    <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-200/80 bg-linear-to-r from-white via-slate-50 to-blue-50 px-5 py-5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
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

function PanelHeader({ title, detail, actionLabel, onAction }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        {/* <p className="mt-1 text-sm text-slate-500">{detail}</p> */}
      </div>

      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
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

function ImageUploadCard({ id, previewUrl, onChange, placeholder }) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[26px] border-2 border-dashed border-blue-200 bg-slate-50 transition hover:border-blue-400 hover:bg-blue-50"
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
          <div className="overflow-hidden rounded-[22px] border border-blue-100 bg-white">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-56 w-full object-cover sm:h-64"
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

function MessageBanner({ tone = "error", children }) {
  const toneClassName =
    tone === "success"
      ? "border-emerald-100 bg-emerald-50 text-emerald-600"
      : "border-red-100 bg-red-50 text-red-500";

  return (
    <div className={`rounded-[24px] border px-4 py-4 text-sm font-medium ${toneClassName}`}>
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

function CloseIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
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

export default CreateHomePageForm;
