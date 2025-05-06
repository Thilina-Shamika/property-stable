'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { toast } from 'react-hot-toast';

export default function ListPropertyPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    listingType: 'Sell',
    propertyAddress: ''
  });

  const [selectedCountry, setSelectedCountry] = useState('+971');

  const getPlaceholder = (countryCode: string) => {
    const placeholders: { [key: string]: string } = {
      '+971': '50 123 4567', // UAE
      '+44': '07400 123456', // UK
      '+1': '(555) 123-4567', // US
      '+91': '98765 43210', // India
      '+86': '138 1234 5678', // China
      '+81': '090-1234-5678', // Japan
      '+82': '010-1234-5678', // South Korea
      '+65': '9123 4567', // Singapore
      '+60': '012-345 6789', // Malaysia
      '+66': '081-234-5678', // Thailand
      '+62': '0812-3456-7890', // Indonesia
      '+63': '0915 123 4567', // Philippines
      '+84': '0912 345 678', // Vietnam
      '+95': '09 123 4567', // Myanmar
      '+856': '020 1234 5678', // Laos
      '+855': '012 345 678', // Cambodia
      '+880': '01 2345 6789', // Bangladesh
      '+977': '9841234567', // Nepal
      '+94': '071 234 5678', // Sri Lanka
      '+92': '0300 1234567', // Pakistan
      '+93': '070 123 4567', // Afghanistan
      '+98': '0912 345 6789', // Iran
      '+964': '0750 123 4567', // Iraq
      '+962': '07 1234 5678', // Jordan
      '+961': '03 123 456', // Lebanon
      '+963': '0933 123 456', // Syria
      '+967': '07 1234 567', // Yemen
      '+968': '92 123456', // Oman
      '+974': '33 123 456', // Qatar
      '+973': '33 123 456', // Bahrain
      '+966': '05 1234 5678', // Saudi Arabia
      '+965': '5 123 4567', // Kuwait
      '+20': '01 2345 6789', // Egypt
      '+212': '06 12 34 56 78', // Morocco
      '+216': '20 123 456', // Tunisia
      '+213': '05 12 34 56 78', // Algeria
      '+218': '91-1234567', // Libya
      '+27': '071 123 4567', // South Africa
      '+234': '0801 234 5678', // Nigeria
      '+233': '020 123 4567', // Ghana
      '+225': '07 07 07 07 07', // Ivory Coast
      '+254': '0712 345678', // Kenya
      '+251': '091 123 4567', // Ethiopia
      '+255': '0712 345678', // Tanzania
      '+256': '0701 234567', // Uganda
      '+260': '0977 123456', // Zambia
      '+263': '071 234 5678', // Zimbabwe
      '+267': '71 123 456', // Botswana
      '+268': '7612 3456', // Eswatini
      '+269': '339 12 34 56', // Comoros
      '+291': '07 123 4567', // Eritrea
      '+297': '560 1234', // Aruba
      '+298': '123456', // Faroe Islands
      '+299': '12 34 56', // Greenland
      '+30': '69 1234 5678', // Greece
      '+31': '06 12345678', // Netherlands
      '+32': '0470 12 34 56', // Belgium
      '+33': '06 12 34 56 78', // France
      '+34': '612 345 678', // Spain
      '+36': '06 30 123 4567', // Hungary
      '+39': '312 345 6789', // Italy
      '+40': '07 123 456 789', // Romania
      '+41': '076 123 45 67', // Switzerland
      '+43': '0664 123456', // Austria
      '+45': '12 34 56 78', // Denmark
      '+46': '070-123 45 67', // Sweden
      '+47': '123 45 678', // Norway
      '+48': '512 345 678', // Poland
      '+49': '0151 12345678', // Germany
      '+51': '912 345 678', // Peru
      '+52': '55 1234 5678', // Mexico
      '+54': '11 1234-5678', // Argentina
      '+55': '11 98765-4321', // Brazil
      '+56': '9 1234 5678', // Chile
      '+57': '300 123 4567', // Colombia
      '+58': '0412-1234567', // Venezuela
      '+61': '0412 345 678', // Australia
      '+64': '021 123 4567', // New Zealand
      '+675': '7123 4567', // Papua New Guinea
      '+676': '771 2345', // Tonga
      '+677': '74 12345', // Solomon Islands
      '+678': '591 2345', // Vanuatu
      '+679': '701 2345', // Fiji
      '+680': '777 1234', // Palau
      '+681': '50 12 34', // Wallis and Futuna
      '+682': '71 234', // Cook Islands
      '+683': '1234', // Niue
      '+685': '72 12345', // Samoa
      '+686': '720 12345', // Kiribati
      '+687': '75 12 34', // New Caledonia
      '+688': '71234', // Tuvalu
      '+689': '87 12 34 56', // French Polynesia
      '+690': '7123', // Tokelau
      '+691': '350 1234', // Micronesia
      '+692': '235 1234', // Marshall Islands
      '+850': '0192 123 4567', // North Korea
      '+852': '5123 4567', // Hong Kong
      '+853': '6612 3456', // Macau
      '+886': '0912 345 678', // Taiwan
      '+960': '771 2345', // Maldives
      '+970': '0599 123 456', // Palestine
      '+972': '050-123-4567', // Israel
      '+975': '17 12 34 56', // Bhutan
      '+976': '9911 1111', // Mongolia
      '+992': '98 765 4321', // Tajikistan
      '+993': '61 123456', // Turkmenistan
      '+994': '050 123 45 67', // Azerbaijan
      '+995': '599 123 456', // Georgia
      '+996': '0700 123 456', // Kyrgyzstan
      '+998': '90 123 45 67', // Uzbekistan
    };
    return placeholders[countryCode] || '123 456 7890';
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/valuations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      toast.success('Valuation request submitted successfully');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        listingType: 'Sell',
        propertyAddress: ''
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit request');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="min-h-screen bg-white ">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto bg-white border border-gray-200 shadow-md rounded-lg p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Book a Valuation</h1>
              <p className="text-gray-600">
                Ready to make your move? Start with a free property valuation. It's quick, easy, and informative.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  placeholder="Name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  placeholder="Email"
                />
              </div>

              {/* Mobile Field */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <select
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 bg-white"
                    defaultValue="+971"
                    onChange={handleCountryChange}
                  >
                    <option value="+971">🇦🇪 United Arab Emirates (+971)</option>
                    <option value="+44">🇬🇧 United Kingdom (+44)</option>
                    <option value="+1">🇺🇸 United States (+1)</option>
                    <option value="+91">🇮🇳 India (+91)</option>
                    <option value="+86">🇨🇳 China (+86)</option>
                    <option value="+81">🇯🇵 Japan (+81)</option>
                    <option value="+82">🇰🇷 South Korea (+82)</option>
                    <option value="+65">🇸🇬 Singapore (+65)</option>
                    <option value="+60">🇲🇾 Malaysia (+60)</option>
                    <option value="+66">🇹🇭 Thailand (+66)</option>
                    <option value="+62">🇮🇩 Indonesia (+62)</option>
                    <option value="+63">🇵🇭 Philippines (+63)</option>
                    <option value="+84">🇻🇳 Vietnam (+84)</option>
                    <option value="+95">🇲🇲 Myanmar (+95)</option>
                    <option value="+856">🇱🇦 Laos (+856)</option>
                    <option value="+855">🇰🇭 Cambodia (+855)</option>
                    <option value="+880">🇧🇩 Bangladesh (+880)</option>
                    <option value="+977">🇳🇵 Nepal (+977)</option>
                    <option value="+94">🇱🇰 Sri Lanka (+94)</option>
                    <option value="+92">🇵🇰 Pakistan (+92)</option>
                    <option value="+93">🇦🇫 Afghanistan (+93)</option>
                    <option value="+98">🇮🇷 Iran (+98)</option>
                    <option value="+964">🇮🇶 Iraq (+964)</option>
                    <option value="+962">🇯🇴 Jordan (+962)</option>
                    <option value="+961">🇱🇧 Lebanon (+961)</option>
                    <option value="+963">🇸🇾 Syria (+963)</option>
                    <option value="+967">🇾🇪 Yemen (+967)</option>
                    <option value="+968">🇴🇲 Oman (+968)</option>
                    <option value="+974">🇶🇦 Qatar (+974)</option>
                    <option value="+973">🇧🇭 Bahrain (+973)</option>
                    <option value="+966">🇸🇦 Saudi Arabia (+966)</option>
                    <option value="+965">🇰🇼 Kuwait (+965)</option>
                    <option value="+20">🇪🇬 Egypt (+20)</option>
                    <option value="+212">🇲🇦 Morocco (+212)</option>
                    <option value="+216">🇹🇳 Tunisia (+216)</option>
                    <option value="+213">🇩🇿 Algeria (+213)</option>
                    <option value="+218">🇱🇾 Libya (+218)</option>
                    <option value="+27">🇿🇦 South Africa (+27)</option>
                    <option value="+234">🇳🇬 Nigeria (+234)</option>
                    <option value="+233">🇬🇭 Ghana (+233)</option>
                    <option value="+225">🇨🇮 Ivory Coast (+225)</option>
                    <option value="+254">🇰🇪 Kenya (+254)</option>
                    <option value="+251">🇪🇹 Ethiopia (+251)</option>
                    <option value="+255">🇹🇿 Tanzania (+255)</option>
                    <option value="+256">🇺🇬 Uganda (+256)</option>
                    <option value="+260">🇿🇲 Zambia (+260)</option>
                    <option value="+263">🇿🇼 Zimbabwe (+263)</option>
                    <option value="+267">🇧🇼 Botswana (+267)</option>
                    <option value="+268">🇸🇿 Eswatini (+268)</option>
                    <option value="+269">🇰🇲 Comoros (+269)</option>
                    <option value="+291">🇪🇷 Eritrea (+291)</option>
                    <option value="+297">🇦🇼 Aruba (+297)</option>
                    <option value="+298">🇫🇴 Faroe Islands (+298)</option>
                    <option value="+299">🇬🇱 Greenland (+299)</option>
                    <option value="+30">🇬🇷 Greece (+30)</option>
                    <option value="+31">🇳🇱 Netherlands (+31)</option>
                    <option value="+32">🇧🇪 Belgium (+32)</option>
                    <option value="+33">🇫🇷 France (+33)</option>
                    <option value="+34">🇪🇸 Spain (+34)</option>
                    <option value="+36">🇭🇺 Hungary (+36)</option>
                    <option value="+39">🇮🇹 Italy (+39)</option>
                    <option value="+40">🇷🇴 Romania (+40)</option>
                    <option value="+41">🇨🇭 Switzerland (+41)</option>
                    <option value="+43">🇦🇹 Austria (+43)</option>
                    <option value="+45">🇩🇰 Denmark (+45)</option>
                    <option value="+46">🇸🇪 Sweden (+46)</option>
                    <option value="+47">🇳🇴 Norway (+47)</option>
                    <option value="+48">🇵🇱 Poland (+48)</option>
                    <option value="+49">🇩🇪 Germany (+49)</option>
                    <option value="+51">🇵🇪 Peru (+51)</option>
                    <option value="+52">🇲🇽 Mexico (+52)</option>
                    <option value="+54">🇦🇷 Argentina (+54)</option>
                    <option value="+55">🇧🇷 Brazil (+55)</option>
                    <option value="+56">🇨🇱 Chile (+56)</option>
                    <option value="+57">🇨🇴 Colombia (+57)</option>
                    <option value="+58">🇻🇪 Venezuela (+58)</option>
                    <option value="+61">🇦🇺 Australia (+61)</option>
                    <option value="+64">🇳🇿 New Zealand (+64)</option>
                    <option value="+675">🇵🇬 Papua New Guinea (+675)</option>
                    <option value="+676">🇹🇴 Tonga (+676)</option>
                    <option value="+677">🇸🇧 Solomon Islands (+677)</option>
                    <option value="+678">🇻🇺 Vanuatu (+678)</option>
                    <option value="+679">🇫🇯 Fiji (+679)</option>
                    <option value="+680">🇵🇼 Palau (+680)</option>
                    <option value="+681">🇼🇫 Wallis and Futuna (+681)</option>
                    <option value="+682">🇨🇰 Cook Islands (+682)</option>
                    <option value="+683">🇳🇺 Niue (+683)</option>
                    <option value="+685">🇼🇸 Samoa (+685)</option>
                    <option value="+686">🇰🇮 Kiribati (+686)</option>
                    <option value="+687">🇳🇨 New Caledonia (+687)</option>
                    <option value="+688">🇹🇻 Tuvalu (+688)</option>
                    <option value="+689">🇵🇫 French Polynesia (+689)</option>
                    <option value="+690">🇹🇰 Tokelau (+690)</option>
                    <option value="+691">🇫🇲 Micronesia (+691)</option>
                    <option value="+692">🇲🇭 Marshall Islands (+692)</option>
                    <option value="+850">🇰🇵 North Korea (+850)</option>
                    <option value="+852">🇭🇰 Hong Kong (+852)</option>
                    <option value="+853">🇲🇴 Macau (+853)</option>
                    <option value="+886">🇹🇼 Taiwan (+886)</option>
                    <option value="+960">🇲🇻 Maldives (+960)</option>
                    <option value="+970">🇵🇸 Palestine (+970)</option>
                    <option value="+972">🇮🇱 Israel (+972)</option>
                    <option value="+975">🇧🇹 Bhutan (+975)</option>
                    <option value="+976">🇲🇳 Mongolia (+976)</option>
                    <option value="+992">🇹🇯 Tajikistan (+992)</option>
                    <option value="+993">🇹🇲 Turkmenistan (+993)</option>
                    <option value="+994">🇦🇿 Azerbaijan (+994)</option>
                    <option value="+995">🇬🇪 Georgia (+995)</option>
                    <option value="+996">🇰🇬 Kyrgyzstan (+996)</option>
                    <option value="+998">🇺🇿 Uzbekistan (+998)</option>
                  </select>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    className="flex-1 ml-2 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                    placeholder={getPlaceholder(selectedCountry)}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Format: {getPlaceholder(selectedCountry)}</p>
              </div>

              {/* Listing Type Field */}
              <div>
                <label htmlFor="listingType" className="block text-sm font-medium text-gray-700 mb-1">
                  Listing Type
                </label>
                <select
                  id="listingType"
                  name="listingType"
                  value={formData.listingType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 bg-white"
                >
                  <option value="Sell">Sell</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>

              {/* Property Address Field */}
              <div>
                <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Address
                </label>
                <input
                  type="text"
                  id="propertyAddress"
                  name="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  placeholder="Property Address"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-4 rounded-full hover:bg-gray-800 transition-colors"
              >
                Submit Details
              </button>

              <p className="text-sm text-gray-500 text-center">
                By clicking Submit, you agree to our Terms & Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
} 