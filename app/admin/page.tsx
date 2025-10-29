"use client";

import React, { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useToast } from "@/components/toast-provider"; // Assuming toast provider is set up
import { Loader2, Eye } from "lucide-react";

// Define the structure of an Order based on your Supabase table
interface Order {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  nfc_link: string;
  design: string;
  payment_proof_url: string | null;
  status: string;
  price: number;
  created_at: string;
}

// Define possible order statuses
const ORDER_STATUSES = [
  { value: "pending_payment_verification", label: "Pending Payment Verification" },
  { value: "preparing_product", label: "Preparing Product" },
  { value: "ready_for_pickup", label: "Ready for Pickup" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const getStatusClasses = (status: string): string => {
  switch (status) {
    case 'completed':
      // Green background, white text
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      // Red background, white text
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending_payment_verification':
      // Yellow background, dark text
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'preparing_product':
      // Blue background, white text
      return 'bg-blue-100 text-blue-800 border-blue-200';
     case 'ready_for_pickup':
      // Indigo background, white text
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    default:
      // Default gray background, dark text
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function AdminPage() {
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- VERY INSECURE - Use Supabase Auth for production ---
  const correctEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  // --- END INSECURE ---

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- Login Handler ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError(null);

    // --- Basic INSECURE Check ---
    if (email === correctEmail && password === correctPassword) {
      setTimeout(() => { // Simulate network delay
        setIsAuthenticated(true);
        setLoginLoading(false);
      }, 500);
    } else {
      setTimeout(() => {
        setError("Invalid email or password.");
        setLoginLoading(false);
      }, 500);
    }
  };

  // --- Fetch Orders ---
  const fetchOrders = async () => {
    setLoadingOrders(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*") // Select all columns
        .order("created_at", { ascending: false }); // Show newest first

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders. Please refresh.");
      addToast("Failed to fetch orders.", "error");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch orders when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  // --- Update Order Status ---
  const handleStatusChange = async (orderId: string, newStatus: string) => {
  const originalOrders = [...orders];
  setOrders(prevOrders =>
    prevOrders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    )
  );

  try {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus }) // REMOVED manual updated_at - rely on DB trigger
      .eq("id", orderId);

    if (error) {
       console.error("Supabase update error:", error); // Log the specific error
       throw error; // Re-throw to trigger catch block
    }

    const statusLabel = ORDER_STATUSES.find(s => s.value === newStatus)?.label || newStatus;
    addToast(`Order ${orderId.substring(0, 6)}... status updated to ${statusLabel}.`, "success");

  } catch (err: any) {
    console.error("Error updating status:", err);
    addToast(`Failed to update status: ${err.message || 'Unknown error'}. Check RLS policies.`, "error"); // More specific error
    setOrders(originalOrders); // Revert UI on error
  }
};

  // --- Render Login Form ---
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md font-semibold hover:shadow-lg transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loginLoading ? <Loader2 size={20} className="animate-spin" /> : "Login"}
            </button>
          </form>
          <p className="mt-4 text-xs text-center text-red-600 font-semibold">
            WARNING: This login method is insecure and for development only. Use Supabase Auth for production.
          </p>
        </div>
      </div>
    );
  }

  // --- Render Admin Dashboard ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tappit Orders</h1>
          <button
            onClick={fetchOrders}
            disabled={loadingOrders}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition text-sm disabled:opacity-50"
          >
            {loadingOrders ? <Loader2 size={16} className="animate-spin inline mr-1" /> : "Refresh Orders"}
          </button>
        </div>

        {error && <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

        {loadingOrders ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 size={32} className="animate-spin text-cyan-600" />
            <span className="ml-2 text-gray-600">Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Design</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NFC Link</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Proof</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  {/* Add more columns if needed */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {new Date(order.created_at).toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{order.full_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      <div>{order.email}</div>
                      <div>{order.phone}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{order.design}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                      <a
                        // Prepend "https://" if the link doesn't already start with http:// or https://
                        href={
                            order.nfc_link && (order.nfc_link.startsWith('http://') || order.nfc_link.startsWith('https://'))
                            ? order.nfc_link
                            : `https://${order.nfc_link}`
                        }
                        target="_blank" // Keep opening in a new tab
                        rel="noopener noreferrer" // Good security practice for external links
                        className="text-cyan-600 hover:underline"
                        title={order.nfc_link} // Keep the tooltip showing the raw link
                        >
                        {order.nfc_link} {/* Display the raw link text */}
                        </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      {order.payment_proof_url ? (
                        <a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-800 inline-block p-1 rounded hover:bg-cyan-100">
                           <Eye size={18} />
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                   <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        // Apply background/border from helper, ensure text is dark, add padding/font weight
                        className={`
                            block w-full rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm
                            border font-medium px-2.5 py-1.5 // Added padding/font weight
                            text-gray-900 // Ensure option text is dark
                            appearance-none // Removes default browser dropdown arrow for better custom styling if needed later
                            cursor-pointer
                            ${getStatusClasses(order.status)} // Apply dynamic background/border/text
                        `}
                        >
                        {/* Keep options rendering the same */}
                        {ORDER_STATUSES.map(statusOption => (
                            <option
                            key={statusOption.value}
                            value={statusOption.value}
                            // Optional: Add explicit black text color to options if needed
                            // className="text-black"
                            >
                            {statusOption.label}
                            </option>
                        ))}
                        </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}