import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CreateProduct from "../../../components/CreateProduct";
import { useDeleteProductMutation, useGetProductByidQuery } from "../../../services/api";

function ProductById() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState({});
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const {data : productDetail} = useGetProductByidQuery(id)
  const [deleteProduct,{isLoading}] = useDeleteProductMutation()
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  // console.log("id inside getcategoryByid:",id )
  console.log("data for id :",productDetail)

  // useEffect(() => {
  //   setCategory({
  //   id: 1,
  //   name: "Electronics",
  //   subCategory: ["Mobiles", "Laptops", "Accessories"],
  //   createdAt: "15 Apr 2026",
  // });
  // }, [id]);


  const handleDelete = async () => {
    try {
      const res = await deleteProduct(id).unwrap()
      console.log("respone while deleting categories", res)
      navigate("/admin/product");
    } catch (error) {
      console.log("error: ", error)
    }
  };

  const handleUpdateProduct = (formData) => {
    const updatedCategory = updateCategory(id, formData);
    setCategory(updatedCategory);
    setIsUpdateOpen(false);

  };

  if (showCreateProduct) {
      return <CreateProduct 
      onShowList={() => setShowCreateProduct(false)} 
      mode = "update"
      initialData={productDetail.data}
      />;
    }
  

  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <div className="`rounded-4xl border border-blue-100 bg-linear-to-br from-white via-blue-50 to-slate-50 p-5 shadow-[0_18px_45px_rgba(59,130,246,0.10)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            {/* <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-400">
              Category Detail
            </p> */}
            <h1 className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">
              {productDetail?.data?.product_name || ""}
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowCreateProduct(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
            >
              <EditIcon className="h-5 w-5" />
              Update
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <DeleteIcon className="h-5 w-5" />
              Delete
            </button>
          </div>
        </div>

      </div>

      <div className="grid gap-5 xl:grid-cols-1">
        <div className="rounded-4xl border border-blue-100 bg-white p-5 shadow-[0_20px_50px_rgba(148,163,184,0.12)] sm:p-6">
          {/* categories detail will show here  */}
        </div>

        {/* <div className="rounded-4xl border border-blue-100 bg-white p-5 shadow-[0_20px_50px_rgba(148,163,184,0.12)] sm:p-6">
          <div className="border-b border-blue-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800">Sub Categories</h2>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-1">
            {category.subCategory.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="rounded-3xl border border-blue-100 bg-linear-to-br from-white via-blue-50 to-slate-50 p-4 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
                  {`Sub Category ${index + 1}`}
                </p>
                <p className="mt-2 text-base font-semibold text-slate-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* <CreateProduct
        isOpen={isUpdateOpen}
        onShowList={() => setShowCreateProduct(false)}
        onClose={() => setIsUpdateOpen(false)}
        setIsCreateModalOpen={setIsUpdateOpen}
        mode="update"
        // initialData={{
        //   id: data?.data?._id,
        //   categoryName: data?.data?.categories_name,
        //   subCategory: data?.data?.subCategories
        // }}
      /> */}

    </section>
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

function EditIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </IconShell>
  );
}

function DeleteIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </IconShell>
  );
}

export default ProductById;
