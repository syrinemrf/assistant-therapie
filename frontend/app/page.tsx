"use client";

import Link from "next/link";
import { Brain, Shield, Zap, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Serenity AI
            </span>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/login"
              className="px-6 py-2.5 text-gray-700 font-medium hover:text-gray-900 transition"
            >
              Sign In
            </Link>
            <Link 
              href="/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-violet-200 shadow-sm">
            <Zap className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-900">
              Powered by Advanced AI Technology
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold leading-tight text-gray-300">
            Your Personal
            <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Therapist
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience compassionate mental health support powered by AI. 
            Available 24/7, completely private, and always here to listen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              href="/signup"
              className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Free Session
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link 
              href="/login"
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold hover:shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 max-w-6xl mx-auto">
          {[
            { 
              icon: Heart, 
              title: "24/7 Support", 
              desc: "Always available when you need someone to talk to",
              gradient: "from-rose-500 to-pink-500"
            },
            { 
              icon: Brain, 
              title: "Smart Insights", 
              desc: "Personalized guidance based on your unique needs",
              gradient: "from-violet-500 to-purple-500"
            },
            { 
              icon: Shield, 
              title: "Private & Secure", 
              desc: "Your conversations are encrypted and confidential",
              gradient: "from-blue-500 to-cyan-500"
            },
            { 
              icon: Zap, 
              title: "Evidence-Based", 
              desc: "Backed by clinical research and best practices",
              gradient: "from-amber-500 to-orange-500"
            }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-violet-200">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <Brain className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-bold mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-lg text-violet-100 mb-8 max-w-2xl mx-auto">
            Join thousands who have found support, healing, and growth with Aura AI
          </p>
          <Link 
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-600 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
          >
            Get Started for Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}