import NavBar from "../components/NavBar";
import TopBlur from "../components/TopBlur";
import BottomBlur from "../components/BottomBlur";
import CatLoader from "../components/CatLoader";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import request from "../request";
import '../App.css'

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [answer, setAnswer] = useState(null)
  const [reason, setReason] = useState(null)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const food = useParams().id;

  function formatText(input) {
    let answer = ''
    if (input.charAt(0) === 'Y') {
      answer = 'yup'
    }
    else if (input.charAt(0) === 'O') {
      answer = 'oof'
    }
    else answer = 'nope'
    input = input.substring(4)
    return { answer: answer, input: input }
  }

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(false)
    request(food)
      .then(result => {
        if (cancelled) return
        setAnswer(formatText(result).answer)
        setReason(formatText(result).input)
      })
      .catch(err => {
        if (cancelled) return
        console.error(err)
        setError(true)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [food, attempt]);

  return (
    <div className="isolate text-center min-h-screen overflow-y-hidden bg-purple-100">
      <NavBar />
      <main>
        <div className="relative mx-auto max-w-3xl px-4 pb-24 pt-[6.25vh] sm:pt-[12.5vh]">
          <TopBlur />
          <h1 className="text-5xl font-bold text-purple-900">
            can my 🐈 eat{" "}
            <b>
              <i className="text-purple-500">{food}</i>
            </b>
            &nbsp;?
          </h1>
          <BottomBlur />
          {isLoading &&
            <div className="pt-12">
              <div className="text-5xl text-purple-900 font-bold">hmm<span className="dot dot1">.</span><span className="dot dot2">.</span><span className="dot dot3">.</span></div>
              <div className="py-12"><CatLoader /></div>
              <a class="bg-purple-200 hover:bg-purple-300 font-bold text-xl text-purple-500 transition-all py-2.5 px-5 rounded items-center" href="/">cancel</a>
            </div>
          }
          {!isLoading && error &&
            <div className="pt-12">
              <div className="text-7xl">🙀</div>
              <div className="font-bold text-5xl text-purple-900 pt-6">uh oh!</div>
              <div className="text-xl text-purple-900 pt-6 pb-10">
                our cat got distracted chasing a laser pointer and lost track of your question. give it another try?
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-purple-500 hover:bg-purple-600 font-bold text-xl text-white transition-all py-2.5 px-5 rounded" onClick={() => setAttempt(a => a + 1)}>try again</button>
                <a className="bg-purple-200 hover:bg-purple-300 font-bold text-xl text-purple-500 transition-all py-2.5 px-5 rounded" href="/">pick another food</a>
              </div>
            </div>
          }
          {!isLoading && !error && <div className={`font-bold text-5xl pt-12 ${answer}`}>{answer}</div>}
          {!isLoading && !error &&
            <>
              <div className="text-xl text-purple-900 pt-12 pb-6">{reason}</div>
              <p className="text-sm text-purple-900/80 pb-10">
                ai-generated, may be wrong. not veterinary advice. if your cat
                ate something worrying, call your vet or ASPCA Poison Control at{" "}
                <a href="tel:+18884264435" className="underline">(888) 426-4435</a>.{" "}
                <a href="/legal" className="underline">more</a>
              </p>
              <a class="bg-purple-200 hover:bg-purple-300 font-bold text-xl text-purple-500 transition-all py-2.5 px-5 rounded items-center" href="/">have another food in mind?</a>
            </>
          }
        </div>
      </main>
    </div>
  )

}
