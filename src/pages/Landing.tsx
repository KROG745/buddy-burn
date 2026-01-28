import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FitnessLogo from "@/components/FitnessLogo";
import { Users, MapPin, Calendar, Dumbbell, MessageCircle, Activity, Rocket } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import appIcon from "@/assets/app-icon.png";
import heroPhone from "@/assets/hero-phone.png";
import featureFriendMatching from "@/assets/feature-friend-matching.png";
import featureGymMap from "@/assets/feature-gym-map.png";
import featureSchedule from "@/assets/feature-schedule.png";
import featureWorkouts from "@/assets/feature-workouts.png";
import featureMessaging from "@/assets/feature-messaging.png";
import featureActivity from "@/assets/feature-activity.png";

const VISITED_KEY = "fitness_friends_visited";

const Landing = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      // Check if user is already logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is logged in, go to dashboard
        navigate("/dashboard", { replace: true });
        return;
      }

      // Check if user has visited before
      const hasVisited = localStorage.getItem(VISITED_KEY);
      
      if (hasVisited) {
        // Returning visitor, go to auth page
        navigate("/auth", { replace: true });
        return;
      }

      // First-time visitor, mark as visited and show landing page
      localStorage.setItem(VISITED_KEY, "true");
      setIsChecking(false);
    };

    checkUserStatus();
  }, [navigate]);

  // Show nothing while checking status
  if (isChecking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <FitnessLogo textColor="text-white" />
          <div className="flex gap-2 md:gap-4 items-center">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10" asChild>
              <a href="#faq">FAQ</a>
            </Button>
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10" asChild>
              <Link to="/support">Support</Link>
            </Button>
            <Button className="bg-[#4169E1] hover:bg-[#3159D1] text-white gap-2" asChild>
              <Link to="/auth">
                <Rocket className="w-4 h-4" />
                Join Beta
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left space-y-8">
              <img src={appIcon} alt="Fitness Friends App Icon" className="w-24 h-24 rounded-3xl shadow-2xl" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                A easy way to find friends and get fit, it's that simple.
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-xl">
                Meet "Fitness Friends", the next generation mobile app that makes finding a workout buddy an easy task. Are you ready to make the leap? Signup to take part in our closed Beta!
              </p>
              <Button size="lg" className="bg-[#4169E1] hover:bg-[#3159D1] text-white gap-2 shadow-lg" asChild>
                <Link to="/auth">
                  <Rocket className="w-5 h-5" />
                  Join Beta
                </Link>
              </Button>
            </div>

            {/* Right Phone Mockup */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#4169E1]/20 rounded-[4rem] blur-3xl" />
              <div className="relative mx-auto max-w-sm">
                <img src={heroPhone} alt="Fitness Friends App Preview" className="w-full drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <p className="text-sm uppercase tracking-wider text-[#4169E1] font-semibold mb-2">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful features to supercharge your workout
            </h2>
            <p className="text-xl text-gray-600 mb-16">
              And many more amazing features!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Friend Matching */}
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Friend Matching</h3>
                <p className="text-gray-600">
                  Get the best fitness friend matches based on your search criteria and requirements.
                </p>
              </CardContent>
            </Card>

            {/* Gym Map */}
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Gym Map</h3>
                <p className="text-gray-600">
                  View your gym and other gyms in your area.
                </p>
              </CardContent>
            </Card>

            {/* Fitness Schedule */}
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fitness Schedule</h3>
                <p className="text-gray-600">
                  Build your fitness schedule to receive smart notifications and find the best matches.
                </p>
              </CardContent>
            </Card>

            {/* Customizable Workouts */}
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Dumbbell className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Customizable Workouts</h3>
                <p className="text-gray-600">
                  Build your workouts one exercise at a time and save them to your fitness schedule.
                </p>
              </CardContent>
            </Card>

            {/* In-App Messaging */}
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">In-App Messaging</h3>
                <p className="text-gray-600">
                  Connect with your fitness friends or message someone new without having to give out your number.
                </p>
              </CardContent>
            </Card>

            {/* Activity History */}
            <Card className="text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Activity className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Activity History</h3>
                <p className="text-gray-600">
                  Keep track of your workout progress with our activity log to see how far you've come.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-16">
            <Button size="lg" className="bg-[#4169E1] hover:bg-[#3159D1] text-white gap-2" asChild>
              <Link to="/auth">Join The Beta Test</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Showcases */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          {/* Friend Matching */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-32">
            <div className="order-2 lg:order-1">
              <img 
                src={featureFriendMatching} 
                alt="Friend Matching Feature" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Friend Matching</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our intelligent matching algorithm connects you with workout partners who share your fitness goals, 
                schedule, and preferred gym locations. Get personalized match recommendations based on your workout 
                preferences, experience level, and availability.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Smart matching based on fitness goals and schedules</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>View detailed profiles and compatibility scores</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Connect instantly with potential workout buddies</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Gym Map */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-32">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Gym Map</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Discover gyms and fitness centers near you with our interactive map feature. See which facilities 
                your matches prefer, check gym amenities, and find the perfect location to meet up for your workouts.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Interactive map of gyms in your area</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Filter by amenities and equipment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>See where your friends work out</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src={featureGymMap} 
                alt="Gym Map Feature" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>

          {/* Fitness Schedule */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-32">
            <div className="order-2 lg:order-1">
              <img 
                src={featureSchedule} 
                alt="Fitness Schedule Feature" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Fitness Schedule</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Plan your workouts in advance with our intuitive scheduling system. Set recurring sessions, get 
                reminders, and coordinate workout times with your fitness friends to maintain consistency.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Weekly calendar view of all your workouts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Smart notifications and reminders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Coordinate schedules with workout partners</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Customizable Workouts */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-32">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Customizable Workouts</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Create personalized workout routines tailored to your fitness goals. Choose from a comprehensive 
                exercise library, set your reps and sets, and save your favorite workouts for easy access.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Build custom workout routines from scratch</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Extensive exercise library with instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Save and reuse your favorite workouts</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src={featureWorkouts} 
                alt="Customizable Workouts Feature" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>

          {/* In-App Messaging */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-32">
            <div className="order-2 lg:order-1">
              <img 
                src={featureMessaging} 
                alt="In-App Messaging Feature" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">In-App Messaging</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Stay connected with your workout community through our secure messaging system. Chat with your 
                fitness friends, coordinate meetups, and share progress without leaving the app.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Private messaging with your connections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Share workout plans and achievements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Keep your personal contact info private</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Activity History */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Activity History</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Track your fitness journey with detailed activity logs. Monitor your progress over time, celebrate 
                milestones, and stay motivated by seeing how far you've come.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Complete workout history and statistics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Visual progress charts and analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4169E1] mt-1">✓</span>
                  <span>Track consistency and achieve goals</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src={featureActivity} 
                alt="Activity History Feature" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-4">
            <p className="text-sm uppercase tracking-wider text-[#4169E1] font-semibold mb-2">FAQS</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Have questions? We've answers. If you can't find what we are looking for, feel free to get in touch.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-lg border border-gray-200 px-6">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                What is Fitness Friends?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Fitness Friends is a mobile app designed to help you find workout partners who share your fitness goals, 
                schedule, and gym preferences. We make it easy to connect with like-minded fitness enthusiasts in your area.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-lg border border-gray-200 px-6">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                How does the matching system work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Our smart matching algorithm considers your fitness goals, workout schedule, preferred gym locations, 
                experience level, and workout preferences to connect you with compatible workout partners. You'll receive 
                personalized match recommendations based on these factors.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-lg border border-gray-200 px-6">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                Is the app free to use?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                During the beta testing phase, Fitness Friends is completely free to use. We want to gather feedback 
                and improve the app based on real user experiences. Future pricing will be announced before the official launch.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-lg border border-gray-200 px-6">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                When will the mobile apps be available?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                We're currently in development for both iOS and Android versions. Beta testers will get early access 
                to the mobile apps before the official launch. Join our beta program to be among the first to try it out!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white rounded-lg border border-gray-200 px-6">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                How do I join the beta test?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Simply click the "Join Beta" button on this page to create your account. You'll get immediate access 
                to the web version and will be notified when the mobile apps are ready for beta testing.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-white rounded-lg border border-gray-200 px-6">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                Is my personal information safe?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes! We take privacy and security seriously. Your personal information is encrypted and secure. 
                You have full control over what information you share with other users, and you never need to give 
                out your phone number or personal contact information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-white rounded-lg border border-gray-200 px-6">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                Can I request new features?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Absolutely! We welcome feature requests from our beta users. Your feedback is invaluable in helping 
                us build the best possible fitness app. You can submit feature requests through the app or contact us directly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="bg-white rounded-lg border border-gray-200 px-6">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                What if I can't find a workout buddy in my area?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                As our community grows, you'll have more potential matches. In the meantime, you can still use the app 
                to plan your workouts, track your progress, and build custom workout routines. We're constantly working 
                to expand our user base in all areas.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Platform Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Version 1.0 Is In Development!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're working hard to produce this app and you can help us. Join our beta test and help us create a better way to work out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Android */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Android</h3>
              <p className="text-gray-600 mb-6">
                Connect with your fitness friends no matter what platform you prefer.
              </p>
              <Button variant="outline" className="mb-8" disabled>
                Coming Soon To Android
              </Button>
              <div className="bg-gray-100 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-6xl">📱</div>
              </div>
            </div>

            {/* iOS & iPadOS */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">iOS & iPadOS</h3>
              <p className="text-gray-600 mb-6">
                Connect with your fitness friends no matter what platform you prefer.
              </p>
              <Button variant="outline" className="mb-8" disabled>
                Coming Soon To iOS
              </Button>
              <div className="bg-gray-100 rounded-2xl p-8 flex items-center justify-center">
                <div className="text-6xl">📱</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <FitnessLogo className="justify-center mb-6" textColor="text-white" />
          <p className="text-gray-400 mb-6">
            The next generation mobile app that makes finding a workout buddy an easy task.
          </p>
          <div className="flex justify-center gap-6 mb-6 text-sm">
            <Link to="/support" className="text-gray-400 hover:text-white transition-colors">
              Support
            </Link>
            <a href="#faq" className="text-gray-400 hover:text-white transition-colors">
              FAQ
            </a>
            <a href="mailto:support@fitnessfriends.app" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
          </div>
          <Button size="lg" className="bg-[#4169E1] hover:bg-[#3159D1] text-white gap-2" asChild>
            <Link to="/auth">
              <Rocket className="w-5 h-5" />
              Join Beta
            </Link>
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
