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

          {/* Right Design Image */}
          <div className="relative">
            <div className="relative mx-auto max-w-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4169E1]/20 to-purple-600/20 rounded-3xl blur-3xl" />
              <img
                src={heroDesign}
                alt="Fitness App Design"
                className="relative rounded-3xl shadow-2xl w-full"
              />
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
