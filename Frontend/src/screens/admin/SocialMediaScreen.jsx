import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";

const PRESET_STYLES = {
  instagram: {
    label: "Instagram",
    accent: "from-pink-500 via-fuchsia-500 to-orange-400",
    badge: "bg-pink-50 text-pink-700 border-pink-100",
    ring: "shadow-pink-200/70",
    placeholder: "https://instagram.com/exultedindia",
    helper: "Profile URL ya handle link add karein",
  },
  email: {
    label: "Email",
    accent: "from-sky-500 via-blue-500 to-cyan-400",
    badge: "bg-sky-50 text-sky-700 border-sky-100",
    ring: "shadow-sky-200/70",
    placeholder: "support@exultedindia.com",
    helper: "Primary business email id",
  },
  twitter: {
    label: "Twitter / X",
    accent: "from-slate-700 via-slate-800 to-slate-950",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    ring: "shadow-slate-200/70",
    placeholder: "https://x.com/exultedindia",
    helper: "Public handle ya profile URL",
  },
  whatsapp: {
    label: "WhatsApp",
    accent: "from-emerald-500 via-green-500 to-lime-400",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    ring: "shadow-emerald-200/70",
    placeholder: "+91 98765 43210",
    helper: "Country code ke saath business number",
  },
  mobile: {
    label: "Mobile Number",
    accent: "from-violet-500 via-indigo-500 to-blue-500",
    badge: "bg-violet-50 text-violet-700 border-violet-100",
    ring: "shadow-violet-200/70",
    placeholder: "+91 98765 43210",
    helper: "Call ke liye visible contact number",
  },
  facebook: {
    label: "Facebook",
    accent: "from-blue-600 via-blue-500 to-cyan-400",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    ring: "shadow-blue-200/70",
    placeholder: "https://facebook.com/exultedindia",
    helper: "Brand page ka direct URL",
  },
  youtube: {
    label: "YouTube",
    accent: "from-red-500 via-rose-500 to-orange-400",
    badge: "bg-red-50 text-red-700 border-red-100",
    ring: "shadow-red-200/70",
    placeholder: "https://youtube.com/@exultedindia",
    helper: "Channel link add karein",
  },
  linkedin: {
    label: "LinkedIn",
    accent: "from-cyan-700 via-sky-600 to-blue-500",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-100",
    ring: "shadow-cyan-200/70",
    placeholder: "https://linkedin.com/company/exultedindia",
    helper: "Company profile ya page link",
  },
  website: {
    label: "Website",
    accent: "from-amber-500 via-orange-500 to-yellow-400",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    ring: "shadow-amber-200/70",
    placeholder: "https://www.exultedindia.com",
    helper: "Main website ya landing page URL",
  },
};

const EMPTY_FORM = {
  key: "",
  value: "",
};

