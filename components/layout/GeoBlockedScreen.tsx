export default function GeoBlockedScreen() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500">
        <span className="text-2xl font-bold text-white">T</span>
      </div>
      <h1 className="text-3xl font-bold text-white">Not available in your region</h1>
      <p className="mt-3 max-w-md text-zinc-400">
        TrendsMix is not available in your country at this time.
      </p>
    </div>
  );
}
