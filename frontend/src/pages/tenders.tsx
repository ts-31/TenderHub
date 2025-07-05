import { useEffect, useState } from "react";
import axios from "axios";

export default function Tenders() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [myCompanyId, setMyCompanyId] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetchTenders();
    fetchApplications();
  }, []);

  const fetchTenders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tenders");
      setTenders(res.data);
    } catch (err) {
      console.error("Error fetching tenders:", err);
    }
  };

  const fetchApplications = async () => {
    if (!token) return;

    try {
      // ✅ Get current logged-in company
      const companyRes = await axios.get("http://localhost:5000/companies/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const companyId = companyRes.data?.id;
      if (!companyId) return;

      setMyCompanyId(companyId);

      // ✅ Fetch applications to find already applied tenders
      const appsRes = await axios.get(
        `http://localhost:5000/applications?tenderId=*`
      );
      const applied = appsRes.data.filter(
        (a: any) => a.company?.id === companyId
      );
      setAppliedIds(applied.map((a: any) => a.tenderId));
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  const applyToTender = async (tenderId: string) => {
    const proposal = prompt("Enter your proposal message:");
    if (!proposal || !token) return;

    try {
      await axios.post(
        "http://localhost:5000/applications",
        { tenderId, proposal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Applied successfully!");
      setAppliedIds([...appliedIds, tenderId]);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Unknown error";
      alert(msg); // 🔥 Show exact error from backend
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Available Tenders</h1>
      <div className="space-y-4">
        {tenders.map((tender) => {
          const isOwnTender = tender.company?.id === myCompanyId;
          const isApplied = appliedIds.includes(tender.id);

          return (
            <div key={tender.id} className="border p-4 rounded shadow-sm">
              <h2 className="text-xl font-semibold">{tender.title}</h2>
              <p className="text-gray-600">{tender.description}</p>
              <p className="text-sm text-gray-500">Budget: ₹{tender.budget}</p>
              <p className="text-sm text-gray-500">
                Deadline: {tender.deadline.slice(0, 10)}
              </p>

              <div className="mt-2 flex items-center gap-2">
                {tender.company?.logoUrl && (
                  <img
                    src={tender.company.logoUrl}
                    alt="logo"
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <p className="text-sm italic">
                  Posted by: {tender.company?.name}
                </p>
              </div>

              <button
                onClick={() => applyToTender(tender.id)}
                disabled={isOwnTender || isApplied}
                className={`mt-3 px-4 py-2 rounded text-white ${
                  isOwnTender || isApplied
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600"
                }`}
              >
                {isOwnTender ? "Your Tender" : isApplied ? "Applied" : "Apply"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
