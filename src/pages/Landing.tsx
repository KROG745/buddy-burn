import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FitnessLogo from "@/components/FitnessLogo";
import { Users, MapPin, Calendar, Dumbbell, MessageCircle, Activity, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import appIcon from "@/assets/app-icon.png";
import heroPhone from "@/assets/hero-phone.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <FitnessLogo textColor="text-white" />
          <div className="flex gap-4 items-center">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10" asChild>
              <a href="#faq">FAQ</a>
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
                Can I request a new feature for Apps?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Yes! We welcome feature requests from our beta users. Your feedback helps us build a better app. You can submit feature requests through the app or contact us directly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-lg border border-gray-200 px-6">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                Can I download Apps data into Excel or CSV?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Data export functionality is planned for a future release. We understand the importance of data portability and will include this feature as we develop the app.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-lg border border-gray-200 px-6">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                Does Apps team offer 1-on-1 support?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                During the beta phase, we provide support through our community channels and email. As we grow, we'll introduce more personalized support options.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-lg border border-gray-200 px-6">
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                Can I invite my teammates to Apps?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Absolutely! Fitness Friends is all about building a community. You can invite friends and workout buddies to join you on the platform.
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
