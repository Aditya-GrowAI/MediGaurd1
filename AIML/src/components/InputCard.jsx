import React from "react";

export default function InputCard({ inputs, setInputs, onUpdate }) {

  const handleChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-[#111827] p-6 rounded-2xl border border-gray-700">

      <h2 className="text-xl font-semibold mb-6">
        Resource Input
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <input
          type="number"
          placeholder="Bed Usage %"
          value={inputs.bedRate || ""}
          onChange={(e) => handleChange("bedRate", e.target.value)}
          className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="number"
          placeholder="ICU Usage %"
          value={inputs.icuRate || ""}
          onChange={(e) => handleChange("icuRate", e.target.value)}
          className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="number"
          placeholder="Ventilator Usage %"
          value={inputs.ventRate || ""}
          onChange={(e) => handleChange("ventRate", e.target.value)}
          className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

      </div>

      <button
        onClick={onUpdate}
        className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-semibold transition"
      >
        UPDATE
      </button>

    </div>
  );
}
