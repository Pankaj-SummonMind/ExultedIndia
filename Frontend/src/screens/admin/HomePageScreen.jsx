import { useEffect, useMemo, useState } from "react";
import { PencilLine } from "lucide-react";
import HeroCardForm from "../../components/HomePageForm.jsx/HeroCardForm";
import HeroDetailForm from "../../components/HomePageForm.jsx/HeroDetailForm";
import HeroLocationForm from "../../components/HomePageForm.jsx/HeroLocationForm";
import HomeCategoryForm from "../../components/HomePageForm.jsx/HomeCategoryForm";
import HomeJoinUsForm from "../../components/HomePageForm.jsx/HomeJoinUsForm";
import HomeTestimonialForm from "../../components/HomePageForm.jsx/HomeTestimonialForm";
import HomeWhyChooseUs from "../../components/HomePageForm.jsx/HomeWhyChooseUs";
import {
  useGetHomePageQuery,
  useUpdateHomePageMutation,
} from "../../services/api";
import CreateHomePageForm from "../../components/HomePageForm.jsx/CreateHomePageForm";
import Loader from "../../components/loader/Loader";
import toast from "react-hot-toast";

const INITIAL_HERO_CARD = {
  id: "hero-card",
  title: "",
  subHeading: "",
  description: "",
  image: "",
};

const INITIAL_HERO_DETAIL_CARD = {
  id: "hero-detail",
  title: "",
  stats: [
    { key: "", value: "" },
    { key: "", value: "" },
    { key: "", value: "" },
  ],
  image: "",
};

const INITIAL_CATEGORY_CARD = {
  id: "home-category",
  title: "",
  categories: [],
};

const INITIAL_WHY_CHOOSE_US_CARD = {
  id: "why-choose-us",
  title: "",
  points: [{ label: "", detail: "" }],
};

const INITIAL_LOCATIONS_CARD = {
  id: "locations",
  title: "",
  detail: "",
  locations: [""],
};

const INITIAL_TESTIMONIAL_CARD = {
  id: "testimonial",
  title: "",
  testimonials: [{ name: "", role: "", message: "" }],
};

const INITIAL_JOIN_US_CARD = {
  id: "join-us",
  title: "",
  detail: "",
};

const INITIAL_HOME_PAGE_STATE = {
  heroCard: INITIAL_HERO_CARD,
  heroDetailCard: INITIAL_HERO_DETAIL_CARD,
  categoryCard: INITIAL_CATEGORY_CARD,
  whyChooseUsCard: INITIAL_WHY_CHOOSE_US_CARD,
  locationsCard: INITIAL_LOCATIONS_CARD,
  testimonialCard: INITIAL_TESTIMONIAL_CARD,
  joinUsCard: INITIAL_JOIN_US_CARD,
};

const cardBaseClass =
  "relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6";

