import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateCategory from "../../components/CreateCategory";
import { useGetCategoriesQuery } from "../../services/api";

function CategoryScreen() {
  const navigate = useNavigate();
  const { data: allCategories } = useGetCategoriesQuery();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const categoryRows =
    allCategories?.data?.map((item) => ({
      id: item._id,
      name: item.categories_name,
      description: item.categories_description,
      image: item.image?.url || "",
      createdAt: new Date(item.createdAt).toLocaleDateString(),
    })) || [];

  const stats = useMemo(
    () => [
      { label: "Total Categories", value: String(categoryRows.length) },
      {
        label: "With Images",
        value: String(
          categoryRows.filter((item) => Boolean(item.image)).length,
        ),
      },
      {
        label: "Updated Today",
        value: String(
          categoryRows.filter((item) => item.createdAt === "16 Apr 2026")
            .length,
        ).padStart(2, "0"),
      },
    ],
    [categoryRows],
  );

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
        <div className="flex flex-col gap-4 border-b border-blue-100 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
              Category Table
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
            >
              <PlusIcon className="h-5 w-5" />
              Add Category
            </button>
          </div>
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
                    <TableHeading>Image</TableHeading>
                    <TableHeading>Category Name</TableHeading>
                    <TableHeading>Description</TableHeading>
                    <TableHeading className="rounded-tr-3xl">
                      Created At
                    </TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {categoryRows.map((row, index) => (
                    <tr
                      key={row.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/admin/category/${row.id}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          navigate(`/admin/category/${row.id}`);
                        }
                      }}
                      className="group cursor-pointer transition hover:bg-blue-50/70"
                    >
                      <TableCell>
                        <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-white">
                          {row.image ? (
                            <img
                              src={row.image}
                              alt={row.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold text-slate-400">
                              N/A
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-700">
                            {row.name}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="max-w-xs text-sm leading-6 text-slate-500">
                          {row.description || "No description available"}
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
        setIsCreateModalOpen={setIsCreateModalOpen}
        mode="create"
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
