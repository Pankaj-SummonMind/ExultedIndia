import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateSubCategory from "../../components/createSubCategory";
import { useGetSubCategoriesQuery } from "../../services/api";

function SubCategoryScreen() {
  const navigate = useNavigate();
  const { data: allSubCategories, isLoading } = useGetSubCategoriesQuery();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const subCategoryRows =
    allSubCategories?.data?.map((item) => ({
      id: item._id,
      name: item.name,
      categoryName:
        item.category_Id?.categories_name ||
        item.category_Id?.name ||
        "Unassigned Category",
      description: item.description,
      image: item.image?.url || "",
      createdAt: new Date(item.createdAt).toLocaleDateString(),
      raw: item,
    })) || [];

  const stats = useMemo(
    () => [
      { label: "Total Sub Categories", value: String(subCategoryRows.length) },
      {
        label: "Mapped Categories",
        value: String(
          new Set(subCategoryRows.map((item) => item.categoryName)).size,
        ),
      },
      {
        label: "With Images",
        value: String(
          subCategoryRows.filter((item) => Boolean(item.image)).length,
        ),
      },
    ],
    [subCategoryRows],
  );

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((card) => (
          <div
            key={card.label}
            className="rounded-[28px] border border-blue-100 bg-white px-5 py-5 shadow-[0_20px_50px_rgba(148,163,184,0.12)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
              {card.label}
            </p>
            <p className="mt-3 text-2xl font-bold text-slate-800">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
        <div className="flex flex-col gap-4 border-b border-blue-100 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
              Sub Category Table
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage sub categories with parent category mapping, description,
              and images.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
            >
              <PlusIcon className="h-5 w-5" />
              Add Sub Category
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4">
          <div className="h-full max-h-116 overflow-auto rounded-3xl border border-blue-100 bg-slate-50/80">
            <div className="min-w-[1100px]">
              <table className="w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur">
                  <tr>
                    <TableHeading className="rounded-tl-3xl">
                      Serial Number
                    </TableHeading>
                    <TableHeading>Image</TableHeading>
                    <TableHeading>Sub Category Name</TableHeading>
                    <TableHeading>Category Name</TableHeading>
                    <TableHeading>Description</TableHeading>
                    <TableHeading className="rounded-tr-3xl">
                      Created At
                    </TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <TableCell colSpan={6}>
                        <div className="flex items-center justify-center px-4 py-16 text-sm font-medium text-slate-500">
                          Loading sub categories...
                        </div>
                      </TableCell>
                    </tr>
                  ) : subCategoryRows.length ? (
                    subCategoryRows.map((row, index) => (
                      <tr
                        key={row.id}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          navigate(`/admin/subcategory/${row.id}`, {
                            state: { subCategory: row.raw },
                          })
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            navigate(`/admin/subcategory/${row.id}`, {
                              state: { subCategory: row.raw },
                            });
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
                          <p className="font-semibold text-slate-700">
                            {row.name}
                          </p>
                        </TableCell>

                        <TableCell>
                          <span className="inline-flex rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                            {row.categoryName}
                          </span>
                        </TableCell>

                        <TableCell>
                          <p className="max-w-sm text-sm leading-6 text-slate-500">
                            {row.description || "No description available"}
                          </p>
                        </TableCell>

                        <TableCell>
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
                            {row.createdAt}
                          </span>
                        </TableCell>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <TableCell colSpan={6}>
                        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                          <p className="text-lg font-semibold text-slate-700">
                            No sub categories found
                          </p>
                          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Start by creating a sub category and assigning it to
                            a parent category.
                          </p>
                        </div>
                      </TableCell>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CreateSubCategory
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

function TableCell({ children, colSpan }) {
  return (
    <td
      colSpan={colSpan}
      className="border-b border-blue-50 px-5 py-4 align-middle"
    >
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

export default SubCategoryScreen;