function HomePageScreen() {
  const {
    data: homePageResponse,
    isLoading:ishomeLoading,
    error,
  } = useGetHomePageQuery();
  const [updateHomePage,{isLoading:isUpdateLoading}] = useUpdateHomePageMutation();
  const [activeForm, setActiveForm] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pageState, setPageState] = useState(INITIAL_HOME_PAGE_STATE);

  console.log("home page response in home page screen:", homePageResponse);

  const isLoading = ishomeLoading || isUpdateLoading;

  useEffect(() => {
      if (error) {
        toast.error(error?.data?.message || "Internal server error");
      }
    }, [error]);

  const homePageData = useMemo(
    () => getHomePageSource(homePageResponse),
    [homePageResponse],
  );

  useEffect(() => {
    if (!homePageData) {
      return;
    }

    setPageState(normalizeHomePageState(homePageData));
  }, [homePageData]);

  const openForm = (formKey) => {
    setActiveForm(formKey);
  };

  const closeForm = () => {
    setActiveForm(null);
  };

  const submitHomePageUpdate = async (payload, transformState) => {
    try {
      const response = await updateHomePage(payload).unwrap();
      const nextData = getHomePageSource(response);
  
      if (nextData) {
        const normalizedState = normalizeHomePageState(nextData);
  
        setPageState(
          transformState ? transformState(normalizedState) : normalizedState,
        );
      }
      console.log("home page update response:", response);
      toast.success(response?.message || "Home page updated successfully!");
    } catch (error) {
      console.error("Error updating home page:", error);
      toast.error(error?.data?.message || "Failed to update home page. Please try again.");
    }
  };

  const handleHeroCardSubmit = async (_, values) => {
    const payload = new FormData();
    payload.append(
      "hero",
      JSON.stringify({
        title: values.title,
        subTitle: values.subHeading,
        detail: values.description,
      }),
    );

    if (values.image) {
      payload.append("heroImage", values.image);
    }

    await submitHomePageUpdate(payload);
  };

  const handleHeroDetailSubmit = async (_, values) => {
    const payload = new FormData();
    payload.append(
      "heroDetail",
      JSON.stringify({
        title: values.title,
        stats: values.stats.map((item) => ({
          label: item.key,
          value: item.value,
        })),
      }),
    );

    if (values.image) {
      payload.append("heroDetailImage", values.image);
    }

    await submitHomePageUpdate(payload);
  };

  const handleCategorySubmit = async (_, values) => {
    const payload = new FormData();
    payload.append(
      "homeCategory",
      JSON.stringify({
        title: values.title,
        categories: values.categories.map((item) => item.id),
      }),
    );

    await submitHomePageUpdate(payload, (normalizedState) => ({
      ...normalizedState,
      categoryCard: {
        ...normalizedState.categoryCard,
        title: values.title,
        categories: values.categories,
      },
    }));
  };

  const handleWhyChooseUsSubmit = async (_, values) => {
    const payload = new FormData();
    payload.append(
      "whyChooseUs",
      JSON.stringify({
        title: values.title,
        points: values.points,
      }),
    );

    await submitHomePageUpdate(payload);
  };

  const handleLocationsSubmit = async (_, values) => {
    const payload = new FormData();
    payload.append(
      "locations",
      JSON.stringify({
        title: values.title,
        detail: values.detail,
        locations: values.locations,
      }),
    );

    await submitHomePageUpdate(payload);
  };

  const handleTestimonialSubmit = async (_, values) => {
    const payload = new FormData();
    payload.append(
      "testimonials",
      JSON.stringify(
        values.testimonials.map((item) => ({
          title: values.title,
          name: item.name,
          designation: item.role,
          message: item.message,
        })),
      ),
    );

    await submitHomePageUpdate(payload);
  };

  const handleJoinUsSubmit = async (_, values) => {
    const payload = new FormData();
    payload.append(
      "joinUs",
      JSON.stringify({
        title: values.title,
        detail: values.detail,
      }),
    );

    await submitHomePageUpdate(payload);
  };

  // if (ishomeLoading || isUpdateLoading) {
  //   return (
  //     <section className="flex min-h-[70vh] items-center justify-center">
  //       <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
  //     </section>
  //   );
  // }

  if (!homePageData && !showCreateForm) {
    return (
      <section className="flex min-h-[calc(100vh-160px)] flex-col gap-6">
        <Loader isLoading={isLoading} />
        <div className="flex mt-5 justify-center">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg sm:p-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <svg
                className="h-10 w-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-10.5z"
                />
              </svg>
            </div>

            <h2 className="mt-3 text-xl font-bold text-slate-800">
              No Home Page Data Found
            </h2>

            {error && error?.status !== 404 ? (
              <p className="mt-3 text-sm leading-6 text-red-500 sm:text-sm">
                {error?.data?.message || "Unable to load home page data."}
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="mt-3 inline-flex items-center rounded-2xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
              + Create Home Page
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (showCreateForm) {
    return <CreateHomePageForm setShowCreateForm={setShowCreateForm} />;
  }

  const {
    heroCard,
    heroDetailCard,
    categoryCard,
    whyChooseUsCard,
    locationsCard,
    testimonialCard,
    joinUsCard,
  } = pageState;

  const displayWhyChooseUsPoints = getDisplayWhyChooseUsPoints(
    whyChooseUsCard.points,
  );
  const displayLocations = getDisplayLocations(locationsCard.locations);
  const displayTestimonials = getDisplayTestimonials(
    testimonialCard.testimonials,
  );

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">

      <div className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_100%)] p-4 sm:p-5">
        <div className="grid gap-5 xl:grid-cols-2">
          <ContentCard
            heading="Hero Card"
            className="xl:col-span-2"
            bodyClassName="gap-6"
            onActionClick={() => openForm("hero-card")}
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:items-start">
              <div className="space-y-5">
                <DetailRow
                  label="Title"
                  value={heroCard.title}
                  fallback="Hero title not added yet."
                  valueClassName="text-2xl"
                />
                <DetailRow
                  label="Sub-Heading"
                  value={heroCard.subHeading}
                  fallback="Hero sub-heading not added yet."
                />
                <DetailRow
                  label="Description"
                  value={heroCard.description}
                  fallback="Hero description not added yet."
                  isParagraph
                />
              </div>

              <ImagePreview
                src={heroCard.image}
                alt="Hero section preview"
                className="h-full min-h-72"
              />
            </div>
          </ContentCard>

          <ContentCard
            heading="Hero Detail"
            onActionClick={() => openForm("hero-detail")}
          >
            <DetailRow
              label="Title"
              value={heroDetailCard.title}
              fallback="Hero detail title not added yet."
            />

            <div className="mt-5 space-y-3">
              {heroDetailCard.stats.map((item, index) => (
                <KeyValueRow
                  key={`${item.key}-${index}`}
                  label={item.key}
                  value={item.value}
                />
              ))}
            </div>

            <ImagePreview
              src={heroDetailCard.image}
              alt="Hero detail preview"
              className="mt-5 min-h-64"
            />
          </ContentCard>

          <ContentCard
            heading="Category"
            onActionClick={() => openForm("home-category")}
          >
            <DetailRow
              label="Title"
              value={categoryCard.title}
              fallback="Category section title not added yet."
            />

            <div className="mt-5 flex flex-wrap gap-3">
              {(categoryCard.categories.length > 0
                ? categoryCard.categories
                : [{ id: "fallback-category", name: "No categories selected yet." }]
              ).map((category, index) => (
                <span
                  key={`${getCategoryLabel(category)}-${index}`}
                  className="rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  {getCategoryLabel(category)}
                </span>
              ))}
            </div>
          </ContentCard>

          <ContentCard
            heading="Why Choose Us"
            className="xl:col-span-2"
            onActionClick={() => openForm("why-choose-us")}
          >
            <DetailRow
              label="Title"
              value={whyChooseUsCard.title}
              fallback="Why choose us title not added yet."
            />

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {displayWhyChooseUsPoints.map((point, index) => (
                <div
                  key={`${point.label}-${index}`}
                  className="border-t border-slate-200/80 pt-4 first:border-t-0 first:pt-0 md:first:border-t md:first:pt-4"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
                    {getDisplayText(point.label, `Feature ${index + 1} not added yet`)}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {getDisplayText(
                      point.detail,
                      "Feature description not added yet.",
                    )}
                  </p>
                </div>
              ))}
            </div>
          </ContentCard>

          <ContentCard
            heading="Our Locations"
            onActionClick={() => openForm("locations")}
          >
            <DetailRow
              label="Title"
              value={locationsCard.title}
              fallback="Locations title not added yet."
            />
            <DetailRow
              label="Detail"
              value={locationsCard.detail}
              fallback="Locations detail not added yet."
              isParagraph
              className="mt-5"
            />

            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {displayLocations.map((location, index) => (
                <li
                  key={`${location}-${index}`}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  {getDisplayText(location, `Location ${index + 1} not added yet.`)}
                </li>
              ))}
            </ul>
          </ContentCard>

          <ContentCard
            heading="Testimonial"
            onActionClick={() => openForm("testimonial")}
          >
            <DetailRow
              label="Title"
              value={testimonialCard.title}
              fallback="Testimonial title not added yet."
            />

            <div className="mt-5 space-y-5">
              {displayTestimonials.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="border-t border-slate-200/80 pt-5 first:border-t-0 first:pt-0"
                >
                  <DetailRow
                    label="User / Employee Name"
                    value={item.name}
                    fallback={`Testimonial ${index + 1} name not added yet.`}
                  />
                  <DetailRow
                    label="Designation / Role"
                    value={item.role}
                    fallback={`Testimonial ${index + 1} role not added yet.`}
                    className="mt-5"
                  />
                  <DetailRow
                    label="Message"
                    value={item.message}
                    fallback={`Testimonial ${index + 1} message not added yet.`}
                    isParagraph
                    className="mt-5"
                  />
                </div>
              ))}
            </div>
          </ContentCard>

          <ContentCard
            heading="Join Us"
            className="xl:col-span-2"
            onActionClick={() => openForm("join-us")}
          >
            <DetailRow
              label="Title"
              value={joinUsCard.title}
              fallback="Join us title not added yet."
            />
            <DetailRow
              label="Detail"
              value={joinUsCard.detail}
              fallback="Join us detail not added yet."
              isParagraph
              className="mt-5"
            />
          </ContentCard>
        </div>
      </div>

      <HeroCardForm
        isOpen={activeForm === "hero-card"}
        onClose={closeForm}
        activeHeroCard={heroCard}
        onSubmit={handleHeroCardSubmit}
      />

      <HeroDetailForm
        isOpen={activeForm === "hero-detail"}
        onClose={closeForm}
        activeHeroDetail={heroDetailCard}
        onSubmit={handleHeroDetailSubmit}
      />

      <HomeCategoryForm
        isOpen={activeForm === "home-category"}
        onClose={closeForm}
        activeHomeCategory={categoryCard}
        onSubmit={handleCategorySubmit}
      />

      <HomeWhyChooseUs
        isOpen={activeForm === "why-choose-us"}
        onClose={closeForm}
        activeWhyChooseUs={whyChooseUsCard}
        onSubmit={handleWhyChooseUsSubmit}
      />

      <HeroLocationForm
        isOpen={activeForm === "locations"}
        onClose={closeForm}
        activeHeroLocation={locationsCard}
        onSubmit={handleLocationsSubmit}
      />

      <HomeTestimonialForm
        isOpen={activeForm === "testimonial"}
        onClose={closeForm}
        activeTestimonial={testimonialCard}
        onSubmit={handleTestimonialSubmit}
      />

      <HomeJoinUsForm
        isOpen={activeForm === "join-us"}
        onClose={closeForm}
        activeJoinUs={joinUsCard}
        onSubmit={handleJoinUsSubmit}
      />
    </section>
  );
}

