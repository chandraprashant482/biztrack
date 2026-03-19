import React, { useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Login = () => {

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate();

    const handellogin = async (e) => {
        e.preventDefault();
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        setLoading(false)

        if (error) {
            alert(error.message);
        } else {
            navigate("/dashboard");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">

            <motion.form
                onSubmit={handellogin}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[#111827]/80 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white"
            >
                <h2 className="text-3xl font-bold text-center mb-6">
                    Welcome Back
                </h2>

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className="w-full p-3 mb-4 rounded-lg bg-[#1f2937] placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                {/* Password */}
                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        className="w-full p-3 rounded-lg bg-[#1f2937] placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 cursor-pointer text-sm text-gray-400 hover:text-white"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </div>

                {/* Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg font-semibold shadow-lg hover:opacity-90 transition"
                >
                    {loading ? "Logging in..." : "Login"}
                </motion.button>

                {/* Footer */}
                <p className="text-center mt-4 text-sm text-gray-400">
                    Don’t have an account?{" "}
                    <Link 
                        to="/signup" 
                        className="text-purple-400 hover:underline"
                    >
                        Signup
                    </Link>
                </p>
            </motion.form>
        </div>
    )
}

export default Login