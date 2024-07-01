import Footer from "@/components/Footer"
import HomeNav from "@/components/HomeNav"
import { Instagram } from "lucide-react"

const AboutPage = () => {
  return (
    <div className="mx-auto">
      <HomeNav />
      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-screen-xl mx-auto">
        

        <h1 className="text-xl mt-4 sm:text-3xl font-semibold mb-6 md:w-1/2 ">
        INTRODUCING PlanMe.club (website) & @PlanMeClub (Instagram)
        </h1>

        <div className="space-y-6 text-base leading-relaxed">
          

          <p>
            PlanMe is an organization tool used by event hosts, event vendors
            (for example: photographers, decorators, caterers etc.) and event
            planners to get into 1 "room" and communicate and organize
            efficiently all through one resource!
          </p>

          <p>
            The idea was to make communication and organization of event
            planning efficient and straightforward. No more excel sheets, Google
            docs, long text or email threads.
          </p>

          <p>
            It's meant for vendors to have an easy and fun planning process with
            hosts. And from your perspective, you can easily communicate with
            the host and other vendors of that event within the app.
          </p>
        </div>

        <div className="mt-12 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-medium mb-2">
            Our Mission
          </h2>
          <p className="text-base leading-relaxed">
            At PlanMe.club, we're on a mission to simplify event planning and
            make it a joyful experience for everyone involved. By providing a
            centralized platform for communication and organization, we aim to
            eliminate the stress and confusion often associated with event
            coordination.
          </p>
        </div>

        <div className=" mt-7 sm:mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 gap-3">
          
          <a
            href="https://www.instagram.com/PlanMeClub"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-500 w-fit -ml-1 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-xl flex gap-1"
          >
            Follow @PlanMeClub
            <Instagram/>
          </a>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutPage
