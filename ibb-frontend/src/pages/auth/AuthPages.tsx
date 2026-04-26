import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Database, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../store'

const mockUsers = [
  { email: 'admin@ibb.in', password: 'admin123', role: 'admin', name: 'Kavya Nair' },
  { email: 'researcher@ibb.in', password: 'research123', role: 'researcher', name: 'Dr. Priya Sharma' },
  { email: 'user@ibb.in', password: 'user123', role: 'user', name: 'Rohit Mehta' },
]

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const match = mockUsers.find(u => u.email === email && u.password === password)
    if (match) {
      setAuth({
        id: Math.random().toString(),
        name: match.name,
        email: match.email,
        role: match.role as 'admin' | 'researcher' | 'user',
        createdAt: new Date().toISOString(),
      }, 'mock-jwt-token')
      navigate('/dashboard')
    } else {
      setError('Invalid credentials. Try: admin@ibb.in / admin123')
    }
    setLoading(false)
  }

  const quickLogin = (type: string) => {
    const u = mockUsers.find(u => u.role === type)!
    setEmail(u.email)
    setPassword(u.password)
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet/[0.05] rounded-full blur-3xl" />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center">
            <Database size={18} className="text-void" />
          </div>
          <div>
            <div className="font-mono text-sm text-cyan font-semibold">INTERNET BLACK BOX</div>
            <div className="text-[10px] font-mono text-dim">RESEARCH PLATFORM</div>
          </div>
        </div>

        <div className="card cyber-border">
          <h2 className="text-xl font-display font-bold text-signal mb-1">Sign in to your account</h2>
          <p className="text-sm text-dim mb-6">Access the behavioral intelligence platform</p>

          {/* Quick login */}
          <div className="flex gap-2 mb-5">
            {['admin', 'researcher', 'user'].map(role => (
              <button
                key={role}
                onClick={() => quickLogin(role)}
                className="flex-1 py-1.5 text-[11px] border border-border rounded-lg text-dim hover:text-bright hover:border-ghost capitalize transition-all"
              >
                {role}
              </button>
            ))}
          </div>
          <div className="text-[10px] text-dim mb-4 font-mono text-center">— quick demo login —</div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-dim mb-1.5">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@institution.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-dim mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dim hover:text-bright"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-rose-bright bg-rose/10 border border-rose/30 rounded-lg px-3 py-2.5 font-mono">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-dim mt-5">
            No account?{' '}
            <Link to="/register" className="text-cyan hover:underline">Request access</Link>
          </p>
        </div>

        <p className="text-center text-xs text-ghost mt-4 font-mono">
          TMV University · BCA Final Year Project 2025–26
        </p>
      </motion.div>
    </div>
  )
}

export const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', role: 'user', institution: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 py-10">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet/[0.05] rounded-full blur-3xl" />
      </div>
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center">
            <Database size={18} className="text-void" />
          </div>
          <div className="font-mono text-sm text-cyan font-semibold">INTERNET BLACK BOX</div>
        </div>

        <div className="card cyber-border">
          <h2 className="text-xl font-display font-bold text-signal mb-1">Request Access</h2>
          <p className="text-sm text-dim mb-6">For researchers, journalists, and institutions</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-dim mb-1.5">Full Name</label>
              <input className="input" placeholder="Dr. Priya Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs text-dim mb-1.5">Institutional Email</label>
              <input type="email" className="input" placeholder="you@university.edu" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs text-dim mb-1.5">Institution / Organization</label>
              <input className="input" placeholder="IIT Bombay, Times of India, etc." value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-dim mb-1.5">Role</label>
              <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="user">General User</option>
                <option value="researcher">Researcher</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-dim mb-1.5">Password</label>
              <input type="password" className="input" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>

            <div className="bg-amber/10 border border-amber/30 rounded-lg p-3 text-xs text-amber-bright">
              Researcher accounts are manually approved within 24 hours. You'll receive an email confirmation.
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Submit Request <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-dim mt-5">
            Already have access? <Link to="/login" className="text-cyan hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
