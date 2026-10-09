import { useState } from "react";
import Logo from "../components/Logo";
import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

const navigation = [
  { name: "legal stuff", href: "/legal" },
];

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="px-6 pt-6 sm:px-6">
      <nav
        className="flex h-9 items-center justify-between"
      >
        <div className="flex sm:min-w-0 sm:flex-1">
          <Logo />
        </div>
        <div className="flex sm:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-purple-900"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">open main menu</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <div className="sm:flex-2 hidden sm:flex sm:min-w-0 sm:justify-center sm:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="font-semibold text-purple-900 hover:text-purple-500 transition-all"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden sm:flex sm:min-w-0 sm:flex-1 sm:justify-end"></div>
      </nav>
      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <Dialog.Panel
          focus="true"
          className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 sm:hidden"
        >
          <div className="flex h-9 items-center justify-between">
            <div className="flex">
              <Logo />
            </div>
            <div className="flex">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-purple-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">close menu</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-purple-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-purple-900 hover:bg-purple-400/10 transition-all"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
