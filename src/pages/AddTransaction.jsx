import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AddTransaction() {
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const user = (await supabase.auth.getUser()).data.user;

    const { error } = await supabase.from("transactions").insert([
      {
        user_id: user.id,
        type,
        amount: Number(amount),
        category,
        date,
      },
      
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Transaction Added ✅");
      navigate("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#111827]/80 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add Transaction
        </h2>

        {/* Type */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-[#1f2937] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-[#1f2937] placeholder-gray-400 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Category */}
        <input
          type="text"
          placeholder="Category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-[#1f2937] placeholder-gray-400 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Date */}
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-[#1f2937] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition"
        >
          {loading ? "Adding..." : "Add Transaction"}
        </motion.button>

      </motion.form>
    </div>
  );
}

export default AddTransaction;