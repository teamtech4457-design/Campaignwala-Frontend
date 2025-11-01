import React, { useState } from "react";

const Footer = ({ darkMode }) => {
  const [showPolicy, setShowPolicy] = useState(false);

  return (
    <>
      {/* Footer */}
      <footer
        className={`mt-auto border-t w-full transition-all duration-300 ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-400"
            : "bg-white border-gray-200 text-gray-600"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-sm flex-wrap">
            {/* Left Links */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
              <a href="#" className="hover:text-blue-600 transition-colors flex flex-col items-center gap-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                Contact Us
              </a>
              <button
                onClick={() => setShowPolicy(true)}
                className="hover:text-blue-600 transition-colors flex flex-col items-center gap-1"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                Privacy Policy
              </button>
            </div>

            {/* Right Icons */}
            <div className="flex justify-center sm:justify-end gap-5 text-lg">
              <a href="#" className="hover:text-blue-600 transition-colors">🌐</a>
              <a href="#" className="hover:text-blue-600 transition-colors">📷</a>
              <a href="#" className="hover:text-blue-600 transition-colors">💼</a>
            </div>
          </div>

          <div className="mt-4 text-center text-xs sm:text-sm text-gray-500">
            © Campaignwala by Codessy
          </div>
        </div>
      </footer>

      {/* Privacy Policy Popup */}
      {showPolicy && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPolicy(false);
          }}
        >
          <div
            className={`rounded-lg p-6 max-w-3xl w-full max-h-[80vh] mx-4 overflow-y-auto shadow-lg relative transition-all duration-300 ${
              darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Privacy Policy
            </h2>
            <div className="text-sm leading-relaxed space-y-3">
              <p>
                This Privacy Policy applies to access and use of the software
                including Web Application, and any other relevant medium. The
                website by the name "Campaignwala" is owned by Campaignwala and
                operated by Codessey. (together referred to interchangeably as
                "we," "our," or "Campaignwala"). Campaignwala enables agents to
                sell various financial and non-financial products and services
                such as Demat account, credit, saving accounts, etc., through
                our technology platform and earn money ("Services").
              </p>

              <p>
                We at Campaignwala are committed to protecting the privacy and
                security of our users ("you", "your", "user(s)", or
                "subscriber(s)"). Your privacy is important, and maintaining
                your trust is paramount to us. This Privacy Policy ("Privacy
                Policy") explains how we collect, use, process, disclose, and
                safeguard your information when you access and use our Services
                through our website and mobile app (collectively referred to as
                the "Platform").
              </p>

              <p>
                Our Platform and Services are primarily available for use within
                India only. Please read this Privacy Policy carefully to
                understand our policies and practices regarding your information
                and how we will treat it.
              </p>

              <h3 className="font-semibold mt-4">WHAT INFORMATION DO WE COLLECT?</h3>
              <p>
                We collect Personal Information (as defined below) from you when
                you register with us on our Platform. Personal Information
                includes but is not limited to: Name, address, phone number,
                email, date of birth, financial information (for KYC),
                demographic information, and linked social profiles.
              </p>

              <h3 className="font-semibold mt-4">HOW DO WE USE YOUR INFORMATION?</h3>
              <p>
                We use the information to create your account, verify identity,
                process transactions, provide personalized experience, resolve
                issues, improve our platform, and communicate updates or
                promotional offers.
              </p>

              <h3 className="font-semibold mt-4">TO WHOM DO WE DISCLOSE YOUR INFORMATION?</h3>
              <p>
                We may share your information with trusted partners, affiliates,
                or government authorities when required by law. We never sell
                your information to unrelated third parties.
              </p>

              <h3 className="font-semibold mt-4">
                THIRD-PARTY WEBLINKS, APPS AND PLUGINS
              </h3>
              <p>
                Our Platform may contain links to third-party websites or apps.
                We are not responsible for their privacy practices or content.
              </p>

              <h3 className="font-semibold mt-4">HOW DO WE RETAIN YOUR INFORMATION?</h3>
              <p>
                We retain your data as long as necessary for providing our
                services or as required by law (usually up to 5 years after
                deactivation).
              </p>

              <h3 className="font-semibold mt-4">HOW DO WE SECURE YOUR DATA?</h3>
              <p>
                We use encryption, firewalls, and secure servers to protect your
                data. However, no system is 100% secure, and users should take
                precautions with credentials.
              </p>

              <h3 className="font-semibold mt-4">WILL WE CHANGE THE PRIVACY POLICY?</h3>
              <p>
                We may update this Privacy Policy periodically. Changes will be
                notified through email or app updates.
              </p>

              <h3 className="font-semibold mt-4">COPYRIGHT POLICY</h3>
              <p>
                The contents of this Platform may not be reproduced or
                distributed without permission from Campaignwala as per the
                Copyright Act, 1957.
              </p>

              <h3 className="font-semibold mt-4">GOVERNING LAW & DISPUTE RESOLUTION</h3>
              <p>
                This Privacy Policy is governed by the laws of India, and any
                disputes shall be handled under applicable Indian law.
              </p>

              <h3 className="font-semibold mt-4">PRIVACY QUESTIONS AND GRIEVANCE REDRESSAL</h3>
              <p>
                If you have questions or concerns, contact us at:
                <br />
                📧 <span className="text-blue-500">support@campaignwala.com</span>
                <br />
                Grievance Officer: [Enter Name Here]
                <br />
                Contact: +91-[Enter Phone Number]
                <br />
                Address: [Enter Office Address]
                <br />
                Working Hours: Mon–Fri, 10:00 AM – 6:00 PM IST
              </p>
            </div>

            <button
              onClick={() => setShowPolicy(false)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto mx-auto block"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;