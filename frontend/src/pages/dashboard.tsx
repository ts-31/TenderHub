import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [company, setCompany] = useState<any>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const init = async () => {
      if (!token) {
        router.push("/login");
        return;
      }
      await fetchCompany();
    };
    init();
  }, []);

  const fetchCompany = async () => {
    try {
      const res = await axios.get("http://localhost:5000/companies/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompany(res.data);
    } catch (err) {
      alert("Failed to load company");
    }
  };

  const handleTenderCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/tenders/create", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Tender created!");
      setForm({ title: "", description: "", budget: "", deadline: "" });
    } catch (err) {
      alert("Tender creation failed");
    }
  };

  const handleLogoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !token) return;
    const fileInput = document.getElementById("logo") as HTMLInputElement;
    if (!fileInput || !fileInput.files?.[0]) {
      alert("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("logo", fileInput.files[0]);

    try {
      await axios.post(
        `http://localhost:5000/companies/${company.id}/logo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Logo uploaded!");
      fetchCompany(); // refresh updated logo
    } catch (err) {
      alert("Logo upload failed");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Company Dashboard</h1>

      {company ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{company.name}</h2>
          <p className="text-sm text-gray-600">{company.industry}</p>
          {company.logoUrl && (
            <img
              src={company.logoUrl}
              alt="Company Logo"
              className="h-20 my-2 rounded"
            />
          )}

          <form
            onSubmit={handleLogoUpload}
            className="mt-4 flex flex-col gap-2"
          >
            <label className="text-sm font-medium">Upload Company Logo</label>
            <input
              id="logo"
              type="file"
              accept="image/*"
              className="border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white py-2 rounded"
            >
              Upload Logo
            </button>
          </form>
        </div>
      ) : (
        <p>Loading company info...</p>
      )}

      <h2 className="text-lg font-bold mt-6 mb-2">Create New Tender</h2>
      <form onSubmit={handleTenderCreate} className="flex flex-col gap-3">
        <input
          placeholder="Title"
          className="border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          className="border p-2 rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          placeholder="Budget"
          type="number"
          className="border p-2 rounded"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          required
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Create Tender
        </button>
      </form>
    </div>
  );
}
