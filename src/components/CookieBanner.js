export default function CookieBanner({ onChoice }) {
  return (
    <div
      role="dialog"
      aria-label="cookie consent"
      className="fixed inset-x-0 bottom-0 z-20 p-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-xl bg-white p-4 text-purple-900 shadow-2xl ring-1 ring-black/5 sm:flex-row">
        <p className="text-sm">
          we'd like to use google analytics cookies to see how the site is used.
          they only turn on if you say okay. details are in our{" "}
          <a href="/legal#privacy" className="underline">
            privacy policy
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onChoice("denied")}
            className="rounded bg-purple-200 px-4 py-2 font-bold text-purple-700 transition-all hover:bg-purple-300"
          >
            decline
          </button>
          <button
            type="button"
            onClick={() => onChoice("granted")}
            className="rounded bg-purple-200 px-4 py-2 font-bold text-purple-700 transition-all hover:bg-purple-300"
          >
            accept
          </button>
        </div>
      </div>
    </div>
  );
}
