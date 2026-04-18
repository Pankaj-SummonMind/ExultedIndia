import { useEffect, useMemo, useState } from 'react';
import { useCreateCategoriesMutation, useUpdateCategoriesMutation } from '../services/api';


function CreateCategory({ isOpen, onClose, onSubmit, initialData = null, mode = 'create',setIsCreateModalOpen }) {
  const [createCategories,isLoading] = useCreateCategoriesMutation();
  const [updateCategories,{isLoading:isUpdateLoading}] = useUpdateCategoriesMutation();
  const emptySub = { name: '' };
  const [categoryName, setCategoryName] = useState('');
  const [subCategories, setSubCategories] = useState([emptySub]);

  useEffect(() => {
    if (!isOpen) return;
    setCategoryName(initialData?.categoryName || '');
    setSubCategories(initialData?.subCategory?.length ? initialData.subCategory : [emptySub]);
  }, [isOpen, initialData]);

  const canAddMore = useMemo(() => subCategories.every(item => item.name.trim() !== ''), [subCategories]);

  if (!isOpen) return null;


  const updateSub = (index, value) => {
    setSubCategories(prev => prev.map((item, i) => i === index ? { ...item, name: value } : item));
  };

  const addMore = () => {
    if (!canAddMore) return;
    setSubCategories(prev => [...prev, { name: '' }]);
  };

  const removeSub = (index) => {
    setSubCategories(prev => prev.length === 1 ? [emptySub] : prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setCategoryName('');
    setSubCategories([emptySub]);
  };

  const handleCancel = () => {
    resetForm();
    onClose(); 
  }

  const submitForm = async (e) => {
    e.preventDefault();
    const payload = {
      id: initialData?.id,
      categories_name: categoryName.trim(),
      subCategories: subCategories.map(item => ({ ...item, name: item.name.trim() })).filter(item => item.name)
    };
    console.log("payload",payload)
    if (!payload.categories_name || payload.subCategories.length === 0) return;
    // onSubmit(payload, mode);
    if(mode === "create"){
      try {
        const res = await createCategories({
          categories_name:payload.categories_name,
          subCategories:payload.subCategories
        }).unwrap()
        console.log("res after create category: ",res)
        setIsCreateModalOpen(false);
        resetForm();
        onClose();
      } catch (error) {
        console.log("error: ",error)
      }
    }
    if (mode === "update") {
      try {
        const res = await updateCategories({
          id: payload.id,
          categories_name: payload.categories_name,
          subCategories: payload.subCategories
        }).unwrap();

        console.log("res after update category:", res);

        setIsCreateModalOpen(false);
        resetForm();
        onClose();

      } catch (error) {
        console.log("error:", error);
      }
}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close create category modal"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[3px]"
        onClick={handleCancel}
      />

      <div className="relative z-10 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-4xl border border-blue-100 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.20)]">
        <div className="flex items-start justify-between gap-4 border-b border-blue-100 bg-linear-to-r from-white via-blue-50 to-slate-50 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-400">
              {mode === "update" ? "Update Category" : "Category Modal"}
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
              {mode === "update" ? "Update Category" : "Create Category"}
            </h2>
          </div>

          <button
            type="button"
            aria-label="Cancel create category"
            onClick={handleCancel}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-white text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submitForm} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="grid gap-5">
              <FieldShell
                label="Category Name"
                htmlFor="categoryName"
                helperText="Enter a clear category title for your catalog."
              >
                <input
                  id="categoryName"
                  type="text"
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  placeholder="e.g. Electronics"
                  className="w-full rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </FieldShell>

              <div className="rounded-[28px] border border-blue-100 bg-slate-50/80 p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Sub Categories
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addMore}
                    disabled={!canAddMore}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:shadow-none"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add More
                  </button>
                </div>

                <div className="mt-5 flex max-h-[34vh] flex-col gap-4 overflow-y-auto pr-1">
                  {subCategories.map((item, index) => (
                    <div
                      key={`subcategory-${index}`}
                      className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex-1">
                          <label
                            htmlFor={`subCategory-${index}`}
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            {`Sub Category ${index + 1}`}
                          </label>
                          <input
                            id={`subCategory-${index}`}
                            type="text"
                            value={item.name}
                            onChange={(event) =>
                              updateSub(index, event.target.value)
                            }
                            placeholder={`Enter sub category ${index + 1}`}
                            className="w-full rounded-2xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                          />
                        </div>

                        <button
                          type="button"
                          aria-label={`Delete sub category ${index + 1}`}
                          onClick={() => removeSub(index)}
                          className="inline-flex h-12 w-12 items-center justify-center self-end rounded-2xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                        >
                          <DeleteIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-blue-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-blue-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
            >
              {mode === "update" ? "Save Changes" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldShell({ label, htmlFor, helperText, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      {children}
      <p className="mt-2 text-xs text-slate-400">{helperText}</p>
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

function PlusIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconShell>
  );
}

function CloseIcon({ className }) {
  return (
    <IconShell className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
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

export default CreateCategory;



//   return (
//     <div>
//       <form onSubmit={submitForm}>
//         <input value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder='Category Name' />
//         {subCategories.map((item, index) => (
//           <div key={index}>
//             <input value={item.name} onChange={e => updateSub(index, e.target.value)} placeholder={`Sub Category ${index + 1}`} />
//             <button type='button' onClick={() => removeSub(index)}>Remove</button>
//           </div>
//         ))}
//         <button type='button' onClick={addMore}>Add More</button>
//         <button type='button' onClick={() => { resetForm(); onClose(); }}>Cancel</button>
//         <button type='submit'>{mode === 'update' ? 'Save Changes' : 'Submit'}</button>
//       </form>
//     </div>
//   );
// }

