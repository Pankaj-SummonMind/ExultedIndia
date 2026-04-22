import { useMemo, useState } from "react";
import HomePageScreen from "./HomePageScreen";

const PAGE_TABS = [
  {
    id: "home",
    label: "Home",
    component: <HomePageScreen />,
  },
  {
    id: "about",
    label: "About Us",
  },
  {
    id: "contact",
    label: "Contact",
  },
];

function PagesScreen() {
  const [activeTab, setActiveTab] = useState(PAGE_TABS[0].id);

  const activePage = useMemo(
    () => PAGE_TABS.find((tab) => tab.id === activeTab) ?? PAGE_TABS[0],
    [activeTab]
  );

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
  {/* Top Navbar */}
  <div className="border-b border-slate-200 pb-3">
    <div
      className="flex gap-2 overflow-x-auto scrollbar-hide"
      role="tablist"
      aria-label="Page navigation"
    >
      {PAGE_TABS.map((tab) => {
        const isActive = tab.id === activePage.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`${tab.id}-panel`}
            id={`${tab.id}-tab`}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-blue-600 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  </div>

  {/* Active Page Content */}
      <div className="mt-5">
        {activePage.component}
      </div>
</div> 
    </section>
  );
}

export default PagesScreen;
