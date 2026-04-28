import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import CreateProduct from "../../components/CreateProduct";
import { useGetProductQuery } from "../../services/api";
import Loader from "../../components/loader/Loader";
import toast from "react-hot-toast";


function ProductScreen() {
  const navigate = useNavigate();
  const {data : allProduct, isLoading,error} = useGetProductQuery()
  console.log(allProduct);
  const [showCreateProduct, setShowCreateProduct] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error("Internal Server Error:");
    }
  }, [error]);
  
  if (showCreateProduct) {
    return <CreateProduct 
    mode = "create"
    onShowList={() => setShowCreateProduct(false)} />;
  }


  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <Loader isLoading={isLoading} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
        <div className="flex flex-col gap-4 border-b border-blue-100 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
              Product Table
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateProduct(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
          >
            <PlusIcon className="h-5 w-5" />
            Add Product
          </button>
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
                    <TableHeading>Name</TableHeading>
                    <TableHeading>Category</TableHeading>
                    <TableHeading>Subcategory</TableHeading>
                    <TableHeading className="rounded-tr-3xl">
                      Created At
                    </TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {
                    allProduct?.data?.length ? (
                      allProduct?.data?.map((row, index) => (
                        <tr
                          key={row._id}
                          role="button"
                          tabIndex={0}
                          onClick={() => navigate(`/admin/product/${row._id}`)}
                                          onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                              navigate(`/admin/category/${row.id}`);
                                            }
                                          }}
                          className="group transition hover:bg-blue-50/70"
                        >
                          <TableCell>
                            <span className="inline-flex min-w-10 items-center justify-center rounded-full bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </TableCell>
                    
                          <TableCell>
                            <p className="font-semibold text-slate-700">
                              {row.product_name}
                            </p>
                          </TableCell>
                    
                          <TableCell>
                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                              {row.product_category?.categories_name}
                            </span>
                          </TableCell>
                    
                          <TableCell>
                            <p className="text-sm leading-6 text-slate-500">
                              {row.product_subCategory?.name}
                            </p>
                          </TableCell>
                    
                          <TableCell>
                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
                              {new Date(row.createdAt).toLocaleDateString()}
                            </span>
                          </TableCell>
                        </tr>
                      ))
                    )
                    : 
                    (
                      <tr>
      <td colSpan="6" className="py-16">
        <div className="flex w-full flex-col items-center justify-center text-center">
          <p className="text-lg font-semibold text-slate-700">
            No Product Found
          </p>

          {/* <p className="mt-2 text-sm leading-6 text-slate-500">
            Currently there are no categories available.
          </p> */}
        </div>
      </td>
    </tr>
                    )
                  }
</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
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

export default ProductScreen;
