import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { token, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
      <div>
        <Link href="/" className="font-bold text-lg">
          TenderHub
        </Link>
      </div>
      <div className="space-x-4">
        <Link href="/">Home</Link>
        {token ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="text-red-400 underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
