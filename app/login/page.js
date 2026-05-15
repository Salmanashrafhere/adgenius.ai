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
       if (typeof window !== 'undefined') { 
         localStorage.setItem('adgenius_user', JSON.stringify({ 
           email, 
           name: email.split('@')[0], 
           plan: 'free', 
           credits: 10 
         })) 
         router.push('/dashboard') 
       } 
     } catch (err) { 
       setError('Something went wrong. Please try again.') 
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
         
         <p className="text-center text-gray-500 text-sm mt-6"> 
           Don't have an account?{' '} 
           <Link href="/signup" className="text-indigo-600 font-medium hover:underline"> 
             Sign up 
           </Link> 
         </p> 
       </div> 
     </div> 
   ) 
 } 
