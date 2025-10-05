import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FitnessLogo from "@/components/FitnessLogo";
import { Dumbbell, Users, Calendar, TrendingUp, MessageCircle, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import heroDesign from "@/assets/hero-design.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Navigation */}
      <nav className="bg-[#1a1a1a] border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <FitnessLogo />
          <div className="flex gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
              <Link to="/auth">Log In</Link>
            </Button>
            <Button className="bg-[#4169E1] hover:bg-[#4169E1]/90 text-white" asChild>
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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              A easy way to find friends and get fit, it's that simple.
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-xl">
              Meet "Fitness Friends", the next generation mobile app that makes finding a workout buddy an easy task. Are you ready to make the leap? Signup to take part in our closed Beta!
            </p>
            <Button size="lg" className="bg-[#4169E1] hover:bg-[#4169E1]/90 text-white gap-2" asChild>
              <Link to="/auth">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Join Beta
              </Link>
            </Button>
          </div>

          {/* Right Phone Mockup */}
          <div className="relative lg:block hidden">
            <div className="relative mx-auto" style={{ width: '300px', height: '600px' }}>
              {/* Phone frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl border-8 border-gray-800">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-3xl"></div>
                
                {/* Screen content */}
                <div className="absolute inset-2 bg-gradient-to-b from-gray-700 to-gray-900 rounded-[2.5rem] overflow-hidden">
                  <div className="p-8 flex flex-col items-center justify-center h-full relative">
                    {/* Background image */}
                    <img 
                      src={heroDesign}
                      alt="App background"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 text-center space-y-4">
                      <FitnessLogo className="justify-center mb-8" />
                      <div className="space-y-3 w-full max-w-[200px]">
                        <input 
                          type="text" 
                          placeholder="Email" 
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm placeholder:text-gray-400"
                          disabled
                        />
                        <input 
                          type="password" 
                          placeholder="Password" 
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm placeholder:text-gray-400"
                          disabled
                        />
                        <button className="w-full bg-[#4169E1] text-white rounded-lg py-2 text-sm">
                          Sign In
                        </button>
                        <p className="text-xs text-gray-400">
                          Don't have an account?{" "}
                          <span className="text-[#4169E1]">SIGN UP</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="bg-[#1a1a1a] py-32">
        <div className="container mx-auto px-4">
          {/* Feature 1: Friend Network */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4169E1]/30 to-purple-600/30 rounded-[4rem] blur-3xl" />
              <div className="relative mx-auto max-w-sm">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl border-8 border-gray-800 p-8">
                  <div className="bg-[#1a1a1a] rounded-[2rem] p-6 space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-white text-xl font-bold">Friend Search</h3>
                      <div className="w-8 h-8 rounded-full bg-[#4169E1]/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-[#4169E1]" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Workout Type</p>
                        <p className="text-white">Cardio</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Location</p>
                        <p className="text-white">Within 5 miles</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-sm text-gray-400 mb-1">Time</p>
                        <p className="text-white">Morning sessions</p>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-[#4169E1] to-purple-600 text-white rounded-xl py-3 font-semibold mt-4">
                      Find Friends
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-3xl p-12 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4169E1] to-purple-600 flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Fitness Friend network and filter
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our user profiles are built by workout fanatics so you can find the perfect person to get your sweat on. 
                  Filter by proximity, gym, work out style, fitness goals, and even availability.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 2: Progress Tracking */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white rounded-3xl p-12 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Track every milestone
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Visualize your fitness journey with comprehensive analytics. Track workouts, monitor progress, 
                  and celebrate achievements with your fitness community.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-teal-600/30 rounded-[4rem] blur-3xl" />
              <div className="relative mx-auto max-w-sm">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl border-8 border-gray-800 p-8">
                  <div className="bg-[#1a1a1a] rounded-[2rem] p-6 space-y-4">
                    <h3 className="text-white text-xl font-bold mb-6">This Week</h3>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-xl p-4 border border-emerald-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Workouts</span>
                          <span className="text-emerald-400 font-bold text-2xl">12</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-[#4169E1]/20 to-purple-600/20 rounded-xl p-4 border border-[#4169E1]/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Friends Active</span>
                          <span className="text-[#4169E1] font-bold text-2xl">8</span>
                        </div>
                        <div className="flex -space-x-2 mt-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4169E1] to-purple-600 border-2 border-gray-800"></div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Streak</span>
                          <span className="text-white font-bold text-2xl">🔥 5 days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20 bg-background">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Everything You Need to Stay Motivated
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-elevation transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
              <Dumbbell className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Workouts</h3>
            <p className="text-muted-foreground">
              Log your exercises, sets, and reps. Monitor your progress over time with detailed analytics.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-elevation transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Social Fitness</h3>
            <p className="text-muted-foreground">
              Share workouts with friends, celebrate achievements, and motivate each other.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-elevation transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
            <p className="text-muted-foreground">
              Plan your workouts in advance and stay consistent with personalized schedules.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-elevation transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Analytics</h3>
            <p className="text-muted-foreground">
              Visualize your fitness journey with comprehensive stats and insights.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-elevation transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Stay Connected</h3>
            <p className="text-muted-foreground">
              Chat with your fitness friends and get instant feedback on your workouts.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-elevation transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Earn Achievements</h3>
            <p className="text-muted-foreground">
              Unlock badges and milestones as you reach your fitness goals.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-background">
        <Card className="p-12 text-center bg-gradient-primary text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of people achieving their goals together
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth">Get Started Free</Link>
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 Fitness Friends. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
