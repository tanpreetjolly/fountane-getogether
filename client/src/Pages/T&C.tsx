import Footer from "@/components/Footer";
import HomeNav from "@/components/HomeNav";

const Terms = () => {
  return (
    <div className="mx-auto">
      <HomeNav />
      <div className="py-24 px-4 sm:px-6 max-w-screen-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6">Terms and Conditions</h1>
        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">Introduction</h2>
          <p className="text-sm sm:text-base mb-2">
            Welcome to PlanMe Club LLC. By using our Services, you agree to
            comply with and be bound by the following terms and conditions
            ("Terms"). Please read these Terms carefully before using our
            Services.
          </p>
        </section>
        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">Use of Services</h2>
          <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base">
            <li className="mb-1 sm:mb-2">
              <strong>Eligibility:</strong> You must be at least 18 years old to
              use our Services.
            </li>
            <li className="mb-1 sm:mb-2">
              <strong>Account:</strong> You are responsible for maintaining the
              confidentiality of your account information and for all activities
              that occur under your account.
            </li>
            <li className="mb-1 sm:mb-2">
              <strong>Service Offerings:</strong> Users may create and offer
              services to other users. These offerings are the sole
              responsibility of the user who creates them.
            </li>
            <li className="mb-1 sm:mb-2">
              <strong>Communication:</strong> Users can chat and send files to
              each other. We do not monitor or take responsibility for the
              content of these communications.
            </li>
          </ul>
        </section>
        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">User Conduct</h2>
          <p className="text-sm sm:text-base mb-2">You agree not to use our Services to:</p>
          <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base">
            <li>Violate any laws or regulations.</li>
            <li>Infringe on the rights of others.</li>
            <li>Transmit harmful or offensive content.</li>
            <li>Engage in fraudulent activities.</li>
          </ul>
        </section>
        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">
            Limitation of Liability
          </h2>
          <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base">
            <li className="mb-1 sm:mb-2">
              <strong>No Liability for User Conduct:</strong> We are not liable
              for any content posted by users, including chat messages and files
              sent between users.
            </li>
            <li className="mb-1 sm:mb-2">
              <strong>Service Availability:</strong> We do not guarantee that
              our Services will be available at all times or without
              interruption.
            </li>
            <li className="mb-1 sm:mb-2">
              <strong>Third-Party Links:</strong> Our Services may contain links
              to third-party websites. We are not responsible for the content or
              practices of these websites.
            </li>
          </ul>
        </section>
        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">Indemnification</h2>
          <p className="text-sm sm:text-base">
            You agree to indemnify and hold harmless PlanMe Club LLC and its
            affiliates, officers, directors, employees, and agents from any
            claims, liabilities, damages, losses, and expenses arising from your
            use of our Services or your violation of these Terms.
          </p>
        </section>
        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">Termination</h2>
          <p className="text-sm sm:text-base">
            We reserve the right to terminate or suspend your account at our
            sole discretion, without notice or liability, for conduct that we
            believe violates these Terms or is harmful to other users of our
            Services.
          </p>
        </section>
        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">Governing Law</h2>
          <p className="text-sm sm:text-base">
            These Terms are governed by and construed in accordance with the
            laws of California, without regard to its conflict of laws
            principles.
          </p>
        </section>
        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">
            Changes to These Terms
          </h2>
          <p className="text-sm sm:text-base">
            We may update these Terms from time to time. We will notify you of
            any changes by posting the new Terms on our website and updating the
            "Last Updated" date.
          </p>
        </section>
        <section>
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">Contact Us</h2>
          <p className="text-sm sm:text-base">
            If you have any questions about these Terms, please contact us at
            support@planme.club.
          </p>
        </section>
        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600">
          Last Updated: June 22, 2024
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;