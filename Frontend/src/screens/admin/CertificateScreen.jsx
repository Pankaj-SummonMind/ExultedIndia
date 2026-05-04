import { useMemo, useState } from "react";
import CreateCertificate from "../../components/CreateCertificate";
import {
  useDeleteCertificateMutation,
  useGetAllCertificatesQuery,
} from "../../services/api";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import Loader from "../../components/loader/Loader";
import toast from "react-hot-toast";

function CertificateScreen() {
  const [deleteCertificate,{isLoading:isDeleteLoading}] = useDeleteCertificateMutation();
  const { data, isLoading:isCertificateLoading,error:fetchingError } = useGetAllCertificatesQuery();
  const isLoading = isCertificateLoading || isDeleteLoading;

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const certificates = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data]);

  const openCreate = () => {
    setActiveCertificate(null);
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setActiveCertificate({
      id: item._id,
      name: item.certificate_name,
      image: item.image, // Assuming the API returns the image URL here
    });
    setIsOpen(true);
  };

  const onDelete = async (item) => {
    try {
      const res = await deleteCertificate({
        id: item._id,
      }).unwrap();
      toast.success(res?.message || "Certificate deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete certificate");
    }
  };

  return (
    <section className="p-4 sm:p-5 lg:p-6">
      <Loader isLoading={isLoading} />
      <div className="mb-5 rounded-[30px] border border-blue-100 bg-linear-to-br from-white via-blue-50 to-slate-50 p-5 shadow-[0_18px_45px_rgba(59,130,246,0.10)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
              Admin
            </p>
            <h1 className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
              Certificates
            </h1>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

            <button
              onClick={openCreate}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-400 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500"
            >
              Add Certificate
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-blue-100 bg-white px-5 py-8 text-center text-sm font-medium text-slate-500 shadow-[0_14px_35px_rgba(148,163,184,0.10)]">
          Loading certificates...
        </div>
      ) : (
        <div className="overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_20px_50px_rgba(148,163,184,0.12)]">
          <div className="border-b border-blue-100 px-5 py-4 sm:px-6">
            <p className="text-sm font-semibold text-slate-700">
              Certificate List
            </p>
          </div>

          {certificates.length > 0 ? (
            <div className="divide-y divide-blue-50">
              {certificates.map((item, index) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 px-5 py-4 transition hover:bg-blue-50/50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="flex flex-1 items-center gap-4 min-w-0">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-blue-100 bg-slate-50">
                      {item.image?.url ? (
                        <img
                            src={item.image.url}
                            alt={item.certificate_name}
                            onClick={() => setActiveIndex(index)}
                            className="h-full w-full cursor-pointer object-cover"
                          />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                          No Img
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-800 truncate">
                        {item.certificate_name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-start gap-2 sm:justify-end">
                    <button
                      onClick={() => onDelete(item)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-200 bg-white text-red-600 transition hover:bg-red-50"
                    >
                      <DeleteIcon className="h-5 w-5"/>
                    </button>

                    <button
                      onClick={() => openEdit(item)}
                      className="inline-flex h-10 items-center justify-center rounded-2xl border border-blue-200 bg-white px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-10 text-center text-sm font-medium text-slate-500">
              No certificates found.
            </div>
          )}
        </div>
      )}
      <Lightbox
          open={activeIndex >= 0}
          close={() => setActiveIndex(-1)}
          index={activeIndex}
          slides={certificates.map((item) => ({
            src: item.image?.url,
            title: item.certificate_name,
          }))}
          plugins={[Zoom]}
          carousel={{ finite: false }}
          zoom={{
            maxZoomPixelRatio: 3,
            doubleTapDelay: 300,
            doubleClickDelay: 300,
          }}
        />

      <CreateCertificate
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        activeCertificate={activeCertificate}
      />
    </section>
  );
}

export default CertificateScreen;

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
