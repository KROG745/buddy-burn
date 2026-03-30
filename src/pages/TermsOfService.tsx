import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FitnessLogo from "@/components/FitnessLogo";

const TermsOfService = () => {
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
        <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: March 30, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-foreground/90">
          <section>
            <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing or using Fitness Friends ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the App.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">2. Description of Service</h2>
            <p>Fitness Friends is a social fitness platform that connects users with workout partners for accountability and motivation. The App is provided "as is" and "as available."</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">3. Health & Fitness Disclaimer</h2>
            <p className="font-semibold">IMPORTANT: Fitness Friends is not a medical or healthcare provider. The App does not provide medical advice, diagnosis, or treatment.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You should consult a qualified physician or healthcare provider before beginning any exercise program, diet plan, or fitness routine.</li>
              <li>You acknowledge that participating in physical exercise carries inherent risks, including but not limited to physical injury, disability, or death.</li>
              <li>You assume full responsibility for any risks, injuries, or damages arising from your use of the App and any exercise activities undertaken in connection with it.</li>
              <li>Fitness Friends, its founders, employees, and affiliates shall not be liable for any injuries, health complications, or damages resulting from exercise activities facilitated through the App.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">4. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must be at least 18 years old to use the App.</li>
              <li>You may delete your account at any time through the Profile settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">5. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the App for any unlawful purpose or in violation of any applicable laws.</li>
              <li>Harass, threaten, or intimidate other users.</li>
              <li>Post false, misleading, or deceptive content.</li>
              <li>Impersonate another person or entity.</li>
              <li>Use automated systems (bots) to access the App.</li>
              <li>Attempt to circumvent security measures or rate limits.</li>
              <li>Share another user's personal information without consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">6. User-Generated Content</h2>
            <p>You retain ownership of content you post. By sharing content on the App, you grant Fitness Friends a non-exclusive, royalty-free license to display it within the platform. We may remove content that violates these terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">7. Meeting Other Users</h2>
            <p className="font-semibold">Fitness Friends facilitates connections but does not vet, screen, or background-check users.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are solely responsible for your safety when meeting other users in person.</li>
              <li>We recommend meeting in public places such as gyms or fitness centers.</li>
              <li>Fitness Friends is not responsible for the conduct of any user, whether online or offline.</li>
              <li>Report any suspicious or inappropriate behavior through the App's reporting feature.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">8. Limitation of Liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, FITNESS FRIENDS AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE APP.</p>
            <p>IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID TO US (IF ANY) IN THE 12 MONTHS PRECEDING THE CLAIM.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">9. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Fitness Friends from any claims, damages, losses, or expenses arising from your use of the App, your violation of these Terms, or your violation of any rights of another user.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">10. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any reason at our sole discretion.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">11. Changes to Terms</h2>
            <p>We may update these Terms at any time. Continued use of the App after changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">12. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:support@fitnessfriends.app" className="text-primary hover:underline">support@fitnessfriends.app</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
