import { useState } from "react";
import { pages } from "../assets/content";
import { Combobox } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/outline";

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  // shuffle once per mount so unrelated re-renders don't reorder the list
  const [shuffledPages] = useState(() => shuffle(pages));
  const filteredPages = shuffledPages.filter((page) =>
    page.toLowerCase().startsWith(query.toLowerCase())
  );

  return (
    <Combobox
      as="div"
      className="overflow-y-auto p-10 pt-4 pb-20"
      onChange={(query) => {
        if (query !== undefined) {
          window.location.href = `/${query}`;
        }
      }}
    >
      <div className="mx-auto max-w-xl divide-y divide-purple-300 rounded-xl bg-white p-4 text-xl text-purple-900 shadow-2xl ring-1 ring-black/5">
        <div className="flex items-center pb-1">
          <SearchIcon className="h-6 w-6" />
          <Combobox.Input
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            className="h-8 w-full bg-transparent p-2 text-gray-800 placeholder-gray-400 !outline-none"
            placeholder="search"
          />
        </div>
        {filteredPages.length > 0 && (
          <Combobox.Options static className="comboboxMaxHeight overflow-y-auto pt-1">
            {filteredPages.map((page) => (
              <Combobox.Option key={page} value={page} className="mr-3">
                {({ active }) => (
                  <a className="text-purple-900 visited:text-purple-900 hover:text-purple-900" href={page}>
                    <div className={`p-1 pl-2 font-medium ${active ? `rounded-lg bg-purple-900 text-white` : ``}`}>
                      {page}
                    </div>
                  </a>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
        {filteredPages.length === 0 && (
          <Combobox.Options static className="comboboxMaxHeight overflow-y-auto pt-1">
            <Combobox.Option key={query} value={query} className="mr-3">
              {({ active }) => (
                <a className="text-purple-900 visited:text-purple-900 hover:text-purple-900" href={query}>
                  <div className={`p-1 pl-2 font-medium ${active ? `rounded-lg bg-purple-900 text-white` : ``}`}>
                    {query}
                  </div>
                </a>
              )}
            </Combobox.Option>
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
