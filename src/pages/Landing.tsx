import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FitnessLogo from "@/components/FitnessLogo";
import { Dumbbell, Users, Calendar, TrendingUp, MessageCircle, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <FitnessLogo />
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link to="/auth">Log In</Link>
            </Button>
            <Button variant="fitness" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Your Fitness Journey,
          <br />
          Together
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with friends, track workouts, and achieve your fitness goals as a community
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" variant="fitness" asChild>
            <Link to="/auth">Start Free Today</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/auth">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
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
      <section className="container mx-auto px-4 py-20">
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
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Fitness Friends. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
