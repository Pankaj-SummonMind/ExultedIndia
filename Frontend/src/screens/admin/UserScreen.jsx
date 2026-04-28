import { useEffect, useState } from "react";
import CreateUser from "../../components/createUser";
import { useGetAllUsersQuery } from "../../services/api";
import { data, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import toast from "react-hot-toast";


function UserScreen() {
  const navigate = useNavigate();
  const [isOpen,setIsOpen] = useState(false)
  const {data : userRows,isLoading,error} = useGetAllUsersQuery()
  
  useEffect(() => {
    if (error) {
      toast.error("Internal Server Error:");
    }
  }, [error]);

  const onClose = () => {
    setIsOpen(false)
  }
  console.log("user data :",userRows)
  return (
    <section className="flex min-h-[calc(100vh-176px)] flex-col gap-5">
      <Loader isLoading={isLoading} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
        <div className="flex flex-col gap-4 border-b border-blue-100 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
              User Table
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {setIsOpen(true)}}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
          >
            <PlusIcon className="h-5 w-5" />
            Add User
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
                    <TableHeading className="rounded-tl-3xl">
                      Name
                    </TableHeading>
                    <TableHeading>Mobile Number</TableHeading>
                    <TableHeading>EmailId</TableHeading>
                    <TableHeading className="rounded-tr-3xl">
                      Registered At
                    </TableHeading>
                  </tr>
                </thead>

                <tbody>
                  {userRows?.data?.map((row,index) => (
                    <tr
                      key={row.id}
                      key={row._id}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/admin/user/${row._id}`)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              navigate(`/admin/user/${row.id}`);
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
                          {row.name}
                        </p>
                      </TableCell>

                      <TableCell>
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">
                          {row.mobileNumber}
                        </span>
                      </TableCell>

                      <TableCell>
                        <p className="text-sm leading-6 text-slate-500">
                          {row.email}
                        </p>
                      </TableCell>

                      <TableCell>
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
                          {new Date(row.createdAt).toLocaleDateString()}
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
      <CreateUser
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              setIsCreateModalOpen={setIsOpen}
              // onSubmit={handleCreateCategory}
              // mode="create"
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

export default UserScreen;
