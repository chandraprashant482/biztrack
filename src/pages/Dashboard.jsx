import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase';
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  // FETCH
  const fetchTransactions = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (!error) setTransactions(data);

    setLoading(false);
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (!error) fetchTransactions();
  };

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // CALCULATIONS
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  // BAR CHART DATA
  const chartData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  // PIE CHART DATA
  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  // LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/add")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 rounded-lg font-semibold hover:scale-105 transition"
          >
            + Add
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700">
          <h2 className="text-gray-400">Total Income</h2>
          <p className="text-green-400 text-2xl font-bold">₹ {income}</p>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700">
          <h2 className="text-gray-400">Total Expense</h2>
          <p className="text-red-400 text-2xl font-bold">₹ {expense}</p>
        </div>

        <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700">
          <h2 className="text-gray-400">Balance</h2>
          <p className="text-blue-400 text-2xl font-bold">₹ {balance}</p>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-[#1f2937] p-5 rounded-xl border border-gray-700 mb-10">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-center">

            <thead className="bg-[#111827]">
              <tr>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-gray-400">
                    No transactions yet 🚀
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="border-t border-gray-700 hover:bg-[#111827]">
                    <td className={t.type === "income" ? "text-green-400" : "text-red-400"}>
                      {t.type}
                    </td>
                    <td>₹ {t.amount}</td>
                    <td>{t.category}</td>
                    <td>{t.date}</td>

                    <td>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* BAR CHART */}
        <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Income vs Expense</h2>

          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="value" fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Distribution</h2>

          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;