function normalizeHomePageState(data) {
  const testimonials = Array.isArray(data?.testimonials) ? data.testimonials : [];
  const testimonialTitle =
    testimonials.find((item) => Boolean(item?.title?.trim?.()))?.title || "";

  return {
    heroCard: {
      id: data?._id || INITIAL_HERO_CARD.id,
      title: data?.hero?.title || "",
      subHeading: data?.hero?.subTitle || data?.hero?.sub_heading || "",
      description: data?.hero?.detail || data?.hero?.description || "",
      image: getImageUrl(data?.hero?.image),
    },
    heroDetailCard: {
      id: data?._id || INITIAL_HERO_DETAIL_CARD.id,
      title: data?.heroDetail?.title || "",
      stats: normalizeHeroDetailStats(data?.heroDetail?.stats),
      image: getImageUrl(data?.heroDetail?.image),
    },
    categoryCard: {
      id: data?._id || INITIAL_CATEGORY_CARD.id,
      title: data?.homeCategory?.title || "",
      categories: normalizeCategories(data?.homeCategory?.categories),
    },
    whyChooseUsCard: {
      id: data?._id || INITIAL_WHY_CHOOSE_US_CARD.id,
      title: data?.whyChooseUs?.title || "",
      points: normalizeWhyChooseUsPoints(data?.whyChooseUs?.points),
    },
    locationsCard: {
      id: data?._id || INITIAL_LOCATIONS_CARD.id,
      title: data?.locations?.title || "",
      detail: data?.locations?.detail || "",
      locations:
        Array.isArray(data?.locations?.locations) &&
        data.locations.locations.length > 0
          ? data.locations.locations.map((item) => `${item || ""}`)
          : [""],
    },
    testimonialCard: {
      id: data?._id || INITIAL_TESTIMONIAL_CARD.id,
      title: testimonialTitle,
      testimonials:
        testimonials.length > 0
          ? testimonials.map((item) => ({
              name: item?.name || "",
              role: item?.designation || item?.role || "",
              message: item?.message || "",
            }))
          : [{ name: "", role: "", message: "" }],
    },
    joinUsCard: {
      id: data?._id || INITIAL_JOIN_US_CARD.id,
      title: data?.joinUs?.title || "",
      detail: data?.joinUs?.detail || "",
    },
  };
}

