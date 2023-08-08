import React from "react";

interface Company {
  name: string;
  gstNumber: string;
  phoneNumber: string;
}

interface CompanyListProps {
  companies: Company[];
  onEdit: (company: Company) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({ companies, onEdit }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Company List</h2>
      <ul>
        {companies.map((company, index) => (
          <li key={index} className="border p-2 mb-2 rounded">
            <p>Name: {company.name}</p>
            <p>GST Number: {company.gstNumber}</p>
            <p>Phone Number: {company.phoneNumber}</p>
            <button
              onClick={() => onEdit(company)}
              className="bg-green-500 text-white rounded px-2 py-1 mt-2"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyList;
