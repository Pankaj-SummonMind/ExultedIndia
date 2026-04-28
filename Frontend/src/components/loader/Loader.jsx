export default function Loader({ isLoading }) {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-50 flex  justify-center">
      {/* Background Glow */}
      <div className="absolute h-30 w-30 rounded-full bg-linear-to-r from-blue-400 via-pink-400 to-emerald-400 opacity-20 blur-3xl animate-pulse"></div>

      {/* Loader */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Rotating Ring */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-blue-500 border-r-pink-500 border-b-emerald-500 border-l-yellow-400 animate-spin"></div>

          {/* Inner Ring */}
          <div className="absolute inset-3 rounded-full border-[5px] border-transparent border-t-purple-500 border-r-cyan-500 border-b-orange-400 border-l-red-400 animate-[spin_1.5s_linear_infinite_reverse]"></div>

          {/* Center Dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full bg-linear-to-r from-pink-500 via-blue-500 to-emerald-500 animate-ping"></div>
          </div>
        </div>

        {/* Text */}
        {/* <div className="text-center">
          <h2 className="bg-linear-to-r from-blue-600 via-pink-500 to-emerald-500 bg-clip-text text-xl font-bold text-transparent animate-pulse">
            Loading...
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Please wait while we prepare everything
          </p>
        </div> */}
      </div>
    </div>
  );
}