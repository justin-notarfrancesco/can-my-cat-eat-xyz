import React from "react";
import NavBar from "../components/NavBar";
import TopBlur from "../components/TopBlur";
import SearchBar from "../components/SearchBar";
import BottomBlur from "../components/BottomBlur";

export default function Home() {
  return (
    <div className="isolate min-h-screen overflow-hidden bg-purple-100">
      <NavBar />
      <main>
        <div className="relative mx-auto max-w-3xl pt-[12.5vh]">
          <TopBlur />
          <h1 className="p-4 pt-0 text-center text-5xl font-bold text-purple-900">
            can my 🐈 eat{" "}
            <b>
              <i className="text-purple-500">xyz</i>
            </b>
            &nbsp;?
          </h1>
          <BottomBlur />
          <SearchBar />
        </div>
      </main>
    </div>
  );
}
