import dotenv from "dotenv";
import { getCache, knownToxicAnswer } from "../api/ask.mjs";

// Lists the answers saved in the Firebase cache so a person can check them.
// Reads FIREBASE_SERVICE_ACCOUNT from .env.local (`vercel env pull` creates it).
//
//   npm run review-answers                          yes answers nobody has reviewed
//   npm run review-answers -- --all                 every saved answer
//   npm run review-answers -- --csv > answers.csv   CSV instead of plain text
//   npm run review-answers -- --approve "<key>" ... mark answers as reviewed
//   npm run review-answers -- --delete "<key>" ...  delete answers (the next
//                                                   search generates a new one)
//
// Keys are the lowercase names the list prints. Answers whose food now gets a
// fixed answer are never served, so they only show up with --all.

dotenv.config({ path: ".env.local", quiet: true });

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
// The keys after a flag, up to the next flag.
function keysAfter(name) {
    if (!flag(name)) return [];
    const rest = args.slice(args.indexOf(name) + 1);
    const end = rest.findIndex((a) => a.startsWith("--"));
    return end === -1 ? rest : rest.slice(0, end);
}

function csvField(value) {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function status(entry) {
    if (knownToxicAnswer(entry.food ?? "")) return "not shown (fixed answer)";
    const reviewed = entry.reviewed ? "reviewed" : "not reviewed";
    if (!entry.answer?.startsWith("Yes.")) return reviewed;
    return `${entry.verified ? "checked" : "unchecked"}, ${reviewed}`;
}

async function main() {
    const cache = getCache();
    if (!cache) throw new Error("FIREBASE_SERVICE_ACCOUNT isn't set. Run `vercel env pull .env.local` first.");

    const all = (await cache.get()).val() || {};

    const approve = keysAfter("--approve");
    const remove = keysAfter("--delete");
    if (approve.length || remove.length) {
        const missing = [...approve, ...remove].filter((key) => !(key in all));
        if (missing.length) throw new Error(`No saved answer for: ${missing.join(", ")}`);
        for (const key of approve) await cache.child(key).update({ reviewed: true, reviewedAt: Date.now() });
        for (const key of remove) await cache.child(key).remove();
        console.log(`Approved ${approve.length}, deleted ${remove.length}.`);
        return;
    }

    const entries = Object.entries(all)
        .filter(([, entry]) => flag("--all") || (entry.answer?.startsWith("Yes.") && !entry.reviewed && !knownToxicAnswer(entry.food ?? "")))
        .sort(([a], [b]) => a.localeCompare(b));

    if (flag("--csv")) {
        console.log("key,food,status,created,answer");
        for (const [key, entry] of entries) {
            const created = entry.createdAt ? new Date(entry.createdAt).toISOString().slice(0, 10) : "";
            console.log([key, entry.food, status(entry), created, entry.answer].map(csvField).join(","));
        }
        return;
    }

    for (const [key, entry] of entries) {
        console.log(`${key}  [${status(entry)}]\n  ${entry.answer}\n`);
    }
    console.log(`${entries.length} of ${Object.keys(all).length} saved answers listed.`);
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err.message);
        process.exit(1);
    });
