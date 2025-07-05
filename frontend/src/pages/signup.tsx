import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    industry: "",
    description: "",
  });

  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/companies/signup",
        form
      );
      login(res.data.token); // Set token in context + localStorage
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Company Sign Up</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          name="name"
          placeholder="Company Name"
          className="border p-2 rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="industry"
          placeholder="Industry"
          className="border p-2 rounded"
          value={form.industry}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Short Description"
          className="border p-2 rounded"
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Create Company Account
        </button>
      </form>
    </div>
  );
}