function SocialMediaScreen() {
  const {
    data: socialMediaResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = api.useGetAllSocialMediaQuery();

  const [createSocialMedia] = api.useCreateSocialMediaMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiBaseUrl = String(import.meta.env.VITE_API_URL || "").replace(
    /\/$/,
    "",
  );
  const isEmptyResponse = error?.status === 404;
  const socialAccounts = useMemo(
    () =>
      Array.isArray(socialMediaResponse?.data) ? socialMediaResponse.data : [],
    [socialMediaResponse?.data],
  );

  useEffect(() => {
    if (isModalOpen) {
      return;
    }

    setFormData(EMPTY_FORM);
    setActiveAccount(null);
    setFormError("");
    setIsSubmitting(false);
  }, [isModalOpen]);

  const accountRows = useMemo(
    () =>
      socialAccounts.map((item, index) => {
        const preset = getPreset(item.key, item.value);

        return {
          id: item._id ?? `${item.key}-${index}`,
          key: item.key ?? "",
          value: item.value ?? "",
          displayKey: preset.label,
          createdAt: formatDate(item.createdAt),
          iconType: preset.iconType,
          accent: preset.accent,
          badge: preset.badge,
          ring: preset.ring,
          helper: preset.helper,
          actionHref: buildActionHref(item.key, item.value),
          actionLabel: getActionLabel(item.key, item.value),
        };
      }),
    [socialAccounts],
  );

  const filteredRows = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return accountRows;
    }

    return accountRows.filter((item) =>
      [item.key, item.displayKey, item.value].some((field) =>
        String(field).toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [accountRows, deferredSearch]);

  const stats = useMemo(() => {
    const directLinks = accountRows.filter((item) =>
      /^(https?:\/\/|www\.)/i.test(item.value),
    ).length;
    const contactChannels = accountRows.filter((item) =>
      /(email|mail|phone|mobile|call|whatsapp)/i.test(item.key),
    ).length;

    return [
      {
        label: "Total Accounts",
        value: String(accountRows.length).padStart(2, "0"),
        accent:
          "from-slate-900 via-slate-800 to-blue-900 text-white shadow-slate-200",
      },
      {
        label: "Direct Links",
        value: String(directLinks).padStart(2, "0"),
        accent:
          "from-sky-500 via-blue-500 to-cyan-400 text-white shadow-blue-200",
      },
      {
        label: "Contact Channels",
        value: String(contactChannels).padStart(2, "0"),
        accent:
          "from-emerald-500 via-green-500 to-lime-400 text-white shadow-emerald-200",
      },
    ];
  }, [accountRows]);

  const selectedPreset = getPreset(formData.key, formData.value);

  const openCreateModal = () => {
    setActiveAccount(null);
    setFormData(EMPTY_FORM);
    setFormError("");
    setIsModalOpen(true);
  };

  const openUpdateModal = (account) => {
    setActiveAccount(account);
    setFormData({
      key: account.key,
      value: account.value,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedKey = formData.key.trim();
    const trimmedValue = formData.value.trim();

    if (!trimmedKey || !trimmedValue) {
      setFormError("Social media key aur value dono required hain.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      if (activeAccount) {
        const response = await fetch(
          `${apiBaseUrl}/api/socialMedia/${activeAccount.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              key: trimmedKey,
              value: trimmedValue,
            }),
          },
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result?.message || "Account update nahi ho paya.");
        }
      } else {
        await createSocialMedia({
          key: trimmedKey,
          value: trimmedValue,
        }).unwrap();
      }

      await refetch();
      setIsModalOpen(false);
    } catch (submitError) {
      setFormError(
        submitError?.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.14),transparent_28%),linear-gradient(145deg,#ffffff,#f8fbff_52%,#f5f8ff)] p-5 shadow-[0_24px_70px_rgba(148,163,184,0.16)] sm:p-6 lg:p-7">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white to-transparent" />

        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          {/* <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-blue-600 shadow-sm backdrop-blur">
              <PulseIcon className="h-4 w-4" />
              Social Media Control
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Beautiful and responsive social account management screen
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Instagram, email, WhatsApp, mobile number, website aur baaki
              contact channels ko ek clean admin experience me manage karein.
            </p>
          </div> */}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.18)] transition hover:bg-slate-800"
            >
              <PlusIcon className="h-5 w-5" />
              Add Account
            </button>

            <button
              type="button"
              onClick={() => {
                if (filteredRows[0]) {
                  openUpdateModal(filteredRows[0]);
                }
              }}
              disabled={!filteredRows.length}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/85 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-55"
            >
              <EditIcon className="h-5 w-5" />
              Update Account
            </button>
          </div>
        </div>

        {/* <div className="mt-6 grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <article
              key={item.label}
              className={`overflow-hidden rounded-[28px] bg-linear-to-br ${item.accent} p-px shadow-lg`}
            >
              <div className="rounded-[27px] bg-white/12 p-5 backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/75">
                  {item.label}
                </p>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <p className="text-4xl font-black tracking-tight text-white">
                    {item.value}
                  </p>
                  <span className="rounded-2xl bg-white/18 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                    Live
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div> */}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2.2fr)_360px]">
        {/* <div className="flex min-h-0 flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
          <div className="flex flex-col gap-4 border-b border-blue-100 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-500">
                Directory
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-800 sm:text-xl">
                Social media account list
              </h3>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative block w-full sm:w-80">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name, key or value"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <RefreshIcon className="h-5 w-5" />
                Refresh
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4">
            <div className="hidden h-full overflow-auto rounded-3xl border border-blue-100 bg-slate-50/80 lg:block">
              <div className="min-w-220">
                <table className="w-full border-separate border-spacing-0">
                  <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur">
                    <tr>
                      <TableHeading className="rounded-tl-3xl">
                        Serial Number
                      </TableHeading>
                      <TableHeading>Platform</TableHeading>
                      <TableHeading>Key</TableHeading>
                      <TableHeading>Value</TableHeading>
                      <TableHeading>Created At</TableHeading>
                      <TableHeading className="rounded-tr-3xl">
                        Actions
                      </TableHeading>
                    </tr>
                  </thead>

                  <tbody>
                    {renderTableContent({
                      isLoading,
                      isFetching,
                      isEmptyResponse,
                      hasError: Boolean(error) && !isEmptyResponse,
                      filteredRows,
                      onUpdate: openUpdateModal,
                      onRetry: refetch,
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4 lg:hidden">
              {isLoading || isFetching
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="animate-pulse rounded-[28px] border border-slate-100 bg-slate-50 p-5"
                    >
                      <div className="h-4 w-28 rounded-full bg-slate-200" />
                      <div className="mt-4 h-6 w-40 rounded-full bg-slate-200" />
                      <div className="mt-4 h-20 rounded-3xl bg-slate-200" />
                    </div>
                  ))
                : null}

              {!isLoading && !isFetching && isEmptyResponse ? (
                <EmptyState onCreate={openCreateModal} />
              ) : null}

              {!isLoading &&
              !isFetching &&
              Boolean(error) &&
              !isEmptyResponse ? (
                <InlineErrorState onRetry={refetch} />
              ) : null}

              {!isLoading &&
              !isFetching &&
              !error &&
              !filteredRows.length &&
              accountRows.length ? (
                <NoSearchResult onReset={() => setSearchTerm("")} />
              ) : null}

              {!isLoading &&
                !isFetching &&
                !error &&
                filteredRows.map((account, index) => (
                  <article
                    key={account.id}
                    className={`overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_16px_40px_rgba(148,163,184,0.12)]`}
                  >
                    <div className={`bg-linear-to-r ${account.accent} p-[1px]`}>
                      <div className="rounded-[27px] bg-white p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br ${account.accent} text-white shadow-lg ${account.ring}`}
                            >
                              <PlatformIcon
                                type={account.iconType}
                                className="h-6 w-6"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                                #{String(index + 1).padStart(2, "0")}
                              </p>
                              <h4 className="mt-1 text-lg font-bold text-slate-900">
                                {account.displayKey}
                              </h4>
                            </div>
                          </div>

                          <span
                            className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold ${account.badge}`}
                          >
                            {account.key}
                          </span>
                        </div>

                        <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50/90 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                            Value
                          </p>
                          <p className="mt-2 break-all text-sm leading-7 text-slate-700">
                            {account.value}
                          </p>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-sm text-slate-500">
                            Created on{" "}
                            <span className="font-semibold text-slate-700">
                              {account.createdAt}
                            </span>
                          </p>

                          <div className="flex flex-wrap gap-3">
                            {account.actionHref ? (
                              <a
                                href={account.actionHref}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                              >
                                <ArrowUpRightIcon className="h-4 w-4" />
                                {account.actionLabel}
                              </a>
                            ) : null}

                            <button
                              type="button"
                              onClick={() => openUpdateModal(account)}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                              <EditIcon className="h-4 w-4" />
                              Update Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        </div> */}

        <aside className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-fuchsia-600">
              Quick Preview
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-800">
              Supported account styles
            </h3>
          </div>

          <div className="grid gap-3 p-5 sm:p-6">
            {Object.entries(PRESET_STYLES)
              .slice(0, 6)
              .map(([key, preset]) => (
                <div
                  key={key}
                  className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-slate-50/80 px-4 py-4"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${preset.accent} text-white shadow-lg ${preset.ring}`}
                  >
                    <PlatformIcon
                      type={normalizePlatform(key)}
                      className="h-5 w-5"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800">
                      {preset.label}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {preset.helper}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </aside>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close modal overlay"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/30 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
            <div className={`bg-linear-to-r ${selectedPreset.accent} p-[1px]`}>
              <div className="rounded-[31px] bg-white">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br ${selectedPreset.accent} text-white shadow-lg ${selectedPreset.ring}`}
                    >
                      <PlatformIcon
                        type={selectedPreset.iconType}
                        className="h-6 w-6"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
                        {activeAccount ? "Update Account" : "Create Account"}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-slate-900">
                        {activeAccount
                          ? "Update social media account"
                          : "Add new social media account"}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 sm:p-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <FieldShell
                      label="Social Media Name"
                      hint="Instagram, Email, WhatsApp, Mobile, LinkedIn..."
                    >
                      <input
                        type="text"
                        value={formData.key}
                        onChange={(event) =>
                          handleChange("key", event.target.value)
                        }
                        placeholder="instagram"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    </FieldShell>

                    <FieldShell
                      label="Value / Link"
                      hint={selectedPreset.helper}
                    >
                      <input
                        type="text"
                        value={formData.value}
                        onChange={(event) =>
                          handleChange("value", event.target.value)
                        }
                        placeholder={selectedPreset.placeholder}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    </FieldShell>
                  </div>

                  {/* <div className="mt-5 rounded-[28px] border border-slate-100 bg-slate-50/85 p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${selectedPreset.accent} text-white`}
                      >
                        <PlatformIcon
                          type={selectedPreset.iconType}
                          className="h-5 w-5"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Live preview
                        </p>
                        <p className="text-sm text-slate-500">
                          Form fill karte hi account style yahan preview hoga.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-[24px] border border-white bg-white p-4 shadow-sm">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold ${selectedPreset.badge}`}
                        >
                          {formData.key.trim() || "social-key"}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          {selectedPreset.label}
                        </span>
                      </div>
                      <p className="mt-3 break-all text-sm leading-7 text-slate-600">
                        {formData.value.trim() || selectedPreset.placeholder}
                      </p>
                    </div>
                  </div> */}

                  {formError ? (
                    <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {formError}
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <SpinnerIcon className="h-5 w-5 animate-spin" />
                      ) : activeAccount ? (
                        <EditIcon className="h-5 w-5" />
                      ) : (
                        <PlusIcon className="h-5 w-5" />
                      )}
                      {activeAccount ? "Update Account" : "Add Account"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function renderTableContent({
  isLoading,
  isFetching,
  isEmptyResponse,
  hasError,
  filteredRows,
  onUpdate,
  onRetry,
}) {
  if (isLoading || isFetching) {
    return Array.from({ length: 5 }).map((_, index) => (
      <tr key={`loading-${index}`} className="animate-pulse">
        <TableCell>
          <div className="h-10 w-12 rounded-full bg-slate-200" />
        </TableCell>
        <TableCell>
          <div className="h-5 w-32 rounded-full bg-slate-200" />
        </TableCell>
        <TableCell>
          <div className="h-5 w-24 rounded-full bg-slate-200" />
        </TableCell>
        <TableCell>
          <div className="h-5 w-56 rounded-full bg-slate-200" />
        </TableCell>
        <TableCell>
          <div className="h-5 w-24 rounded-full bg-slate-200" />
        </TableCell>
        <TableCell>
          <div className="h-10 w-32 rounded-2xl bg-slate-200" />
        </TableCell>
      </tr>
    ));
  }

  if (isEmptyResponse) {
    return (
      <tr>
        <td colSpan="6" className="px-6 py-8">
          <EmptyState compact />
        </td>
      </tr>
    );
  }

  if (hasError) {
    return (
      <tr>
        <td colSpan="6" className="px-6 py-8">
          <InlineErrorState onRetry={onRetry} />
        </td>
      </tr>
    );
  }

  if (!filteredRows.length) {
    return (
      <tr>
        <td colSpan="6" className="px-6 py-8">
          <NoSearchResult />
        </td>
      </tr>
    );
  }

  return filteredRows.map((account, index) => (
    <tr key={account.id} className="group transition hover:bg-blue-50/60">
      <TableCell>
        <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700">
          {String(index + 1).padStart(2, "0")}
        </span>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${account.accent} text-white shadow-lg ${account.ring}`}
          >
            <PlatformIcon type={account.iconType} className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">{account.displayKey}</p>
            <p className="text-sm text-slate-500">{account.helper}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <span
          className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold ${account.badge}`}
        >
          {account.key}
        </span>
      </TableCell>

      <TableCell>
        <p className="max-w-md break-all text-sm leading-6 text-slate-600">
          {account.value}
        </p>
      </TableCell>

      <TableCell>
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
          {account.createdAt}
        </span>
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap gap-3">
          {account.actionHref ? (
            <a
              href={account.actionHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowUpRightIcon className="h-4 w-4" />
              {account.actionLabel}
            </a>
          ) : null}

          <button
            type="button"
            onClick={() => onUpdate(account)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <EditIcon className="h-4 w-4" />
            Update
          </button>
        </div>
      </TableCell>
    </tr>
  ));
}

function FieldShell({ label, children }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        {/* <span className="text-xs font-medium text-slate-400">{hint}</span> */}
      </div>
      {children}
    </label>
  );
}

function EmptyState({ onCreate, compact = false }) {
  return (
    <div
      className={[
        "rounded-[28px] border border-dashed border-slate-200 bg-slate-50/80 text-center",
        compact ? "px-5 py-10" : "px-5 py-12",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-500 shadow-sm">
        <SparkleIcon className="h-7 w-7" />
      </div>
      <h4 className="mt-4 text-lg font-bold text-slate-800">
        Social media accounts abhi available nahi hain
      </h4>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Pehla account add karke admin panel ko ready karein.
      </p>
      {onCreate ? (
        <button
          type="button"
          onClick={onCreate}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <PlusIcon className="h-5 w-5" />
          Add Account
        </button>
      ) : null}
    </div>
  );
}

function InlineErrorState({ onRetry }) {
  return (
    <div className="rounded-[28px] border border-red-100 bg-red-50/80 px-5 py-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-red-500 shadow-sm">
        <AlertIcon className="h-7 w-7" />
      </div>
      <h4 className="mt-4 text-lg font-bold text-slate-800">
        Social media data load nahi ho paya
      </h4>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        API response me issue aa raha hai. Thoda baad refresh karke dubara try
        karein.
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <RefreshIcon className="h-5 w-5" />
          Retry
        </button>
      ) : null}
    </div>
  );
}

function NoSearchResult({ onReset }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-500 shadow-sm">
        <SearchIcon className="h-7 w-7" />
      </div>
      <h4 className="mt-4 text-lg font-bold text-slate-800">
        Search ke hisaab se koi account nahi mila
      </h4>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Different keyword try karein ya filters reset kar dein.
      </p>
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Reset Search
        </button>
      ) : null}
    </div>
  );
}

function TableHeading({ children, className = "" }) {
  return (
    <th
      className={[
        "border-b border-blue-100 bg-white px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500",
        className,
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function TableCell({ children }) {
  return (
    <td className="border-b border-blue-50 px-5 py-4 align-middle">
      {children}
    </td>
  );
}

function getPreset(key = "", value = "") {
  const normalizedKey = normalizePlatform(key, value);
  const preset = PRESET_STYLES[normalizedKey] ?? {
    label: formatLabel(key || "Social Link"),
    accent: "from-slate-700 via-slate-800 to-blue-900",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    ring: "shadow-slate-200/70",
    placeholder: "https://example.com/profile",
    helper: "Key aur URL ko clear format me add karein",
  };

  return {
    ...preset,
    iconType: normalizedKey,
  };
}

function normalizePlatform(key = "", value = "") {
  const source = `${key} ${value}`.toLowerCase();

  if (source.includes("instagram")) return "instagram";
  if (source.includes("email") || source.includes("@")) return "email";
  if (source.includes("twitter") || source.includes("x.com")) return "twitter";
  if (source.includes("whatsapp") || source.includes("wa.me"))
    return "whatsapp";
  if (
    source.includes("mobile") ||
    source.includes("phone") ||
    source.includes("call") ||
    /^[+]?\d[\d\s-]{7,}$/.test(value.trim())
  ) {
    return "mobile";
  }
  if (source.includes("facebook")) return "facebook";
  if (source.includes("youtube")) return "youtube";
  if (source.includes("linkedin")) return "linkedin";
  if (source.includes("website") || source.includes("http")) return "website";

  return key.trim().toLowerCase().replace(/\s+/g, "") || "website";
}

function formatLabel(value = "") {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(date) {
  if (!date) {
    return "No date";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "No date";
  }

  return parsedDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildActionHref(key = "", value = "") {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  const platform = normalizePlatform(key, value);

  if (platform === "email") {
    return `mailto:${trimmedValue.replace(/^mailto:/i, "")}`;
  }

  if (platform === "whatsapp") {
    const mobileNumber = trimmedValue.replace(/[^\d+]/g, "");
    return /^https?:\/\//i.test(trimmedValue)
      ? trimmedValue
      : `https://wa.me/${mobileNumber.replace(/[+]/g, "")}`;
  }

  if (platform === "mobile") {
    return `tel:${trimmedValue.replace(/[^\d+]/g, "")}`;
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue;
  }

  if (/^www\./i.test(trimmedValue)) {
    return `https://${trimmedValue}`;
  }

  return "";
}

function getActionLabel(key = "", value = "") {
  const platform = normalizePlatform(key, value);

  if (platform === "email") return "Email";
  if (platform === "mobile") return "Call";
  if (platform === "whatsapp") return "Chat";
  return "Open";
}

function IconShell({ className, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function PlatformIcon({ type, className }) {
  if (type === "instagram") {
    return (
      <IconShell className={className}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </IconShell>
    );
  }

  if (type === "email") {
    return (
      <IconShell className={className}>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 6 8-6" />
      </IconShell>
    );
  }

  if (type === "twitter") {
    return (
      <IconShell className={className}>
        <path d="M4 5h4.4l4.1 5.3L16.8 5H20l-5.7 6.4L20 19h-4.4l-4.3-5.5L7 19H4l5.7-6.5z" />
      </IconShell>
    );
  }

  if (type === "whatsapp") {
    return (
      <IconShell className={className}>
        <path d="M20 11.5A8.5 8.5 0 0 1 7.5 19l-3.5 1 1-3.5A8.5 8.5 0 1 1 20 11.5Z" />
        <path d="M9.5 9.5c.5 2 2.5 4 4.5 4.5" />
        <path d="M14.1 13.2c-.4.5-1 .8-1.5.8-1.7 0-4.6-2.9-4.6-4.6 0-.5.3-1.1.8-1.5" />
      </IconShell>
    );
  }

  if (type === "mobile") {
    return (
      <IconShell className={className}>
        <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
        <path d="M10 5.5h4" />
        <circle cx="12" cy="18" r="0.8" fill="currentColor" stroke="none" />
      </IconShell>
    );
  }

  if (type === "facebook") {
    return (
      <IconShell className={className}>
        <path d="M14 8h2V4h-2c-2.2 0-4 1.8-4 4v3H8v4h2v5h4v-5h2.5l.5-4H14V8a1 1 0 0 1 1-1Z" />
      </IconShell>
    );
  }

  if (type === "youtube") {
    return (
      <IconShell className={className}>
        <path d="M21 12s0-4-1-5.5c-.6-1-1.4-1.4-2.4-1.5C15.9 4.8 12 4.8 12 4.8s-3.9 0-5.6.2c-1 .1-1.8.5-2.4 1.5C3 8 3 12 3 12s0 4 1 5.5c.6 1 1.4 1.4 2.4 1.5 1.7.2 5.6.2 5.6.2s3.9 0 5.6-.2c1-.1 1.8-.5 2.4-1.5 1-1.5 1-5.5 1-5.5Z" />
        <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
      </IconShell>
    );
  }

  if (type === "linkedin") {
    return (
      <IconShell className={className}>
        <rect x="4" y="9" width="4" height="11" />
        <circle cx="6" cy="5.5" r="1.5" fill="currentColor" stroke="none" />
        <path d="M12 20v-6a2.5 2.5 0 0 1 5 0v6" />
        <path d="M12 10v10" />
        <path d="M17 10a4 4 0 0 1 4 4v6" />
      </IconShell>
    );
  }

  return (
    <IconShell className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </IconShell>
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

function EditIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M12 20h9" />
      <path d="m16.5 3.5 4 4L8 20l-5 1 1-5Z" />
    </IconShell>
  );
}

function SearchIcon({ className }) {
  return (
    <IconShell className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconShell>
  );
}

function RefreshIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M20 11a8 8 0 1 0 2.3 5.7" />
      <path d="M20 4v7h-7" />
    </IconShell>
  );
}

function ArrowUpRightIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </IconShell>
  );
}

function XIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </IconShell>
  );
}

function AlertIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </IconShell>
  );
}

function SparkleIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m12 3 1.8 4.8L18 9.5l-4.2 1.7L12 16l-1.8-4.8L6 9.5l4.2-1.7Z" />
      <path d="m19 3 .7 1.8L21.5 5.5l-1.8.7L19 8l-.7-1.8-1.8-.7 1.8-.7Z" />
      <path d="m5 15 .9 2.2L8 18l-2.1.8L5 21l-.9-2.2L2 18l2.1-.8Z" />
    </IconShell>
  );
}

function PulseIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </IconShell>
  );
}

function SpinnerIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    </IconShell>
  );
}

export default SocialMediaScreen;
