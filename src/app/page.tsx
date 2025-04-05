import Image from "next/image"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 pb-24">
      {/* Navigation */}
      <header className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-teal-100 p-2 rounded-full">
            <span className="text-navy-700 font-semibold">LiftUp</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-white/80 text-navy-800">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="p-2 rounded-full bg-white/80 text-navy-800">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H14L9 21V16Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full mx-auto px-4 py-8">
        {/* Main Card */}
        <div className="relative bg-blue-200/70 rounded-3xl p-6 overflow-hidden shadow-lg mb-12">
          {/* Decorative stars */}
          <div className="absolute top-10 left-10 text-amber-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div className="absolute top-40 right-20 text-amber-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div className="absolute bottom-20 left-1/4 text-amber-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>

          {/* Clouds */}
          <div className="absolute left-10 top-20 bg-white/80 h-10 w-36 rounded-full"></div>
          <div className="absolute right-20 top-40 bg-white/80 h-10 w-36 rounded-full"></div>
          <div className="absolute left-1/4 bottom-20 bg-white/80 h-8 w-28 rounded-full"></div>

          {/* Circle background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/60 rounded-full"></div>

          {/* Stylized trees/hills */}
          <div className="absolute left-5 bottom-0 w-24 h-36">
            <div className="w-24 h-24 bg-blue-700/30 rounded-tl-full rounded-tr-full"></div>
          </div>
          <div className="absolute right-5 bottom-0 w-24 h-36">
            <div className="w-24 h-24 bg-blue-700/30 rounded-tl-full rounded-tr-full"></div>
          </div>

          {/* Main text */}
          <div className="relative text-center mb-8 max-w-2xl mx-auto pt-8">
            <h1 className="h-20 text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 mb-4">Feeling down?</h1>
            <p className="text-7xl font-bold text-teal-400 leading-tight">
              Let us help you pick something joyful to do!
            </p>
          </div>

          {/* CTA Button */}
          <div className="relative flex justify-center mb-4">
            <button className="bg-white shadow-md text-navy-900 font-bold text-lg px-10 py-4 rounded-full flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Give me Something to do!
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-4 mb-4">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-10 py-5 font-medium text-lg shadow-md">
              Give Me
            </Button>
            <Button className="bg-teal-400 hover:bg-teal-500 text-navy-800 rounded-full px-10 py-5 font-medium text-lg shadow-md">
              Go Do it!
            </Button>
          </div>
        </div>

        {/* Situation section */}
        <div className="mt-8 px-2">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 mb-6">Situation?</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="bg-white/90 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-blue-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full">
                    {/* Replace with actual activity illustrations */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {item === 1 && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                          <path d="M18 8c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zM6 15.5c0-2.5 3.3-4.5 8-4.5s8 2 8 4.5v2.5H6v-2.5z"/>
                        </svg>
                      )}
                      {item === 2 && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                      )}
                      {item === 3 && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500">
                          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3Z"/>
                        </svg>
                      )}
                      {item === 4 && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                          <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"/>
                          <path d="M9.1 12a2.1 2.1 0 0 0 3 3"/>
                          <circle cx="12" cy="12" r="1"/>
                        </svg>
                      )}
                      {item === 5 && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500">
                          <path d="M17 11l-5-5-5 5"/>
                          <path d="M17 18l-5-5-5 5"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  {item === 1 && <p className="font-medium text-navy-800">Describe your situation?</p>}
                  {item === 2 && <p className="font-medium text-navy-800">Describe your situation</p>}
                  {item === 3 && <p className="font-medium text-navy-800">Click for an activity</p>}
                  {item === 4 && <p className="font-medium text-navy-800">Open options</p>}
                  {item === 5 && <p className="font-medium text-navy-800">Recall public activities</p>}

                  {item >= 3 && <p className="font-medium text-blue-600 mt-2">Go do it!</p>}
                  {item <= 2 && <p className="text-sm text-navy-600/70 mt-2">optional</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

