'use client';

export default function PrivacyPolicy() {
  return (
    <main className="pt-24">
      <div className="mx-auto max-w-[1200px] pb-8 px-4 sm:px-6">
        <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including but not limited to:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Name and contact information</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Property preferences and search criteria</li>
              <li>Information about your interactions with our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Provide and improve our services</li>
              <li>Communicate with you about properties and services</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Analyze and improve our website performance</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Property developers and agents (with your consent)</li>
              <li>Service providers who assist in our operations</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Lodge a complaint with supervisory authorities</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
} 