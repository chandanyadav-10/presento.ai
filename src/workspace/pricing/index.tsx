import { PricingTable } from "@clerk/clerk-react";
import React from "react";

function Pricing() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-indigo-50 via-white to-white">

      {/* Title Section */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold tracking-tight">
          Simple <span className="text-primary">Pricing</span>
        </h1>

        <p className="text-gray-500 mt-4 text-lg">
          Start creating unlimited AI PPT slides 🚀
        </p>
      </div>

      {/* Pricing Card Container */}
      <div className="max-w-5xl mx-auto px-6">

        <div className="bg-white border shadow-2xl rounded-3xl p-10 transition hover:shadow-indigo-200">

          <PricingTable />

        </div>

      </div>

    </div>
  );
}

export default Pricing;