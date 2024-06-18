import React from "react"
import { Link } from "react-router-dom"
import { useAppSelector } from "../hooks"
import { IoPeople } from "react-icons/io5"
import { CalendarDays } from "lucide-react"
import left from "../assets/img/LandingPage/Events-bro.png"
import { Rating } from "@mui/material"
type Props = {}

const Hero: React.FC<Props> = () => {
  const { isAuthenticated } = useAppSelector((state) => state.user)
  return (
    <section className="bg-white flex flex-col lg:flex-row  px-4 gap-3  justify-center mx-auto lg:px-12 pt-20 lg:pt-10">
      <div className="lg:ml-10  flex flex-col  text-center lg:text-left items-center lg:items-start lg:w-[35%] pb-3 lg:pt-24">
        <a
          href="#"
          className="inline-flex w-fit items-center py-1 px-3 mb-4 text-sm text-white bg-highlight rounded-full  bg-indigo-500"
        >
          <span className="text-sm  lg:text-lg ">
            Revolutionize Event Planning!
          </span>
          <svg
            className="ml-2 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </a>
        <h1 className="mb-4 text-4xl font-bold tracking-tight leading-none text-gray-900 lg:text-5xl lg:text-[3.6rem]">
          Getogether: Stress Free Event Planning
        </h1>
        <p className="mb-4  font-normal text-gray-500 text-xl">
          Create, manage and share your events with friends and family with
          ease.
        </p>
        <div className="flex flex-col lg:flex-row items-center mb-6">
          <div className="flex -space-x-2">
            <div className="w-9 aspect-square rounded-full overflow-hidden">
              {" "}
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                className="w-full object-cover h-full"
              />
            </div>
            <div className="w-9 aspect-square rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                className="w-full object-cover h-full"
              />
            </div>
            <div className="w-9 aspect-square rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                className="w-full object-cover h-full"
              />
            </div>
            {/* Add more avatars as needed */}
          </div>
          <div className="ml-2  -space-y-1 items-center">
            <Rating name="rating" value={5} readOnly />
            <div className="ml-2    text-slate-600">
              5000+ users plans using Getogether
            </div>
          </div>
        </div>
        <div className="flex mb-4 lg:mb-7 flex-col items-start gap-2 lg:flex-row justify-items-start">
          {!isAuthenticated ? (
            <Link
              to={`${isAuthenticated ? "/events" : "/sign-up"}`}
              className="inline-flex justify-center items-center py-3 w-full lg:w-fit lg:py-3.5 px-7 font-medium text-center bg-slate-800 text-white rounded-full hover:bg-highlight focus:ring-4 focus:ring-blue-300 transition-all duration-200"
            >
              <IoPeople className="inline mr-2 text-xl" />
              Get Started
              <svg
                className="ml-2 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
          ) : (
            <div>
              <Link
                to={`${isAuthenticated ? "/events" : "/sign-up"}`}
                className="inline-flex justify-center items-center py-3 w-full lg:w-fit lg:py-3.5 px-7 font-medium text-center bg-slate-800 text-white rounded-full hover:bg-highlight focus:ring-4 focus:ring-blue-300 transition-all duration-200"
              >
                <CalendarDays size={20} className="mr-2" />
                My Events
                <svg
                  className="ml-2 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
      <figure className="  lg:w-2/5  rounded-xl overflow-hidden">
        <img
          src={left}
          alt="hero"
          loading="eager"
          className="w-full object-cover scale-105"
        />
      </figure>
    </section>
  )
}

export default Hero
