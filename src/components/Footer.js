export default function Footer({ onCookieSettings }) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-10 bg-purple-100/80 px-4 py-2 text-center text-xs text-purple-900 backdrop-blur">
      © {new Date().getFullYear()} canmycateat.xyz · ai answers, not vet advice ·{" "}
      <a href="/legal#terms" className="underline hover:text-purple-500">
        terms
      </a>{" "}
      ·{" "}
      <a href="/legal#privacy" className="underline hover:text-purple-500">
        privacy
      </a>{" "}
      ·{" "}
      <button
        type="button"
        onClick={onCookieSettings}
        className="underline hover:text-purple-500"
      >
        cookie settings
      </button>
    </footer>
  );
}
