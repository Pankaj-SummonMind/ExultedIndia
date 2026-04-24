import { useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useGetAllSocialMediaQuery, useGetCategoriesQuery, useGetSubCategoriesQuery } from "../services/api";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/aboutus" },
  { label: "Certificates", to: "/certificates" },
  { label: "Contact", to: "/contact" },
];

function ClientLayout() {
  const navigate = useNavigate();
  const { data: categoriesResponse, isLoading } = useGetCategoriesQuery();
  const {data:subCategoryResponse} = useGetSubCategoriesQuery()
  const {data: SocialMediaAccounts} = useGetAllSocialMediaQuery()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const categories = useMemo(() => {
    if (Array.isArray(categoriesResponse?.data)) return categoriesResponse.data;
    if (Array.isArray(categoriesResponse)) return categoriesResponse;
    return [];
  }, [categoriesResponse]);

  const activeCategory =
    categories.find((category) => category._id === activeCategoryId) ||
    categories[0];

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setIsMobileProductsOpen(false);
  };

  const goToCategory = (categoryId) => {
    navigate(`/products/category/${categoryId}`);
    closeMobileMenu();
  };

  const goToSubCategory = (subCategoryId) => {
    navigate(`/products/subcategory/${subCategoryId}`);
    closeMobileMenu();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-blue-100/80 bg-white/88 shadow-[0_12px_38px_rgba(15,91,191,0.08)] backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className="group flex items-center gap-3"
            aria-label="Exulted India home"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition group-hover:-translate-y-0.5 group-hover:bg-blue-700">
              <BoltIcon className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-bold tracking-wide text-slate-950">
                Exulted India
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-500">
                Power Systems
              </span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navItems.slice(0, 1).map((item) => (
              <NavItem key={item.to} item={item} />
            ))}

            <div
              className="group relative"
              onMouseEnter={() => setActiveCategoryId(categories[0]?._id ?? null)}
            >
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  [
                    "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-700",
                  ].join(" ")
                }
              >
                Products
                <ChevronDownIcon className="h-4 w-4 transition group-hover:rotate-180" />
              </NavLink>

              <div className="invisible absolute left-1/2 top-full w-140 -translate-x-1/2 translate-y-3 rounded-2xl border border-blue-100 bg-white p-3 opacity-0 shadow-[0_26px_70px_rgba(15,91,191,0.18)] transition duration-200 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
                <div className="grid grid-cols-[230px_1fr] gap-3">
                  <div className="rounded-xl bg-slate-50 p-2">
                    <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-500">
                      Categories
                    </p>
                    {isLoading ? (
                      <DropdownState label="Loading categories..." />
                    ) : categories.length ? (
                      categories.map((category) => (
                        <button
                          key={category._id}
                          type="button"
                          onMouseEnter={() => setActiveCategoryId(category._id)}
                          onFocus={() => setActiveCategoryId(category._id)}
                          onClick={() => goToCategory(category._id)}
                          className={[
                            "group/category flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition",
                            activeCategory?._id === category._id
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                              : "text-slate-700 hover:bg-white hover:text-blue-700 hover:shadow-sm",
                          ].join(" ")}
                        >
                          <span>{category.categories_name}</span>
                          <ChevronRightIcon className="h-4 w-4" />
                        </button>
                      ))
                    ) : (
                      <DropdownState label="No categories found" />
                    )}
                  </div>

                  <div className="rounded-xl border border-blue-50 bg-white p-2">
                    <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">
                      Sub Categories
                    </p>
                    {activeCategory?.subCategories?.length ? (
                      activeCategory.subCategories.map((subCategory) => (
                        <button
                          key={subCategory._id}
                          type="button"
                          onClick={() => goToSubCategory(subCategory._id)}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                        >
                          <span>{subCategory.name}</span>
                          <ArrowUpRightIcon className="h-4 w-4" />
                        </button>
                      ))
                    ) : (
                      <DropdownState label="Hover a category to view items" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {navItems.slice(1).map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {/* <NavLink
              to="/contact"
              className="rounded-full border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700 transition hover:border-blue-500 hover:bg-blue-50"
            >
              Get Quote
            </NavLink> */}
            <NavLink
              to="/contact"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Get in Touch 
            </NavLink>
          </div>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-100 lg:hidden"
          >
            {isMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>

        <div
          className={[
            "grid overflow-hidden border-t border-blue-50 bg-white/96 transition-all duration-300 lg:hidden",
            isMenuOpen ? "max-h-[calc(100vh-72px)] opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <div className="max-h-[calc(100vh-72px)] overflow-y-auto px-4 py-4">
            <MobileLink to="/" label="Home" onClick={closeMobileMenu} />
            <button
              type="button"
              onClick={() => setIsMobileProductsOpen((value) => !value)}
              className="mt-2 flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
            >
              <span>Products</span>
              <ChevronDownIcon
                className={[
                  "h-4 w-4 transition",
                  isMobileProductsOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            <div
              className={[
                "grid overflow-hidden transition-all duration-300",
                isMobileProductsOpen ? "max-h-180 opacity-100" : "max-h-0 opacity-0",
              ].join(" ")}
            >
              <div className="mt-2 rounded-2xl border border-blue-100 bg-slate-50 p-2">
                <MobileLink to="/products" label="All Products" onClick={closeMobileMenu} />
                {isLoading ? (
                  <DropdownState label="Loading categories..." />
                ) : categories.length ? (
                  categories.map((category) => (
                    <div key={category._id} className="rounded-xl bg-white/70 p-1">
                      <button
                        type="button"
                        onClick={() => goToCategory(category._id)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-bold text-slate-800 transition hover:bg-blue-50 hover:text-blue-700"
                      >
                        <span>{category.categories_name}</span>
                        <ArrowUpRightIcon className="h-4 w-4" />
                      </button>
                      {category.subCategories?.length ? (
                        <div className="pb-1 pl-3">
                          {category.subCategories.map((subCategory) => (
                            <button
                              key={subCategory._id}
                              type="button"
                              onClick={() => goToSubCategory(subCategory._id)}
                              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                              {subCategory.name}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <DropdownState label="No categories found" />
                )}
              </div>
            </div>

            {navItems.slice(1).map((item) => (
              <MobileLink
                key={item.to}
                to={item.to}
                label={item.label}
                onClick={closeMobileMenu}
              />
            ))}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <NavLink
                to="/contact"
                onClick={closeMobileMenu}
                className="rounded-xl border border-blue-200 px-4 py-3 text-center text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              >
                Get Quote
              </NavLink>
              <NavLink
                to="/admin"
                onClick={closeMobileMenu}
                className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
              >
                Partner Login
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
      
      {/* <Footer /> */}
      <footer className="relative overflow-hidden bg-[#0f172a] text-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/footer-bg.jpg"
          alt="Footer Background"
          className="h-full w-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#020617]/95 via-[#0f172a]/92 to-[#111827]/95" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/30">
                <BoltIcon className="h-7 w-7 text-white" />
              </div>

              <div>
                <h3 className="text-xl font-black tracking-wide">
                  Exaulted India
                </h3>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-300">
                  Future Power Systems
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              Leading manufacturer of Battery, Inverter, Transformer,
              Online UPS, Gensets and EV Chargers with trusted Pan India support.
            </p>

            {/* Social */}
            <div className="mt-6 flex gap-3">
  {(SocialMediaAccounts?.data || []).filter((item) => ["instagram", "facebook", "twitter", "youtube", "linkedin"].includes(item.key?.toLowerCase())).map((item) => (
    <a
      key={item._id}
      href={item.value}
      target="_blank"
      rel="noopener noreferrer"
      className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-sm font-black text-white transition hover:bg-blue-500 hover:scale-110"
    >
      {item.key === "instagram" && "in"}
      {item.key === "facebook" && "f"}
      {item.key === "twitter" && "x"}
      {item.key === "youtube" && "yt"}
      {item.key === "linkedin" && "li"}
    </a>
  ))}
</div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black text-white">
              Quick Links
            </h4>

            <div className="mt-5 grid gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className="text-sm font-medium text-slate-300 transition hover:translate-x-1 hover:text-blue-400"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-black text-white">
              Products
            </h4>

            <div className="mt-5 grid gap-3">
              {categories.map((category) => (
                <a
                  key={category._id}
                  href={`/products/category/${category._id}`}
                  className="text-sm font-medium text-slate-300 transition hover:translate-x-1 hover:text-emerald-400"
                >
                  {category.categories_name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-black text-white">
              Contact
            </h4>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              If you have any questions or need help, feel free to
              contact with our team.
            </p>

            <div className="mt-6 space-y-4">
  {(SocialMediaAccounts?.data || [])
    .filter((item) =>
      ["phone", "mail", "whatsapp"].includes(item.key?.toLowerCase())
    )
    .map((item) => (
      <div key={item._id} className="flex items-start gap-3">
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl ${
            item.key?.toLowerCase() === "phone"
              ? "bg-blue-500/20 text-blue-400"
              : item.key?.toLowerCase() === "email"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {/* Icon */}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            {item.key}
          </p>

          <p className="text-sm font-semibold text-white">
            {item.value}
          </p>
        </div>
      </div>
    ))}
</div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Exaulted India. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a href="/" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="/" className="hover:text-white transition">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}

function NavItem({ item }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        [
          "rounded-full px-4 py-2 text-sm font-semibold transition",
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-slate-700 hover:bg-blue-50 hover:text-blue-700",
        ].join(" ")
      }
    >
      {item.label}
    </NavLink>
  );
}

function MobileLink({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "mt-2 block rounded-xl px-4 py-3 text-sm font-bold transition",
          isActive
            ? "bg-blue-50 text-blue-700"
            : "text-slate-700 hover:bg-blue-50 hover:text-blue-700",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

function DropdownState({ label }) {
  return (
    <div className="rounded-xl px-3 py-4 text-sm font-semibold text-slate-500">
      {label}
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

function BoltIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m13 2-9 12h7l-1 8 10-13h-7l0-7Z" />
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

function ChevronDownIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m6 9 6 6 6-6" />
    </IconShell>
  );
}

function ChevronRightIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="m9 18 6-6-6-6" />
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

function Footer() {
  const quickLinks = [
    "Home",
    "About",
    "Products",
    "Certificates",
    "Contact",
  ];

  const products = [
    "Battery",
    "Inverter",
    "Transformer",
    "Online UPS",
    "EV Charger",
  ];

  return (
    <footer className="relative overflow-hidden bg-[#0f172a] text-white">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/footer-bg.jpg"
          alt="Footer Background"
          className="h-full w-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#020617]/95 via-[#0f172a]/92 to-[#111827]/95" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/30">
                <BoltIcon className="h-7 w-7 text-white" />
              </div>

              <div>
                <h3 className="text-xl font-black tracking-wide">
                  Exaulted India
                </h3>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-300">
                  Future Power Systems
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              Leading manufacturer of Battery, Inverter, Transformer,
              Online UPS, Gensets and EV Chargers with trusted Pan India support.
            </p>

            {/* Social */}
            <div className="mt-6 flex gap-3">
              {["in", "f", "x", "yt"].map((item) => (
                <a
                  key={item}
                  href="/"
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-sm font-black text-white transition hover:bg-blue-500 hover:scale-110"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black text-white">
              Quick Links
            </h4>

            <div className="mt-5 grid gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className="text-sm font-medium text-slate-300 transition hover:translate-x-1 hover:text-blue-400"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-black text-white">
              Products
            </h4>

            <div className="mt-5 grid gap-3">
              {categories.map((category) => (
                <a
                  key={category._id}
                  href={`/products/category/${category._id}`}
                  className="text-sm font-medium text-slate-300 transition hover:translate-x-1 hover:text-emerald-400"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-black text-white">
              Contact
            </h4>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              If you have any questions or need help, feel free to
              contact with our team.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/20 text-blue-400">
                  {/* <PhoneIcon className="h-5 w-5" /> */}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Phone
                  </p>
                  <p className="text-sm font-semibold text-white">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  {/* <EnvelopeIcon className="h-5 w-5" /> */}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-white">
                    info@exaultedindia.com
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Exaulted India. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a href="/" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="/" className="hover:text-white transition">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default ClientLayout;
