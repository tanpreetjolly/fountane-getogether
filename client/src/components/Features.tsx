import React from "react"
import stressReduction from "../assets/img/LandingPage/Good team-pana.png"
import ButtonSecondary from "./ButtonSecondary"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"

const Features: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div
      className="w-11/12 lg:w-5/6 mx-auto lg:mt-20 overflow-hidden pt-20"
      id="features"
    >
      <h1 className="text-3xl lg:text-6xl font-semibold text-center">
        Streamline Your Events with <span className="">Ease </span>
      </h1>
      <p className="text-center text-slate-500 text-lg mb-4 mt-2">
        Manage your events smoothly with budget tracking and stress reduction
        features.
      </p>
      <section className="flex pt-10 lg:pt-20 flex-col w-11/12 mx-auto lg:my-10 md:flex-row justify-center  lg:gap-10">
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start  text-center lg:text-left p-2">
          <h1 className=" lg:mt-7  font-semibold text-2xl  text-slate-800 lg:text-5xl whitespace-nowrap mb-4">
            Easy Event Management
          </h1>
          <div className="text-lg text-slate-600 lg:w-4/5 mb-5">
            Keep track of your event details and guests in real time. Manage
            your event without headaches! Just a few clicks and you are done.
          </div>
          <ButtonSecondary
            text="Get Started"
            onClick={() => {
              navigate("/sign-up")
            }}
            icon={<ArrowRight size={18} />}
          />
        </div>
        <div className="lg:w-1/3 ">
          <div className="relative mx-auto border-gray-800  bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
            <div className="h-[32px] w-[3px] bg-gray-800  absolute -start-[17px] top-[72px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800  absolute -start-[17px] top-[124px] rounded-s-lg"></div>
            <div className="h-[46px] w-[3px] bg-gray-800  absolute -start-[17px] top-[178px] rounded-s-lg"></div>
            <div className="h-[64px] w-[3px] bg-gray-800  absolute -end-[17px] top-[142px] rounded-e-lg"></div>
            <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white ">
              <img
                src="https://i.imgur.com/fZjDm04.jpeg"
                className="w-[272px] h-[572px]"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
      <section className="flex w-11/12 flex-col justify-center mx-auto my-14 lg:my-28  md:flex-row-reverse items-center lg:gap-10">
        <div className="lg:w-3/5  p-2 ">
          <h1 className="text-center lg:text-left font-semibold text-2xl lg:text-5xl mb-2">
            Stay Organized and Focused
          </h1>

          <div className="mt-4 pl-1 text-slate-600 text-sm md:text-base mb-2">
            Stay organized and focused, so you can enjoy your event. Our
            platform helps you manage your event details and guests in real
            time. Some of our key features includes:
          </div>
          <div>
            {/* Checklist non editable  depicting key features*/}
            <ul className=" list-inside mt-4 text-sm md:text-base">
              <li>
                <span className="text-xl ">✓</span> Real-time budget tracking
              </li>
              <li>
                <span className="text-xl ">✓</span> Guest list management
              </li>
              <li>
                <span className="text-xl ">✓</span> Event timeline
              </li>
              <li>
                <span className="text-xl ">✓</span> Task management
              </li>
              <li>
                <span className="text-xl ">✓</span> Vendor management
              </li>
            </ul>
          </div>
        </div>
        <div className="lg:w-2/5 overflow-hidden ">
          <img src={stressReduction} className="w-full scale-105" />
        </div>
      </section>
    </div>
  )
}

export default Features
