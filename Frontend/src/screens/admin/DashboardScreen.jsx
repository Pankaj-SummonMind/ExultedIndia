import { useEffect, useMemo } from "react";
import {
  useGetAllUsersQuery,
  useGetCategoriesQuery,
  useGetProductQuery,
} from "../../services/api";
import Loader from "../../components/loader/Loader";
import toast from "react-hot-toast";

function DashboardScreen() {
  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useGetAllUsersQuery();
  const {
    data: categoriesResponse,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetCategoriesQuery();
  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useGetProductQuery();

  const users = usersResponse?.data ?? [];
  const categories = categoriesResponse?.data ?? [];
  const products = productsResponse?.data ?? [];

  const isLoading = isUsersLoading || isCategoriesLoading || isProductsLoading;
  const hasError = isUsersError || isCategoriesError || isProductsError;

  useEffect(() => {
    if (hasError) {
      toast.error("Internal Server Error");
    }
  }, [hasError]);

  const overviewCards = useMemo(
    () => [
      {
        label: "Total Users",
        value: users.length,
        accent: "from-sky-500 via-blue-500 to-cyan-400",
        iconBg: "bg-white/18",
      },
      {
        label: "Total Categories",
        value: categories.length,
        accent: "from-emerald-500 via-teal-500 to-green-400",
        iconBg: "bg-white/18",
      },
      {
        label: "Total Products",
        value: products.length,
        accent: "from-amber-500 via-orange-500 to-rose-400",
        iconBg: "bg-white/18",
      },
    ],
    [users.length, categories.length, products.length]
  );

  const registrationChart = useMemo(() => {
    const now = new Date();
    const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });

    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: monthFormatter.format(date),
        count: 0,
      };
    });

    const monthMap = new Map(months.map((item) => [item.key, item]));

    users.forEach((user) => {
      const createdAt = user?.createdAt ? new Date(user.createdAt) : null;

      if (!createdAt || Number.isNaN(createdAt.getTime())) {
        return;
      }

      const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
      const bucket = monthMap.get(key);

      if (bucket) {
        bucket.count += 1;
      }
    });

    const maxCount = Math.max(...months.map((item) => item.count), 1);

    return {
      maxCount,
      months,
      totalRegistrations: months.reduce((sum, item) => sum + item.count, 0),
    };
  }, [users]);

  const latestRegisteredUsers = useMemo(
    () =>
      [...users]
        .filter((user) => user?.createdAt)
        .sort((firstUser, secondUser) => {
          const firstDate = new Date(firstUser.createdAt).getTime();
          const secondDate = new Date(secondUser.createdAt).getTime();
          return secondDate - firstDate;
        })
        .slice(0, 4),
    [users]
  );

  

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <Loader isLoading={isLoading} />
      <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_30%),linear-gradient(135deg,#ffffff,#f8fbff_55%,#f3f7ff)] p-5 shadow-[0_20px_60px_rgba(148,163,184,0.16)] sm:p-6 lg:p-7">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white to-transparent" />

        

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {overviewCards.map((card) => (
            <article
              key={card.label}
              className={`relative overflow-hidden rounded-[28px] bg-linear-to-br ${card.accent} p-px shadow-[0_18px_45px_rgba(15,23,42,0.12)]`}
            >
              <div className="flex h-37 min-h-37 flex-col justify-between rounded-[27px] bg-slate-950/86 p-5 text-white backdrop-blur-xl sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                      {card.label}
                    </p>
                    {/* <p className="mt-3 text-sm text-white/70">
                      Live data from connected APIs
                    </p> */}
                  </div>

                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-2xl ${card.iconBg}`}
                  >
                    <OverviewIcon label={card.label} className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-center py-6">
                  <span className="text-2xl font-black tracking-tight sm:text-2xl">
                    {isLoading ? "--" : String(card.value).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.9fr)_minmax(320px,0.95fr)]">
        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-600">
                  Monthly Trend
                </p>
                <h2 className="mt-2 text-lg font-bold text-slate-800">
                  User registrations by month
                </h2>
              </div>

              <div className="inline-flex w-fit items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-sky-500" />
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Total in range
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {String(registrationChart.totalRegistrations).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid h-80 grid-cols-6 items-end gap-3 rounded-[28px] border border-slate-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.94),rgba(241,245,249,0.65))] px-4 pb-5 pt-6 sm:gap-4 sm:px-6">
              {registrationChart.months.map((month) => {
                const height = Math.max(
                  (month.count / registrationChart.maxCount) * 100,
                  month.count > 0 ? 16 : 8
                );

                return (
                  <div
                    key={month.key}
                    className="flex h-full min-w-0 flex-col items-center justify-end gap-3"
                  >
                    <div className="text-xs font-semibold text-slate-400">
                      {month.count}
                    </div>

                    <div className="relative flex h-full w-full items-end justify-center overflow-hidden rounded-[22px] bg-white/80 shadow-inner shadow-slate-100">
                      <div className="absolute inset-x-3 top-3 border-t border-dashed border-slate-200" />
                      <div className="absolute inset-x-3 top-1/2 border-t border-dashed border-slate-200" />
                      <div
                        className="w-full max-w-18 rounded-[18px] bg-linear-to-t from-sky-600 via-blue-500 to-cyan-300 shadow-[0_18px_30px_rgba(37,99,235,0.28)] transition-all duration-500"
                        style={{ height: `${height}%` }}
                        aria-label={`${month.label} ${month.count} users`}
                      />
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-700">
                        {month.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-600">
              Recent Users
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-800">
              Latest registrations
            </h2>
            {/* <p className="mt-2 text-sm leading-6 text-slate-500">
              Recent joined users ka quick professional snapshot.
            </p> */}
          </div>

          <div className="flex flex-col gap-3 p-5 sm:p-6">
            {latestRegisteredUsers.length > 0 ? (
              latestRegisteredUsers.map((user, index) => (
                <div
                  key={user._id ?? `${user.email}-${index}`}
                  className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-slate-50/80 px-4 py-4"
                >

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-800">
                      {user?.name || "Unnamed User"}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {user?.email || user?.mobileNumber || "No contact info"}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm">
                    {formatShortDate(user?.createdAt)}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                {isLoading
                  ? "Dashboard data loading..."
                  : "No registered users data available."}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/75 px-4 py-3 backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-slate-900">
        {String(value).padStart(2, "0")}
      </p>
    </div>
  );
}

function OverviewIcon({ label, className }) {
  if (label.includes("Users")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M20 8v6" />
        <path d="M23 11h-6" />
      </svg>
    );
  }

  if (label.includes("Categories")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        <rect x="3" y="4" width="7" height="7" rx="2" />
        <rect x="14" y="4" width="7" height="7" rx="2" />
        <rect x="14" y="15" width="7" height="6" rx="2" />
        <rect x="3" y="15" width="7" height="6" rx="2" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6 4 3H2" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}

function AlertIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "U";
}

function formatShortDate(date) {
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

export default DashboardScreen;
