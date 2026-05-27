import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      step: "1",
      title: "Schedule Pickup",
      description: "Book a convenient pickup time for your electronic devices through our easy online platform.",
      icon: "📅"
    },
    {
      step: "2", 
      title: "Secure Collection",
      description: "Our certified team safely collects your e-waste with proper handling and documentation.",
      icon: "🚛"
    },
    {
      step: "3",
      title: "Data Destruction",
      description: "We ensure complete data destruction and security with certified wiping processes.",
      icon: "🔒"
    },
    {
      step: "4",
      title: "Eco-Friendly Recycling",
      description: "Materials are processed through environmentally responsible recycling methods.",
      icon: "♻️"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How E2Recycle Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our simple 4-step process makes e-waste recycling hassle-free and environmentally responsible
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-green-200 transition duration-300">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      title: "Certified Data Destruction",
      description: "100% secure data wiping with certification for your peace of mind",
      icon: "🛡️"
    },
    {
      title: "Free Pickup Service",
      description: "Convenient doorstep collection at no additional cost to you",
      icon: "🆓"
    },
    {
      title: "Environmental Impact",
      description: "Reduce carbon footprint and support sustainable practices",
      icon: "🌱"
    },
    {
      title: "All Device Types",
      description: "We accept smartphones, laptops, tablets, and all electronic devices",
      icon: "📱"
    },
    {
      title: "Compliance Guaranteed",
      description: "Full compliance with environmental regulations and standards",
      icon: "✅"
    },
    {
      title: "Real-time Tracking",
      description: "Track your e-waste journey from pickup to recycling completion",
      icon: "📍"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose E2Recycle?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive e-waste management solutions with a focus on security, sustainability, and convenience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Leading the E-Waste Revolution
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              E2Recycle is committed to transforming how electronic waste is managed globally. 
              With over 10 years of experience in sustainable technology solutions, we've become 
              the trusted choice for individuals and businesses seeking responsible e-waste disposal.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Our mission is to create a circular economy where electronic devices are recycled 
              efficiently, reducing environmental impact while recovering valuable materials for future use.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">ISO 14001 Environmental Management Certified</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">R2 (Responsible Recycling) Certified</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700">Zero Landfill Guarantee</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Impact</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">2.5M+</div>
                  <div className="text-green-100">Devices Recycled</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">15K tons</div>
                  <div className="text-green-100">CO2 Emissions Prevented</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">98%</div>
                  <div className="text-green-100">Customer Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { HowItWorksSection, FeaturesSection, AboutSection };