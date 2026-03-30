import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FitnessLogo from "@/components/FitnessLogo";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-foreground border-b border-border/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <FitnessLogo textColor="text-primary-foreground" />
          </Link>
          <Button variant="ghost" className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10 gap-2" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: March 30, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-foreground/90">
          <section>
            <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
            <h3 className="text-lg font-medium text-foreground">Information you provide:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Profile data (bio, fitness goals, experience level, avatar)</li>
              <li>Workout schedules and activity data</li>
              <li>Messages sent through the App</li>
            </ul>
            <h3 className="text-lg font-medium text-foreground mt-4">Information collected automatically:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Usage data (features used, pages visited)</li>
              <li>Device information (browser type, operating system)</li>
              <li>Location data (only when you provide it for workout locations)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and improve the App's features</li>
              <li>To match you with compatible workout partners</li>
              <li>To send notifications about friend requests, workouts, and achievements</li>
              <li>To ensure the safety and security of our platform</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>With other users:</strong> Profile information you make public, shared workouts, and messages.</li>
              <li><strong>With service providers:</strong> Third-party services that help us operate the App (e.g., hosting, analytics).</li>
              <li><strong>For legal reasons:</strong> When required by law or to protect our rights and safety.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">4. Location Privacy</h2>
            <p>Your workout location data is protected:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Location details are only visible to you by default.</li>
              <li>Friends can see your workout locations unless you enable "Hide Location from Friends" in your profile settings.</li>
              <li>Non-friends viewing public workout shares will see "Location hidden."</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">5. Data Security</h2>
            <p>We implement industry-standard security measures including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Row-level security policies on all database tables</li>
              <li>Rate limiting to prevent abuse</li>
              <li>Bot detection and prevention measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> View all personal data we store about you.</li>
              <li><strong>Correct:</strong> Update inaccurate information via your Profile.</li>
              <li><strong>Delete:</strong> Delete your account and all associated data.</li>
              <li><strong>Control visibility:</strong> Toggle profile visibility and location sharing.</li>
              <li><strong>Block users:</strong> Block other users from interacting with you.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">7. Data Retention</h2>
            <p>We retain your data for as long as your account is active. When you delete your account, all associated personal data is permanently removed from our systems.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">8. Children's Privacy</h2>
            <p>The App is not intended for users under 18 years of age. We do not knowingly collect information from children.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify you of significant changes through the App or via email.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">10. Contact Us</h2>
            <p>For privacy-related questions, contact us at <a href="mailto:support@fitnessfriends.app" className="text-primary hover:underline">support@fitnessfriends.app</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
