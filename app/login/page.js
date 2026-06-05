'use client' 
 import { useState } from 'react' 
 import { useRouter } from 'next/navigation' 
 import Link from 'next/link' 
 
 export default function LoginPage() { 
   const router = useRouter() 
   const [email, setEmail] = useState('') 
   const [password, setPassword] = useState('') 
   const [loading, setLoading] = useState(false) 
   const [error, setError] = useState('') 
 
   const handleLogin = async (e) => { 
     e.preventDefault() 
     setLoading(true) 
     setError('') 
     
     try { 
       const response = await fetch('/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, password })
       })

       const data = await response.json()

       if (!response.ok) {
         throw new Error(data.error || 'Login failed')
       }

       if (typeof window !== 'undefined') { 
         localStorage.setItem('adgenius_user', JSON.stringify({ 
           id: data.user.id,
           email: data.user.email, 
           name: data.user.user_metadata?.name || email.split('@')[0], 
           plan: data.user.user_metadata?.plan || 'free', 
           credits: data.user.user_metadata?.credits || 10 
         })) 
         router.push('/dashboard') 
       } 
     } catch (err) { 
       setError(err.message || 'Something went wrong. Please try again.') 
     } finally { 
       setLoading(false) 
     } 
   } 
 
   return ( 
     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4"> 
       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"> 
         <div className="text-center mb-8"> 
           <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1> 
           <p className="text-gray-500 mt-2">Sign in to your account</p> 
         </div> 
         
         {error && ( 
           <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm"> 
             {error} 
           </div> 
         )} 
         
         <form onSubmit={handleLogin} className="space-y-4"> 
           <div> 
             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label> 
             <input 
               type="email" 
               value={email} 
               onChange={(e) => setEmail(e.target.value)} 
               required 
               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
               placeholder="you@example.com" 
             /> 
           </div> 
           <div> 
             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label> 
             <input 
               type="password" 
               value={password} 
               onChange={(e) => setPassword(e.target.value)} 
               required 
               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
               placeholder="••••••••" 
             /> 
           </div> 
           <button 
             type="submit" 
             disabled={loading} 
             className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50" 
           > 
             {loading ? 'Signing in...' : 'Sign In'} 
           </button> 
         </form> 
         
         <div className="mt-8 text-center text-sm text-slate-500"> 
           Don&apos;t have an account?{' '}
           <Link href="/signup" prefetch={false} className="text-indigo-600 font-medium hover:underline"> 
             Sign up for free 
           </Link> 
         </div> 
       </div> 
     </div> 
   ) 
 } 
