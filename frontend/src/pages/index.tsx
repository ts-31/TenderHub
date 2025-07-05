import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Home() {
  const [companies, setCompanies] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const res = await axios.get("http://localhost:5000/companies");
    setCompanies(res.data);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Companies on TenderHub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map((company) => (
          <div key={company.id} className="border rounded shadow p-4">
            <div className="flex items-center gap-4">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                  No Logo
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{company.name}</h2>
                <p className="text-sm text-gray-500">{company.industry}</p>
              </div>
            </div>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => router.push(`/company/${company.id}`)}
            >
              View Tenders
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