function normalizeHeroDetailStats(stats) {
  const source = Array.isArray(stats) ? stats.slice(0, 3) : [];

  return Array.from({ length: 3 }, (_, index) => ({
    key: source[index]?.label || source[index]?.key || "",
    value: source[index]?.value || "",
  }));
}

function normalizeCategories(categories) {
  if (!Array.isArray(categories)) {
    return [];
  }

  return categories
    .map((item) => {
      if (typeof item === "string") {
        return {
          id: item,
          name: item,
        };
      }

      const id = item?._id || item?.id || "";
      const name = item?.categories_name || item?.name || item?.title || "";

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

function normalizeWhyChooseUsPoints(points) {
  if (!Array.isArray(points) || points.length === 0) {
    return [{ label: "", detail: "" }];
  }

  return points.map((item) => ({
    label: item?.label || "",
    detail: item?.detail || "",
  }));
}

function ContentCard({
  heading,
  children,
  className = "",
  bodyClassName = "",
  onActionClick,
}) {
  return (
    <article className={`${cardBaseClass} ${className}`.trim()}>
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white to-transparent" />

      <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-600">
            Home Page
          </p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">{heading}</h2>
        </div>

        <button
          type="button"
          onClick={onActionClick}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700"
        >
          <PencilLine className="h-4 w-4" />
          Edit
        </button>
      </div>

      <div className={`mt-5 flex flex-col ${bodyClassName}`.trim()}>
        {children}
      </div>
    </article>
  );
}

function DetailRow({
  label,
  value,
  className = "",
  valueClassName = "",
  isParagraph = false,
  fallback = "Not added yet.",
}) {
  const ValueTag = isParagraph ? "p" : "div";

  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
      </p>
      <ValueTag
        className={`mt-2 text-base font-semibold leading-7 text-slate-800 ${valueClassName}`.trim()}
      >
        {getDisplayText(value, fallback)}
      </ValueTag>
    </div>
  );
}

function KeyValueRow({ label, value }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/85 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {getDisplayText(label, "Label not added yet")}
      </p>
      <p className="text-sm font-semibold text-slate-700 sm:text-right">
        {getDisplayText(value, "Value not added yet")}
      </p>
    </div>
  );
}

function ImagePreview({ src, alt, className = "" }) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-[26px] border border-slate-200 bg-slate-100 px-4 text-center text-sm font-medium text-slate-400 shadow-[0_16px_40px_rgba(148,163,184,0.16)] ${className}`.trim()}
      >
        Image not uploaded yet
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-[26px] border border-slate-200 bg-slate-100 shadow-[0_16px_40px_rgba(148,163,184,0.16)] ${className}`.trim()}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
}

function getCategoryLabel(category) {
  if (typeof category === "string") {
    return getDisplayText(category, "Category not added yet.");
  }

  return getDisplayText(
    category?.name || category?.categories_name || category?.title,
    "Category not added yet.",
  );
}

function getHomePageSource(response) {
  if (!response) {
    return null;
  }

  if (response?.data && typeof response.data === "object" && !Array.isArray(response.data)) {
    return response.data;
  }

  if (response?._id) {
    return response;
  }

  return null;
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

function getDisplayText(value, fallback) {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number") {
    return `${value}`;
  }

  return fallback;
}

function getDisplayWhyChooseUsPoints(points) {
  if (!Array.isArray(points) || points.length === 0) {
    return [{ label: "", detail: "" }];
  }

  return points;
}

function getDisplayLocations(locations) {
  if (!Array.isArray(locations) || locations.length === 0) {
    return [""];
  }

  return locations;
}

function getDisplayTestimonials(testimonials) {
  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    return [{ name: "", role: "", message: "" }];
  }

  return testimonials;
}

export default HomePageScreen;
