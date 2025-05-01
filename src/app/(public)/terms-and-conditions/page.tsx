'use client';

export default function TermsAndConditions() {
  return (
    <main className="pt-24">
      <div className="mx-auto max-w-[1200px] pb-8 px-4 sm:px-6">
        <h1 className="text-2xl font-bold mb-6">Terms and Conditions</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
            <p>Permission is granted to temporarily access the materials (information or software) on Elite Destination Property's website for personal, non-commercial transitory viewing only.</p>
            <p className="mt-2">This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Property Listings</h2>
            <p>All property listings and information displayed on this website are subject to change without notice. While we strive to provide accurate and up-to-date information, we cannot guarantee the availability or price of any property listed on our website.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. User Responsibilities</h2>
            <p>Users of this website agree to:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Provide accurate and complete information when using our services</li>
              <li>Use the website in a manner consistent with all applicable laws and regulations</li>
              <li>Not interfere with the proper working of the website</li>
              <li>Not attempt to circumvent any security measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Disclaimer</h2>
            <p>The materials on Elite Destination Property's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </section>
        </div>
      </div>
    </main>
  );
} 