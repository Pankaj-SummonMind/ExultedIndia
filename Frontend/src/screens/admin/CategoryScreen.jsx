import { useMemo, useState } from "react";
import CreateCategory from "../../components/CreateCategory";

const initialCategoryRows = [
  {
    id: 1,
    name: "Electronics",
    subCategory: "Mobiles, Laptops, Accessories",
    createdAt: "15 Apr 2026",
  },
  {
    id: 2,
    name: "Fashion",
    subCategory: "Men, Women, Kids Wear",
    createdAt: "13 Apr 2026",
  },
  {
    id: 3,
    name: "Home Decor",
    subCategory: "Lighting, Wall Art, Furnishing",
    createdAt: "11 Apr 2026",
  },
  {
    id: 4,
    name: "Beauty",
    subCategory: "Skin Care, Hair Care, Makeup",
    createdAt: "09 Apr 2026",
  },
  {
    id: 5,
    name: "Sports",
    subCategory: "Fitness, Outdoor, Indoor Games",
    createdAt: "07 Apr 2026",
  },
  {
    id: 6,
    name: "Books",
    subCategory: "Fiction, Academic, Self Help",
    createdAt: "05 Apr 2026",
  },
  {
    id: 7,
    name: "Groceries",
    subCategory: "Daily Essentials, Snacks, Beverages",
    createdAt: "03 Apr 2026",
  },
  {
    id: 8,
    name: "Furniture",
    subCategory: "Living Room, Bedroom, Office",
    createdAt: "01 Apr 2026",
  },
];

function CategoryScreen() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [categoryRows, setCategoryRows] = useState(initialCategoryRows);
  const [createdCategoryForm, setCreatedCategoryForm] = useState({
    categoryName: "",
    subCategory: [],
  });

  const stats = useMemo(
    () => [
      { label: "Total Categories", value: String(categoryRows.length) },
      {
        label: "Active Groups",
        value: String(
          new Set(categoryRows.map((item) => item.name.toLowerCase())).size
        ),
      },
      {
        label: "Updated Today",
        value: String(
          categoryRows.filter((item) => item.createdAt === "16 Apr 2026").length
        ).padStart(2, "0"),
      },
    ],
    [categoryRows]
  );

  const handleCreateCategory = (formData) => {
    setCreatedCategoryForm(formData);

    const createdDate = "16 Apr 2026";

    setCategoryRows((current) => [
      {
        id: current.length + 1,
        name: formData.categoryName,
        subCategory: formData.subCategory.join(", "),
        createdAt: createdDate,
      },
      ...current,
    ]);

    setIsCreateModalOpen(false);
  };

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      {/* <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-blue-100 bg-white/90 p-4 shadow-sm shadow-blue-100"
          >
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              {item.value}
            </p>
          </div>
        ))}
      </div> */}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
        <div className="flex flex-col gap-4 border-b border-blue-100 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
              Category Table
            </h2>
            {/* <p className="mt-1 text-sm text-slate-500">
              Scroll inside this section only. Layout outer container se bahar
              nahi jayega.
            </p> */}
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
          >
            <PlusIcon className="h-5 w-5" />
            Add Category
          </button>

          {/* <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {categoryRows.length} Records
            </span>
            {createdCategoryForm.categoryName ? (
              <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
                Last Added {createdCategoryForm.categoryName}
              </span>
            ) : null}
          </div> */}
        </div>

        <div className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4">
          <div className="h-full max-h-116 overflow-auto rounded-3xl border border-blue-100 bg-slate-50/80">
            <div className="min-w-190">
              <table className="w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur">
                  <tr>
                    <TableHeading className="rounded-tl-3xl">
                      Serial Number
                    </TableHeading>
                    <TableHeading>Category Name</TableHeading>
                    <TableHeading>Sub-Category</TableHeading>
                    <TableHeading className="rounded-tr-3xl">
                      Created At
                    </TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {categoryRows.map((row, index) => (
                    <tr
                      key={row.id}
                      className="group transition hover:bg-blue-50/70"
                    >
                      <TableCell>
                        <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-700">
                            {row.name}
                          </p>
                          {/* <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">
                            Primary Group
                          </p> */}
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="max-w-xs text-sm leading-6 text-slate-500">
                          {row.subCategory}
                        </p>
                      </TableCell>

                      <TableCell>
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
                          {row.createdAt}
                        </span>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CreateCategory
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCategory}
      />
    </section>
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

function PlusIcon({ className }) {
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
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export default CategoryScreen;
