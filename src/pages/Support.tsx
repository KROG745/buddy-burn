import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FitnessLogo from "@/components/FitnessLogo";
import { Mail, MessageCircle, FileQuestion, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Support = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <FitnessLogo textColor="text-white" />
          </Link>
          <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 gap-2" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Support Center
            </h1>
            <p className="text-xl text-gray-600">
              We're here to help you get the most out of Fitness Friends
            </p>
          </div>

          {/* Support Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Have a question or need assistance? Send us an email and we'll get back to you within 24-48 hours.
                </p>
                <a 
                  href="mailto:support@fitnessfriends.app" 
                  className="text-[#4169E1] font-semibold hover:underline"
                >
                  support@fitnessfriends.app
                </a>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#4169E1] to-[#5179F1] rounded-xl flex items-center justify-center mb-4">
                  <FileQuestion className="w-6 h-6 text-white" />
                </div>
                <CardTitle>FAQ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Find answers to commonly asked questions about Fitness Friends features and functionality.
                </p>
                <Link 
                  to="/faq" 
                  className="text-[#4169E1] font-semibold hover:underline"
                >
                  View FAQ →
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Common Topics */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-[#4169E1]" />
                Common Support Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Account & Profile</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Creating and managing your account</li>
                    <li>• Updating profile information</li>
                    <li>• Privacy settings and controls</li>
                    <li>• Deleting your account</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Finding Workout Buddies</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• How matching works</li>
                    <li>• Managing friend requests</li>
                    <li>• Blocking and reporting users</li>
                    <li>• Improving your match results</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Workouts & Scheduling</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Creating custom workouts</li>
                    <li>• Scheduling sessions</li>
                    <li>• Sharing workouts with friends</li>
                    <li>• Tracking your progress</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Technical Issues</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• App not loading properly</li>
                    <li>• Notification issues</li>
                    <li>• Location services problems</li>
                    <li>• Performance troubleshooting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="bg-gray-900 text-white">
            <CardContent className="py-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
                <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                  Our support team is available Monday through Friday, 9am - 5pm EST. 
                  We aim to respond to all inquiries within 24-48 business hours.
                </p>
                <Button 
                  size="lg" 
                  className="bg-[#4169E1] hover:bg-[#3159D1] text-white"
                  asChild
                >
                  <a href="mailto:support@fitnessfriends.app">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Support
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>
              Fitness Friends is currently in beta. We appreciate your patience and feedback 
              as we continue to improve the app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;