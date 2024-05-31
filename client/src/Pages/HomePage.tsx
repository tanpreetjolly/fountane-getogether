import Hero from "../components/Hero"
import ContactUs from "../components/ContactUs"
import Features from "../components/Features"
import HomeNav from "@/components/HomeNav"
import Footer from "@/components/Footer"
const HomePage = () => {
  return (
    <div className="md:pt-6 w-screen overflow-hidden pt-10">
      <HomeNav />
      <Hero />

      {/* <img
          src={middle}
          alt="hero"
          loading="eager"
          className="hidden lg:block absolute w-1/2 m-auto inset-0 top-0 shadow-2xl rounded-xl z-10"
        /> */}

      {/* <Testimonials /> */}
      <Features />
      <ContactUs />
      <Footer />
    </div>
  )
}

export default HomePage
