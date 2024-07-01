import Footer from "@/components/Footer"
import HomeNav from "@/components/HomeNav"

const PrivacyPolicy = () => {
  return (
    <div className="mx-auto">
      <HomeNav />
      <div className="py-24 px-4 sm:px-6 max-w-screen-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">
          Privacy Policy
        </h1>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">
            Introduction
          </h2>
          <p className="text-sm sm:text-base mb-2">
            Welcome to PlanMe Club LLC ("we," "our," "us"). Your privacy is
            critically important to us. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use
            our event planning application, website, and related services
            ("Services").
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">
            Information We Collect
          </h2>
          <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base">
            <li className="mb-1 sm:mb-2">
              <strong>Personal Information:</strong> When you sign up, we
              collect personal information such as your name, email address, and
              contact details.
            </li>
            <li className="mb-1 sm:mb-2">
              <strong>Service Information:</strong> Information related to the
              events you plan, including details about your guests, vendors, and
              event logistics.
            </li>
            <li className="mb-1 sm:mb-2">
              <strong>Usage Data:</strong> We collect information about how you
              use our Services, including your interactions with other users,
              chat messages, and files shared.
            </li>
          </ul>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">
            How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base">
            <li>To provide and maintain our Services.</li>
            <li>To improve and personalize your experience.</li>
            <li>
              To communicate with you, including sending updates and promotional
              materials.
            </li>
            <li>To ensure the security and integrity of our Services.</li>
          </ul>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">
            Sharing Your Information
          </h2>
          <p className="text-sm sm:text-base">
            We do not share your personal information with third parties except
            as necessary to provide our Services, comply with the law, or
            protect our rights.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">
            Security of Your Information
          </h2>
          <p className="text-sm sm:text-base">
            We use administrative, technical, and physical security measures to
            protect your personal information. However, we cannot guarantee
            absolute security.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">
            Your Rights
          </h2>
          <p className="text-sm sm:text-base">
            You have the right to access, correct, or delete your personal
            information. You may also object to our processing of your
            information or request that we restrict our use of your information.
          </p>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">
            Changes to This Privacy Policy
          </h2>
          <p className="text-sm sm:text-base">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new policy on our website and
            updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">
            Contact Us
          </h2>
          <p className="text-sm sm:text-base">
            If you have any questions or concerns about this Privacy Policy,
            please contact us at [contact information].
          </p>
        </section>

        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600">
          Last Updated: June 22, 2024
        </p>
      </div>
      <Footer />
    </div>
  )
}

export default PrivacyPolicy
