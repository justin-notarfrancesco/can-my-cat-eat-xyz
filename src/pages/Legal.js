import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import TopBlur from "../components/TopBlur";
import BottomBlur from "../components/BottomBlur";

const LAST_UPDATED = "October 8, 2026";

function Section({ title, children }) {
  return (
    <section className="pb-6">
      <h3 className="pb-2 text-xl font-bold">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function Legal() {
  // Links like /legal#privacy are full page loads, so the browser tries to
  // jump to the anchor before React has rendered it.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <div className="relative isolate min-h-screen overflow-y-auto bg-purple-100">
      <NavBar />
      <main>
        <div className="relative mx-auto max-w-3xl px-6 pb-24 text-purple-900">
          <TopBlur />
          <h1 className="pb-4 pt-10 text-center text-5xl font-bold">
            legal stuff
          </h1>
          <p className="pb-8 text-center text-sm">
            last updated {LAST_UPDATED} ·{" "}
            <a href="#terms" className="underline">terms of use</a> ·{" "}
            <a href="#privacy" className="underline">privacy policy</a>
          </p>

          <div className="mb-10 rounded-xl bg-white p-5 shadow-lg ring-1 ring-black/5">
            <p className="font-bold">the short version</p>
            <p className="pt-2">
              every answer on this site is written automatically by an AI model
              and can be wrong. it is not veterinary advice. if your cat ate
              something and you're worried, call your vet or an animal poison
              hotline right away:{" "}
              <b>ASPCA Animal Poison Control (888) 426-4435</b> or{" "}
              <b>Pet Poison Helpline (855) 764-7661</b> (fees may apply).
            </p>
          </div>

          <h2 id="terms" className="scroll-mt-8 pb-6 text-3xl font-bold">
            terms of use
          </h2>

          <Section title="1. who we are">
            <p>
              canmycateat.xyz (the "Site") is a personal project operated by
              Justin Notarfrancesco ("we," "us," or "our"). You can reach us
              through{" "}
              <a href="https://notar.nyc" className="underline">notar.nyc</a>.
            </p>
          </Section>

          <Section title="2. agreeing to these terms">
            <p>
              By using the Site, you agree to these Terms of Use and our Privacy
              Policy below. If you do not agree, do not use the Site. You must
              be at least 18 years old to use the Site. The Site is not directed
              to anyone under 18.
            </p>
          </Section>

          <Section title="3. answers are AI-generated">
            <p>
              Answers on the Site are generated automatically by a third-party
              artificial intelligence model (currently Google Gemini) in
              response to what you type. Answers are saved and may be shown
              again to other people who search for the same thing. No
              veterinarian or other person reviews these answers before they
              are shown.
            </p>
            <p>
              AI-generated answers can be wrong, incomplete, out of date,
              inconsistent, or unsafe, even when they sound confident. For a
              small number of well-known dangerous foods and substances, the
              Site shows a fixed "no" answer instead of an AI answer. That list
              is not complete, and a food not being on it does not mean the food
              is safe.
            </p>
          </Section>

          <Section title="4. not veterinary advice">
            <p>
              Everything on the Site is for general informational and
              entertainment purposes only. It is not veterinary advice,
              diagnosis, or treatment, and it does not create a
              veterinarian-client-patient relationship. Every cat is different:
              age, weight, health conditions, medications, and amount eaten all
              matter. Always ask a licensed veterinarian before changing your
              cat's diet or giving your cat anything new. Never delay or ignore
              professional advice because of something you read on the Site.
            </p>
            <p>
              <b>
                If you think your cat has eaten something harmful, contact your
                veterinarian, an emergency animal hospital, ASPCA Animal Poison
                Control at (888) 426-4435, or Pet Poison Helpline at (855)
                764-7661 immediately.
              </b>
            </p>
          </Section>

          <Section title="5. acceptable use">
            <p>
              You agree not to: (a) use the Site for any unlawful purpose; (b)
              scrape, flood, or send automated requests to the Site or its API;
              (c) try to manipulate the AI into producing misleading, harmful,
              or offensive answers, or share such answers as if they were
              genuine; (d) interfere with or disrupt the Site; or (e) enter
              personal, sensitive, or confidential information into the search
              box. We may block access to anyone who violates these terms.
            </p>
          </Section>

          <Section title="6. disclaimer of warranties">
            <p className="font-bold uppercase">
              The Site and all content on it are provided "as is" and "as
              available," without warranties of any kind, express or implied,
              including without limitation any implied warranties of
              merchantability, fitness for a particular purpose, title,
              non-infringement, accuracy, or availability. We do not warrant
              that any answer is correct, complete, current, or safe to rely on,
              or that the Site will be uninterrupted or error-free. You use the
              Site and rely on its content entirely at your own risk.
            </p>
          </Section>

          <Section title="7. limitation of liability">
            <p className="font-bold uppercase">
              To the fullest extent permitted by law, we will not be liable for
              any indirect, incidental, special, consequential, exemplary, or
              punitive damages, or for any loss or damage of any kind, including
              harm to any animal, veterinary costs, or loss of data, arising out
              of or related to your use of or inability to use the Site or your
              reliance on any content on it, even if we have been advised of the
              possibility of such damages. Our total liability for all claims
              relating to the Site will not exceed fifty U.S. dollars ($50).
            </p>
            <p>
              Some jurisdictions do not allow certain warranty exclusions or
              liability limits, so some of the above may not apply to you. In
              that case, our liability is limited to the smallest amount the law
              allows.
            </p>
          </Section>

          <Section title="8. indemnification">
            <p>
              To the extent permitted by law, you agree to indemnify and hold us
              harmless from any claims, losses, damages, liabilities, and
              expenses (including reasonable attorneys' fees) arising from your
              use of the Site, your reliance on its content, or your violation
              of these terms.
            </p>
          </Section>

          <Section title="9. third-party services and links">
            <p>
              The Site relies on third-party services (see the Privacy Policy)
              and may link to other websites. We do not control and are not
              responsible for third-party services, websites, or their content
              or privacy practices.
            </p>
          </Section>

          <Section title="10. intellectual property">
            <p>
              The Site's design, name, and original content belong to us. You
              may share links to answers for personal, non-commercial use.
            </p>
          </Section>

          <Section title="11. changes">
            <p>
              We may change, suspend, or shut down the Site at any time. We may
              update these terms by posting a new version here with a new "last
              updated" date. Continuing to use the Site after a change means you
              accept the updated terms.
            </p>
          </Section>

          <BottomBlur />

          <Section title="12. governing law and general terms">
            <p>
              These terms are governed by the laws of the State of New York,
              without regard to its conflict-of-law rules. Any dispute relating
              to the Site will be brought only in the state or federal courts
              located in New York County, New York, and you consent to their
              jurisdiction. If any part of these terms is found unenforceable,
              the rest stays in effect. Our failure to enforce any part of these
              terms is not a waiver. These terms and the Privacy Policy are the
              entire agreement between you and us about the Site.
            </p>
          </Section>

          <h2 id="privacy" className="scroll-mt-8 pb-6 pt-8 text-3xl font-bold">
            privacy policy
          </h2>

          <Section title="what we collect">
            <p>
              <b>What you search for.</b> When you search for a food, the text
              you type is sent to our server, then to Google's Gemini AI to get
              an answer. We save the search term and its answer in our database
              (Google Firebase) so we can show the same answer to the next
              person. We do not save your name, email, IP address, or any other
              identifier with it. Your search also appears in the page address
              (URL).
            </p>
            <p>
              <b>Server logs.</b> Our hosting provider, Vercel, automatically
              logs technical information such as IP address, browser type,
              pages requested, and time of request, to run and secure the Site.
            </p>
            <p>
              <b>Analytics, only if you accept.</b> If you click "accept" in the
              cookie banner, we load Google Analytics, which uses cookies to
              collect information such as pages visited (including search terms
              in the URL), device and browser type, approximate location, and
              how you got to the Site. If you decline, Google Analytics is not
              loaded.
            </p>
            <p>
              <b>Your cookie choice.</b> We store whether you accepted or
              declined in your browser's local storage so we don't ask again.
            </p>
          </Section>

          <Section title="please don't type personal information">
            <p>
              Google may use what is sent to Gemini, along with the answers it
              generates, to provide and improve its products, and human
              reviewers at Google may read it. Only type food names. Do not
              enter personal, sensitive, or confidential information.
            </p>
          </Section>

          <Section title="how we use it">
            <p>
              We use this information only to answer your searches, reuse
              answers, keep the Site running and secure, and, if you accept
              analytics, understand how the Site is used. We do not sell or rent
              personal information, and we do not share it for targeted
              advertising.
            </p>
          </Section>

          <Section title="who we share it with">
            <p>
              We share information only with service providers that run the
              Site: Google (the Gemini API, Firebase, and Google Analytics if
              you accept) and Vercel (hosting). Their use of information is
              covered by their own privacy policies, including{" "}
              <a
                href="https://policies.google.com/privacy"
                className="underline"
              >
                Google's
              </a>{" "}
              and{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                className="underline"
              >
                Vercel's
              </a>
              . We may also disclose information if the law requires it.
            </p>
          </Section>

          <Section title="your choices">
            <p>
              You can change your analytics choice at any time with the "cookie
              settings" link at the bottom of every page. You can also block or
              delete cookies in your browser, or install the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                className="underline"
              >
                Google Analytics opt-out add-on
              </a>
              .
            </p>
          </Section>

          <Section title="how long we keep it">
            <p>
              Saved searches and answers are kept as long as the Site runs,
              because they contain no personal identifiers. Server logs and
              analytics data are kept according to Vercel's and Google
              Analytics' retention settings.
            </p>
          </Section>

          <Section title="your rights">
            <p>
              Depending on where you live (for example, the EU, UK, or
              California), you may have the right to access, correct, delete, or
              object to the processing of your personal information, and to
              complain to a data protection authority. To make a request,
              contact us through{" "}
              <a href="https://notar.nyc" className="underline">notar.nyc</a>.
              Because saved searches are not linked to any person, we usually
              cannot identify which ones are yours.
            </p>
          </Section>

          <Section title="children">
            <p>
              The Site is not directed to children, and we do not knowingly
              collect personal information from anyone under 18.
            </p>
          </Section>

          <Section title="where data is processed">
            <p>
              The Site is run from the United States, and our service providers
              may process information in the United States and other countries.
            </p>
          </Section>

          <Section title="changes to this policy">
            <p>
              We may update this policy by posting a new version here with a new
              "last updated" date.
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}
