import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navigation from "@/components/Navigation";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" className="mb-4 text-gray-700 hover:text-[#4169E1] hover:bg-blue-50" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#4169E1] to-[#5179F1] mb-6 shadow-lg">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#4169E1] to-[#5179F1] bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about Fitness Friends
          </p>
        </div>

        <Card className="bg-white border-blue-100 shadow-xl mb-8">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900">General Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-blue-100">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-blue-50 text-left">
                <span className="text-lg font-semibold text-gray-900">What is Fitness Friends?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600">
                Fitness Friends is a mobile app designed to help you find workout buddies and stay motivated on your fitness journey. Connect with like-minded individuals, schedule workouts together, and track your progress as a community.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-blue-100">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-blue-50 text-left">
                <span className="text-lg font-semibold text-gray-900">Who is Fitness Friends for?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600">
                Fitness Friends is perfect for anyone looking to make fitness more social and enjoyable. Whether you're a beginner seeking guidance, an intermediate athlete looking for accountability, or an experienced fitness enthusiast wanting to share your knowledge, Fitness Friends connects you with the right community.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b-0">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-blue-50 text-left">
                <span className="text-lg font-semibold text-gray-900">What platforms is Fitness Friends available on?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600">
                Fitness Friends is available as a web app and will soon be available on iOS and Android. You can access your account from any device and your data syncs seamlessly across all platforms.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="bg-white border-blue-100 shadow-xl mb-8">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900">Features & Functionality</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-4" className="border-blue-100">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-blue-50 text-left">
                <span className="text-lg font-semibold text-gray-900">How do I find workout partners?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600">
                Our smart matching system connects you with fitness enthusiasts based on your location, fitness level, workout preferences, and goals. Browse profiles, send messages, and schedule workouts together through the app. You can filter by distance, workout type, experience level, and availability.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-blue-100">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-blue-50 text-left">
                <span className="text-lg font-semibold text-gray-900">Can I track my workouts in the app?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600">
                Absolutely! Fitness Friends includes comprehensive workout tracking features. Log your exercises, monitor progress, set goals, and view detailed analytics about your fitness journey. Track sets, reps, duration, intensity, and location. You can also share your achievements with friends.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-blue-100">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-blue-50 text-left">
                <span className="text-lg font-semibold text-gray-900">How does the messaging system work?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600">
                Connect with your fitness friends through our built-in messaging system. Chat in real-time, coordinate workout schedules, share tips and motivation, and build a supportive community. We also provide ice breaker prompts to help start conversations and make connecting with new workout partners easier.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border-blue-100">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-blue-50 text-left">
                <span className="text-lg font-semibold text-gray-900">What is the workout scheduling feature?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600">
                Plan your workouts in advance with our smart scheduling system. Set workout times, locations, intensity levels, and goals. Invite friends to join your workouts, track completion status, and maintain consistency with calendar integration and reminders.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border-b-0">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-blue-50 text-left">
                <span className="text-lg font-semibold text-gray-900">How do achievements and badges work?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600">
                Earn achievements and unlock badges as you reach milestones in your fitness journey. Complete workout streaks, hit personal records, help friends, and explore new workout types to unlock special badges. Achievements are displayed on your profile and can be shared with your fitness community.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="bg-white border-blue-100 shadow-xl mb-8">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900">Privacy & Security</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-9" className="border-blue-100">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-blue-50 text-left">
                <span className="text-lg font-semibold text-gray-900">Is my data secure and private?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600">
                Your privacy and security are our top priorities. We use industry-standard encryption to protect your data, and you have full control over what information you share with others. Your workout data and messages are private and secure. We never share your personal information with third parties without your explicit consent.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="border-blue-100">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-blue-50 text-left">
                <span className="text-lg font-semibold text-gray-900">Can I control who sees my profile?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600">
                Yes! You have complete control over your privacy settings. Choose to make your profile public, visible only to friends, or private. You can also control what information is visible on your profile, including your location, workout history, and personal details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11" className="border-b-0">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-blue-50 text-left">
                <span className="text-lg font-semibold text-gray-900">How do I report inappropriate behavior?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600">
                We maintain a safe and respectful community. If you encounter inappropriate behavior, you can report users directly from their profile or messages. Our team reviews all reports promptly and takes appropriate action. You can also block users to prevent them from contacting you.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="bg-white border-blue-100 shadow-xl mb-8">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900">Pricing & Beta Program</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-12" className="border-blue-100">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-blue-50 text-left">
                <span className="text-lg font-semibold text-gray-900">Is Fitness Friends free to use?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600">
                We're currently in closed beta and offering free access to all features. Sign up now to secure your spot and be among the first to experience the full Fitness Friends platform! Beta users will receive special perks and early access to new features.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-13" className="border-blue-100">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-blue-50 text-left">
                <span className="text-lg font-semibold text-gray-900">How do I join the beta program?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600">
                Simply click the "Join Beta" or "Get Started" button and create your account. You'll get immediate access to all features and be part of shaping the future of Fitness Friends with your feedback. We value our beta testers and actively incorporate their suggestions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-14" className="border-b-0">
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-blue-50 text-left">
                <span className="text-lg font-semibold text-gray-900">Will there be a paid version in the future?</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-gray-600">
                While we're currently offering free access during beta, we plan to introduce premium features in the future. Core functionality will always remain free, and beta testers will receive special pricing and exclusive benefits when premium features launch.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="bg-gradient-to-r from-[#4169E1] to-[#5179F1] border-0 shadow-2xl text-center p-12">
          <h3 className="text-3xl font-bold text-white mb-4">Still have questions?</h3>
          <p className="text-blue-100 text-lg mb-6">
            We're here to help! Join our beta program and get support from our team.
          </p>
          <Button size="lg" className="bg-white text-[#4169E1] hover:bg-blue-50 shadow-lg" asChild>
            <Link to="/auth">Join Beta Now</Link>
          </Button>
        </Card>
      </main>
    </div>
  );
};

export default FAQ;