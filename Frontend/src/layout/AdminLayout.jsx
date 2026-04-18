import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const sidebarItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    to: "/admin/dashboard",
    Icon: LayoutDashboardIcon,
    available: true,
  },
  {
    id: "category",
    label: "Category",
    to: "/admin/category",
    Icon: FolderTreeIcon,
    available: true,
  },
  {
    id: "product",
    label: "Product",
    to: "/admin/product",
    Icon: PackageIcon,
    available: true,
  },
  {
    id: "users",
    label: "Users",
    to: "/admin/user",
    Icon: UsersIcon,
    available: true,
  },
  {
    id: "pages",
    label: "Pages",
    to: "/admin/pages",
    Icon: UsersIcon,
    available: false,
  },
  {
    id: "Social Media",
    label: "Social Media",
    to: "/admin/socialmedia",
    Icon: UsersIcon,
    available: false,
  },
  {
    id: "certificate",
    label: "Certificates",
    to: "/admin/certificate",
    Icon: UsersIcon,
    available: false,
  },
];

function AdminLayout() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth < 1024
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window === "undefined" ? true : window.innerWidth >= 1024
  );
  const [selectedTab, setSelectedTab] = useState("dashboard");

  useEffect(() => {
    const handleResize = () => {
      const mobileViewport = window.innerWidth < 1024;
      setIsMobile(mobileViewport);
      setIsSidebarOpen(!mobileViewport);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const activeItem = sidebarItems.find(
      (item) => item.available && location.pathname.startsWith(item.to)
    );

    if (activeItem) {
      setSelectedTab(activeItem.id);
    }

    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setSelectedTab(item.id);

    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-100 text-slate-800">
      <div className="relative flex min-h-screen">
        {isMobile && isSidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-[2px]"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 flex w-70 flex-col border-r border-blue-100 bg-white/95 px-5 py-6 shadow-[0_20px_50px_rgba(59,130,246,0.12)] backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between gap-3 border-b border-blue-100 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-400">
                Admin Panel
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-800">
                Exulted India
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Clean control center for your store.
              </p>
            </div>

            {isMobile ? (
              <button
                type="button"
                aria-label="Close sidebar"
                onClick={() => setIsSidebarOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
              >
                <XIcon className="h-5 w-5" />
              </button>
            ) : null}
          </div>

          <nav className="mt-6 flex flex-1 flex-col gap-2">
            {sidebarItems.map((item) => {
              const isActive = selectedTab === item.id;

              const sharedClasses = [
                "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-400 to-blue-300 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700",
              ].join(" ");

              const iconClasses = [
                "h-5 w-5 transition",
                isActive
                  ? "text-white"
                  : "text-blue-500 group-hover:text-blue-700",
              ].join(" ");

              const content = (
                <>
                  <item.Icon className={iconClasses} />
                  <div className="flex flex-1 items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{item.label}</span>
                    {!item.available ? (
                      <span
                        className={[
                          "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-100 text-blue-600",
                        ].join(" ")}
                      >
                        Soon
                      </span>
                    ) : null}
                  </div>
                </>
              );

              if (item.available) {
                return (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    onClick={() => handleItemClick(item)}
                    className={sharedClasses}
                  >
                    {content}
                  </NavLink>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={sharedClasses}
                >
                  {content}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
          <header className="sticky top-0 z-20 border-b border-blue-100 bg-white/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isMobile ? (
                  <button
                    type="button"
                    aria-label="Open sidebar"
                    onClick={() => setIsSidebarOpen(true)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-200 bg-blue-400 text-white shadow-md shadow-blue-200 transition hover:bg-blue-500"
                  >
                    <MenuIcon className="h-5 w-5" />
                  </button>
                ) : null}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
                    Overview
                  </p>
                  <h2 className="text-xl font-bold text-slate-800">
                    {formatHeading(selectedTab)}
                  </h2>
                </div>
              </div>

            </div>
          </header>

          <main className="flex-1"
          >
            {/* p-4 sm:p-6 lg:p-4 */}
            <div className="min-h-[calc(100vh-112px)] rounded-[28px] border border-white/80 bg-white/80 p-4 shadow-[0_20px_60px_rgba(148,163,184,0.14)] backdrop-blur sm:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function formatHeading(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
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

function LayoutDashboardIcon({ className }) {
  return (
    <IconShell className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </IconShell>
  );
}

function FolderTreeIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3H10l2 2h6.5A2.5 2.5 0 0 1 21 7.5v1" />
      <path d="M7 13v-2.5A1.5 1.5 0 0 1 8.5 9h7A1.5 1.5 0 0 1 17 10.5V13" />
      <path d="M7 13h10" />
      <path d="M7 13v4" />
      <path d="M17 13v4" />
      <rect x="4" y="17" width="6" height="4" rx="1" />
      <rect x="14" y="17" width="6" height="4" rx="1" />
    </IconShell>
  );
}

function PackageIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M12 3 4.5 7 12 11l7.5-4L12 3Z" />
      <path d="M4.5 7v10L12 21l7.5-4V7" />
      <path d="M12 11v10" />
    </IconShell>
  );
}

function UsersIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="3" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 4.13a4 4 0 0 1 0 5.74" />
    </IconShell>
  );
}

function MenuIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
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

export default AdminLayout;
