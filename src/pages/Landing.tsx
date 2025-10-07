import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FitnessLogo from "@/components/FitnessLogo";
import { Dumbbell, Users, Calendar, TrendingUp, MessageCircle, Trophy, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import heroDesign from "@/assets/hero-design.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-black/80 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <FitnessLogo />
          <div className="flex gap-4">
            <Button variant="ghost" className="text-white hover:text-[#4169E1] hover:bg-blue-500/10" asChild>
              <Link to="/auth">Log In</Link>
            </Button>
            <Button className="bg-gradient-to-r from-[#4169E1] to-[#5179F1] hover:from-[#3159D1] hover:to-[#4169E1] text-white shadow-lg shadow-blue-500/30" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-[#4169E1] via-[#5179F1] to-[#4169E1] bg-clip-text text-transparent leading-tight">
              An easy way to find friends and get fit
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl">
              Meet "Fitness Friends", the next generation mobile app that makes finding a workout buddy an easy task. Are you ready to make the leap? Sign up to take part in our closed Beta!
            </p>
            <Button size="lg" className="bg-gradient-to-r from-[#4169E1] to-[#5179F1] hover:from-[#3159D1] hover:to-[#4169E1] text-white gap-2 shadow-lg shadow-blue-500/30" asChild>
              <Link to="/auth">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Join Beta
              </Link>
            </Button>
          </div>

          {/* Right Phone Mockup - Auth */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4169E1]/20 to-[#5179F1]/20 rounded-[4rem] blur-3xl" />
            <div className="relative mx-auto max-w-sm">
              <div className="bg-white rounded-[3rem] shadow-2xl border-8 border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-b from-blue-50 to-white p-8 rounded-[2rem]">
                  <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                    <FitnessLogo className="justify-center mb-6" />
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-700">you@example.com</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                        <p className="text-sm text-gray-500">Password</p>
                        <p className="text-gray-700">••••••••</p>
                      </div>
                      <button className="w-full bg-gradient-to-r from-[#4169E1] to-[#5179F1] text-white rounded-xl py-3 font-semibold shadow-lg">
                        Sign In
                      </button>
                      <p className="text-xs text-center text-gray-600">
                        Don't have an account?{" "}
                        <span className="text-[#4169E1] font-semibold">SIGN UP</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="bg-black py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-[#4169E1] to-[#5179F1] bg-clip-text text-transparent">
            Powerful features to supercharge your workout
          </h2>
          <p className="text-center text-white/70 text-lg mb-20 max-w-2xl mx-auto">
            Everything you need to find friends, track progress, and achieve your fitness goals
          </p>

          {/* Feature 1: Workout Schedule */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4169E1]/20 to-[#5179F1]/20 rounded-[4rem] blur-3xl" />
              <div className="relative mx-auto max-w-sm">
                <div className="bg-white rounded-[3rem] shadow-2xl border-8 border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-b from-blue-50 to-white rounded-[2rem] p-4">
                    {/* Schedule Screenshot Mockup */}
                    <div className="bg-white rounded-2xl shadow-inner overflow-hidden">
                      <div className="bg-[#4169E1] px-6 py-4">
                        <h3 className="text-white text-lg font-bold flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Workout Schedule
                        </h3>
                        <p className="text-blue-100 text-sm">Plan and track your fitness journey</p>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">Morning Run</span>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">medium</span>
                          </div>
                          <p className="text-sm text-gray-600">🕐 07:00 (45 min) • Central Park</p>
                          <p className="text-xs text-green-600 mt-1">✓ Completed at 12:21 AM</p>
                        </div>
                        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">Strength Training</span>
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">high</span>
                          </div>
                          <p className="text-sm text-gray-600">🕐 18:00 (60 min) • Fitness Plus Gym</p>
                          <p className="text-xs text-green-600 mt-1">✓ Completed at 10:21 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-blue-500/20">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4169E1] to-[#5179F1] flex items-center justify-center mb-6 shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Smart workout scheduling
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-4">
                  Plan your workouts in advance and track completion in real-time. Set goals, specify locations, and maintain consistency with our intelligent scheduling system.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-white/80">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#4169E1]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    Track workout completion
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#4169E1]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    Set intensity levels and goals
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#4169E1]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    Specify workout locations
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feature 2: Messaging */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-blue-500/20">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4169E1] to-[#5179F1] flex items-center justify-center mb-6 shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Stay connected with friends
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-4">
                  Chat with your fitness buddies, share workout tips, and motivate each other. Our messaging system keeps your fitness community connected and engaged.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-white/80">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#4169E1]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    Real-time messaging
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#4169E1]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    Workout coordination
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#4169E1]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    Ice breaker prompts
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4169E1]/20 to-[#5179F1]/20 rounded-[4rem] blur-3xl" />
              <div className="relative mx-auto max-w-sm">
                <div className="bg-white rounded-[3rem] shadow-2xl border-8 border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-b from-blue-50 to-white rounded-[2rem] p-4">
                    {/* Chat Screenshot Mockup */}
                    <div className="bg-white rounded-2xl shadow-inner overflow-hidden">
                      <div className="bg-[#4169E1] px-6 py-4">
                        <h3 className="text-white text-lg font-bold flex items-center gap-2">
                          <MessageCircle className="w-5 h-5" />
                          Messages
                        </h3>
                        <p className="text-blue-100 text-sm">Stay connected with your fitness friends</p>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4169E1] to-[#5179F1] flex items-center justify-center text-white font-bold">
                            AR
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-gray-900">Alex Runner</span>
                              <span className="text-xs text-gray-500">2 min ago</span>
                            </div>
                            <p className="text-sm text-gray-600">Great workout today! Let's hit the gym tomorrow 💪</p>
                          </div>
                          <div className="w-5 h-5 rounded-full bg-[#4169E1] text-white text-xs flex items-center justify-center font-semibold">
                            2
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                            FS
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-gray-900">Fitness Squad</span>
                              <span className="text-xs text-gray-500">15 min ago</span>
                            </div>
                            <p className="text-sm text-gray-600">Sarah: Who's joining for the morning run?</p>
                          </div>
                          <div className="w-5 h-5 rounded-full bg-[#4169E1] text-white text-xs flex items-center justify-center font-semibold">
                            4
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                            MY
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-gray-900">Maria Yoga</span>
                              <span className="text-xs text-gray-500">1 hour ago</span>
                            </div>
                            <p className="text-sm text-gray-600">The yoga session was amazing! 🧘</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Profile */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4169E1]/20 to-[#5179F1]/20 rounded-[4rem] blur-3xl" />
              <div className="relative mx-auto max-w-sm">
                <div className="bg-white rounded-[3rem] shadow-2xl border-8 border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-b from-blue-50 to-white rounded-[2rem] p-4">
                    {/* Profile Screenshot Mockup */}
                    <div className="bg-white rounded-2xl shadow-inner overflow-hidden">
                      <div className="bg-gradient-to-r from-[#4169E1] to-[#5179F1] px-6 py-8 text-center">
                        <div className="w-20 h-20 rounded-full bg-white mx-auto mb-3 flex items-center justify-center">
                          <span className="text-3xl font-bold text-[#4169E1]">AJ</span>
                        </div>
                        <h3 className="text-white text-xl font-bold">Alex Johnson</h3>
                        <p className="text-blue-100 text-sm">📍 New York, NY</p>
                        <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold mt-2">
                          Intermediate
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <p className="text-sm font-medium text-gray-900">alex.johnson@email.com</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Phone</p>
                          <p className="text-sm font-medium text-gray-900">+1 (555) 123-4567</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Bio</p>
                          <p className="text-sm text-gray-700">Passionate about fitness and helping others achieve their health goals. Love outdoor activities and strength training.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-blue-500/20">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4169E1] to-[#5179F1] flex items-center justify-center mb-6 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Personalized fitness profiles
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-4">
                  Create your fitness identity with comprehensive profiles. Share your fitness level, goals, and connect with like-minded workout enthusiasts.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-white/80">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#4169E1]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    Detailed fitness profiles
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#4169E1]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    Skill level tracking
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#4169E1]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    Connect with similar interests
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Everything You Need to Stay Motivated
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-blue-500/20">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4169E1] to-[#5179F1] flex items-center justify-center mb-4 shadow-lg">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Track Workouts</h3>
              <p className="text-white/70">
                Log your exercises, sets, and reps. Monitor your progress over time with detailed analytics.
              </p>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-blue-500/20">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4169E1] to-[#5179F1] flex items-center justify-center mb-4 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Social Fitness</h3>
              <p className="text-white/70">
                Share workouts with friends, celebrate achievements, and motivate each other.
              </p>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-blue-500/20">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4169E1] to-[#5179F1] flex items-center justify-center mb-4 shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Smart Scheduling</h3>
              <p className="text-white/70">
                Plan your workouts in advance and stay consistent with personalized schedules.
              </p>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-blue-500/20">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4169E1] to-[#5179F1] flex items-center justify-center mb-4 shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Progress Analytics</h3>
              <p className="text-white/70">
                Visualize your fitness journey with comprehensive stats and insights.
              </p>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-blue-500/20">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4169E1] to-[#5179F1] flex items-center justify-center mb-4 shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Stay Connected</h3>
              <p className="text-white/70">
                Chat with your fitness friends and get instant feedback on your workouts.
              </p>
            </Card>

            <Card className="p-6 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-blue-500/20">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4169E1] to-[#5179F1] flex items-center justify-center mb-4 shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Earn Achievements</h3>
              <p className="text-white/70">
                Unlock badges and milestones as you reach your fitness goals.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#4169E1] to-[#5179F1] mb-6 shadow-lg">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4169E1] to-[#5179F1] bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-white/70">
              Got questions? We've got answers about Fitness Friends
            </p>
          </div>
          
          <Card className="bg-white/5 backdrop-blur-sm border-blue-500/20 shadow-xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-blue-500/20">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-white/5 text-left">
                  <span className="text-lg font-semibold text-white">What is Fitness Friends?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-white/70">
                  Fitness Friends is a mobile app designed to help you find workout buddies and stay motivated on your fitness journey. Connect with like-minded individuals, schedule workouts together, and track your progress as a community.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-blue-500/20">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-white/5 text-left">
                  <span className="text-lg font-semibold text-white">How do I find workout partners?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-white/70">
                  Our smart matching system connects you with fitness enthusiasts based on your location, fitness level, workout preferences, and goals. Browse profiles, send messages, and schedule workouts together through the app.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-blue-500/20">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-white/5 text-left">
                  <span className="text-lg font-semibold text-white">Is Fitness Friends free to use?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-white/70">
                  We're currently in closed beta and offering free access to all features. Sign up now to secure your spot and be among the first to experience the full Fitness Friends platform!
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-blue-500/20">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-white/5 text-left">
                  <span className="text-lg font-semibold text-white">Can I track my workouts in the app?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-white/70">
                  Absolutely! Fitness Friends includes comprehensive workout tracking features. Log your exercises, monitor progress, set goals, and view detailed analytics about your fitness journey. You can also share your achievements with friends.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border-blue-500/20">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-white/5 text-left">
                  <span className="text-lg font-semibold text-white">How does the messaging system work?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-white/70">
                  Connect with your fitness friends through our built-in messaging system. Chat in real-time, coordinate workout schedules, share tips and motivation, and build a supportive community. We also provide ice breaker prompts to help start conversations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border-blue-500/20">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-white/5 text-left">
                  <span className="text-lg font-semibold text-white">Is my data secure and private?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-white/70">
                  Your privacy and security are our top priorities. We use industry-standard encryption to protect your data, and you have full control over what information you share with others. Your workout data and messages are private and secure.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border-blue-500/20">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-white/5 text-left">
                  <span className="text-lg font-semibold text-white">What platforms is Fitness Friends available on?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-white/70">
                  Fitness Friends is available as a web app and will soon be available on iOS and Android. You can access your account from any device and your data syncs seamlessly across all platforms.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border-b-0">
                <AccordionTrigger className="px-6 hover:no-underline hover:bg-white/5 text-left">
                  <span className="text-lg font-semibold text-white">How do I join the beta program?</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-white/70">
                  Simply click the "Join Beta" or "Get Started" button and create your account. You'll get immediate access to all features and be part of shaping the future of Fitness Friends with your feedback.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          <div className="text-center mt-8">
            <p className="text-white/70 mb-4">Still have questions?</p>
            <Button variant="outline" className="border-[#4169E1] text-[#4169E1] hover:bg-blue-500/10" asChild>
              <Link to="/faq">View Full FAQ</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Transform Your Fitness?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of people achieving their goals together
            </p>
            <Button size="lg" className="bg-white text-[#4169E1] hover:bg-blue-50 shadow-lg" asChild>
              <Link to="/auth">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 py-8 bg-black">
        <div className="container mx-auto px-4 text-center text-white/60">
          <p>&copy; 2025 Fitness Friends. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
