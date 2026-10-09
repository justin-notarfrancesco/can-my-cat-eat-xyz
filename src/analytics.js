// Google Analytics only loads after the visitor accepts cookies in the
// banner. The choice is remembered in localStorage under CONSENT_KEY.
const GA_ID = "G-6SMR4JZN99";
const CONSENT_KEY = "analytics-consent";

let loaded = false;

export function getConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function setConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {}
  applyConsent(value);
}

export function applyConsent(value) {
  window[`ga-disable-${GA_ID}`] = value !== "granted";
  if (value === "granted") {
    loadAnalytics();
  } else {
    deleteAnalyticsCookies();
  }
}

function loadAnalytics() {
  if (loaded) return;
  loaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
}

// GA sets its cookies on the top-level domain, so both the bare host and the
// dotted parent domain are cleared.
function deleteAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host.split(".").slice(-2).join(".")}`];
  document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((name) => name === "_ga" || name.startsWith("_ga_"))
    .forEach((name) => {
      domains.forEach((domain) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${
          domain ? `; domain=${domain}` : ""
        }`;
      });
    });
}
