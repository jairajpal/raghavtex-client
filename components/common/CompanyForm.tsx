import React, { useState } from "react";

interface Company {
  name: string;
  gstNumber: string;
  phoneNumber: string;
}

interface CompanyFormProps {
  onSubmit: (company: Company) => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onSubmit }) => {
  const [company, setCompany] = useState<Company>({
    name: "",
    gstNumber: "",
    phoneNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(company);
    setCompany({
      name: "",
      gstNumber: "",
      phoneNumber: "",
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 mt-48">Add a Company</h2>
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          name="name"
          value={company.name}
          onChange={handleChange}
          placeholder="Company Name"
          className="border rounded px-2 py-1"
        />
        <input
          type="text"
          name="gstNumber"
          value={company.gstNumber}
          onChange={handleChange}
          placeholder="GST Number"
          className="border rounded px-2 py-1"
        />
        <input
          type="text"
          name="phoneNumber"
          value={company.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border rounded px-2 py-1"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white rounded px-4 py-2 mt-4"
      >
        Add Company
      </button>
    </div>
  );
};

export default CompanyForm;
