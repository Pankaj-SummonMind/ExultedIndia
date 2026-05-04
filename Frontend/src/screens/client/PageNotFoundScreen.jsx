import { NavLink } from "react-router-dom";
import lightBulb from "../../assets/lightBulbRemovebg.png"

function PageNotFoundScreen() {
  return (
    <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#dceeff] text-slate-900">
      <style>
        {`
          @keyframes pageFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          @keyframes pageReveal {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div className="absolute inset-x-0 top-0 h-[30vh] min-h-57.5 bg-blue-400">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.16),transparent_55%)]" />
        <div className="absolute -left-16 top-10 h-32 w-32 rounded-full bg-white/15 blur-3xl sm:h-44 sm:w-44" />
        <div className="absolute -right-10 bottom-4 h-28 w-28 rounded-full bg-sky-200/40 blur-3xl sm:h-40 sm:w-40" />
      </div>

      <div className="relative z-10 grid min-h-[calc(100vh-72px)] grid-rows-[30vh_1fr]">
        <div className="flex items-center justify-center px-4 pt-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-3xl px-6 py-7 text-center text-white motion-safe:animate-[pageReveal_700ms_ease-out_both] sm:px-10 sm:py-9">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-blue-100">
              Status 404
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              404 - Page Not Found
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
              The page you are looking for may have been moved, deleted, or
              never existed.
            </p>

            <div className="mt-6">
              <NavLink
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-black text-blue-600 shadow-[0_16px_40px_rgba(255,255,255,0.28)] transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Go to Home
              </NavLink>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center px-4 pb-10 pt-12 sm:px-6 sm:pb-12 lg:px-8">
          <div className="absolute inset-x-0 bottom-0 top-0 bg-[linear-gradient(180deg,rgba(219,234,254,0.12),rgba(191,219,254,0.55))]" />

          <div className="relative flex w-full max-w-5xl items-center justify-center">
            <div className="absolute bottom-8 h-16 w-[70%] max-w-2xl rounded-full bg-slate-900/15 blur-3xl" />

            <div className="relative w-full rounded-4xl border border-white/55 bg-white/45 p-4 shadow-[0_26px_90px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-6">
              <div className="mx-auto flex h-57.5 w-full max-w-190 items-center justify-center rounded-3xl bg-[linear-gradient(180deg,#eef7ff_0%,#d7ebff_100%)] px-3 sm:h-72.5 sm:px-5 lg:h-87.5 ">
                <img
                  src={lightBulb}
                  alt="Broken glowing bulb representing a missing page"
                  className="h-full w-full max-w-180 object-contain motion-safe:animate-[pageFloat_5s_ease-in-out_infinite] bg-"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PageNotFoundScreen;
