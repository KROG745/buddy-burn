import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FitnessLogo from "@/components/FitnessLogo";
import { Users, MapPin, Calendar, Dumbbell, MessageCircle, Activity, Rocket, Heart, Target, Shield, TrendingUp, Quote, CheckCircle2, Flame, Clock, UserCheck, Trophy } from "lucide-react";
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

const Landing = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard", { replace: true });
        return;
      }
      setIsChecking(false);
    };
    checkUserStatus();
  }, [navigate]);

  if (isChecking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-foreground/95 backdrop-blur-md border-b border-border/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <FitnessLogo textColor="text-primary-foreground" />
          <div className="flex gap-2 md:gap-4 items-center">
            <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="#faq">FAQ</a>
            </Button>
            <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/support">Support</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg" asChild>
              <Link to="/auth">
                <Rocket className="w-4 h-4" />
                Get Early Access (Free)
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground py-24 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium border border-primary/30">
                <Flame className="w-4 h-4 text-primary" />
                <span>Join 847 people already on the waitlist</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
                Never Skip a<br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Workout Again</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed">
                Train with friends, stay accountable, and finally stick to your fitness goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg text-lg px-8 py-6" asChild>
                  <Link to="/auth">
                    <Rocket className="w-5 h-5" />
                    Get Early Access (Free)
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground self-center">No credit card required · Free forever during beta</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-[4rem] blur-3xl" />
              <div className="relative mx-auto max-w-sm">
                <img src={heroPhone} alt="Fitness Friends App Preview" className="w-full drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-primary font-bold mb-3">Sound familiar?</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
              You know what you should do.<br />
              <span className="text-muted-foreground">You just can't make yourself do it.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Clock, title: "You set the alarm for 6 AM…", desc: "…then hit snooze 4 times because nobody's waiting for you at the gym." },
              { icon: Target, title: "You buy the program…", desc: "…follow it for 2 weeks, then quietly stop because life got busy and nobody noticed." },
              { icon: Heart, title: "You scroll motivation pages…", desc: "…feel inspired for 10 minutes, then go back to the couch because inspiration doesn't last." },
              { icon: Users, title: "You wish you had someone…", desc: "…who actually cared if you showed up — not a coach you pay, but a friend who gets it." },
            ].map((item, i) => (
              <Card key={i} className="border-2 border-border/50 bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-8">
                  <item.icon className="w-10 h-10 text-destructive/70 mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-xl text-muted-foreground mt-12 max-w-2xl mx-auto">
            It's not your fault. <span className="text-foreground font-semibold">You're not lazy — you're just doing it alone.</span> And humans were never built to do hard things by themselves.
          </p>
        </div>
      </section>

      {/* Solution / Benefits Section */}
      <section className="py-24 bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-primary font-bold mb-3">The Solution</p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              What if someone was<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">counting on you?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fitness Friends pairs you with real people who share your goals. When someone's expecting you at the gym, skipping stops being an option.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: UserCheck, title: "Find Workout Partners", desc: "Get matched with people who train at your level, your gym, your schedule." },
              { icon: Shield, title: "Built-In Accountability", desc: "When someone's waiting, you show up. Period. No more broken promises to yourself." },
              { icon: Calendar, title: "Train Together", desc: "Coordinate schedules, share workouts, and turn solo sessions into shared victories." },
              { icon: Trophy, title: "Challenges & Streaks", desc: "Compete with friends, build streaks, and celebrate every milestone together." },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl mx-auto flex items-center justify-center border border-primary/30">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg text-lg px-8 py-6" asChild>
              <Link to="/auth">
                <Rocket className="w-5 h-5" />
                Get Early Access (Free)
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Psychology / Accountability Science Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <p className="text-sm uppercase tracking-widest text-primary font-bold">The Science</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                Accountability increases your chance of success by <span className="text-primary">95%</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The American Society of Training and Development found that people are <strong className="text-foreground">65% likely to complete a goal</strong> if they commit to someone. And if they have a specific accountability appointment? That number jumps to <strong className="text-foreground">95%</strong>.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                That's what Fitness Friends does. It turns your fitness goals from "I should" into "I'm meeting Sarah at 6 AM."
              </p>
            </div>
            <div className="space-y-6">
              {[
                { pct: "10%", label: "Having an idea", color: "bg-muted" },
                { pct: "40%", label: "Deciding to do it", color: "bg-muted" },
                { pct: "65%", label: "Committing to someone", color: "bg-primary/50" },
                { pct: "95%", label: "Having an accountability partner", color: "bg-primary" },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-foreground">{item.label}</span>
                    <span className="text-primary font-bold">{item.pct}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: item.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* App Mockups / Features Showcase */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-primary font-bold mb-3">Inside the App</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Everything you need to never train alone
            </h2>
          </div>

          {/* Alternating feature showcases */}
          <div className="max-w-6xl mx-auto space-y-32">
            {[
              { img: featureFriendMatching, icon: Users, title: "Find Your People", desc: "Our matching algorithm connects you with people who share your goals, your vibe, and your drive. No more awkward gym small talk — just real connections.", bullets: ["Smart matching based on goals & schedules", "Compatibility scores", "Instant connection"] },
              { img: featureSchedule, icon: Calendar, title: "Stay Accountable Together", desc: "Plans are easy to break alone. When someone's counting on you, you show up — every single time. Build a rhythm that makes commitment feel effortless.", bullets: ["Shared workout calendar", "Smart notifications", "Coordinate with partners"], reverse: true },
              { img: featureMessaging, icon: MessageCircle, title: "Real Conversations", desc: "The 'you got this' text before leg day. The check-in after a tough week. Real support from real people who care about your progress.", bullets: ["Private messaging", "Share achievements", "Safe & private space"], },
              { img: featureActivity, icon: Activity, title: "See How Far You've Come", desc: "On the days you want to quit, look back. Every rep, every session — proof that you're stronger than yesterday.", bullets: ["Complete workout history", "Visual progress charts", "Streak tracking"], reverse: true },
            ].map((feature, i) => (
              <div key={i} className={`grid lg:grid-cols-2 gap-12 items-center`}>
                <div className={feature.reverse ? "order-2 lg:order-2" : "order-2 lg:order-1"}>
                  <img src={feature.img} alt={feature.title} className="rounded-2xl shadow-2xl w-full" />
                </div>
                <div className={`space-y-6 ${feature.reverse ? "order-1 lg:order-1" : "order-1 lg:order-2"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">{feature.desc}</p>
                  <ul className="space-y-3">
                    {feature.bullets.map((b, j) => (
                      <li key={j} className="flex items-center gap-3 text-muted-foreground">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-24 bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-primary font-bold mb-3">Beta Testers Say</p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Real stories from real people
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "I haven't missed a workout in 6 weeks. Before Fitness Friends, my longest streak was 5 days. Having someone actually waiting for me changed everything.", name: "Sarah M.", detail: "Lost 15 lbs in 3 months" },
              { quote: "I moved to a new city and knew nobody. This app gave me my gym crew within a week. Now we train together 4x a week and grab smoothies after.", name: "Marcus T.", detail: "Found 3 training partners" },
              { quote: "I've tried every fitness app. They all track — none of them connect. This is the first one that made me feel like I'm part of something.", name: "Priya K.", detail: "12-week streak and counting" },
            ].map((t, i) => (
              <Card key={i} className="bg-primary-foreground/5 border-primary-foreground/10 backdrop-blur-sm">
                <CardContent className="p-8 space-y-6">
                  <Quote className="w-8 h-8 text-primary/60" />
                  <p className="text-primary-foreground/90 leading-relaxed italic">"{t.quote}"</p>
                  <div>
                    <p className="font-bold text-primary-foreground">{t.name}</p>
                    <p className="text-sm text-primary">{t.detail}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-8">
            <p className="text-sm uppercase tracking-widest text-primary font-bold">Our Story</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
              Built by someone who lives it
            </h2>
            <div className="text-left space-y-6 text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              <p>
                I've dedicated my life to fitness — not just as a sport, but as a lifestyle. I'm a husband, a father, and a working professional, and I know how quickly life can pull you in a dozen directions at once.
              </p>
              <p>
                Training isn't just a hobby for me — it's part of who I am. It's what keeps me disciplined, focused, and ready to take on everything life throws my way. But even with years in the gym, stage prep, and competition experience as an IFBB Pro bodybuilder, <span className="text-foreground font-semibold">there's one thing I've never been able to master: consistency with a workout partner.</span>
              </p>
              <p>
                Every week looks different. Between family time, client sessions, travel, work obligations, and raising kids, most schedules never align perfectly. I've had lots of training partners over the years… but they've always come and gone because life got in the way.
              </p>
              <p>
                What I realized is that <span className="text-foreground font-semibold">motivation is fragile — consistency isn't. Motivation comes from within, but consistency comes from accountability.</span> When you have someone counting on you, someone you don't want to let down — that's what gets you out the door on the days where life is loudest.
              </p>
              <p>
                But here's the problem: <span className="text-foreground font-semibold">there's no easy way to find someone who's as committed as you are, with a schedule that actually matches yours.</span>
              </p>
              <p>
                I built Fitness Friends because I wanted a solution for me — and for anyone else out there who's juggling life, family, work, and fitness, and still wants to be the best version of themselves. This platform exists so you don't have to go it alone anymore.
              </p>
            </div>
            <p className="text-foreground font-bold text-xl">— Kenny Rogers, IFBB Pro & Founder</p>
          </div>
        </div>
      </section>

      {/* Waitlist / CTA with FOMO */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAyYzguODM3IDAgMTYgNy4xNjMgMTYgMTZzLTcuMTYzIDE2LTE2IDE2LTE2LTcuMTYzLTE2LTE2IDcuMTYzLTE2IDE2LTE2eiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDMiLz48L2c+PC9zdmc+')] opacity-30" />
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-full text-sm font-bold border border-primary-foreground/30">
              <Flame className="w-4 h-4" />
              <span>Only 153 spots left for founding members</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              The first 1,000 users get lifetime free access
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-xl mx-auto">
              We're building this with our community. Early adopters get free access forever, direct input on features, and the title of Founding Member.
            </p>
            <div className="flex flex-col items-center gap-4">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 shadow-xl text-lg px-10 py-7 font-bold" asChild>
                <Link to="/auth">
                  <Rocket className="w-5 h-5" />
                  Get Early Access (Free)
                </Link>
              </Button>
              <p className="text-sm text-primary-foreground/60">Takes 30 seconds · No credit card · Cancel anytime</p>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-primary-foreground/20 max-w-lg mx-auto">
              <div>
                <p className="text-3xl font-extrabold">847</p>
                <p className="text-sm text-primary-foreground/70">On waitlist</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold">153</p>
                <p className="text-sm text-primary-foreground/70">Spots left</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold">Free</p>
                <p className="text-sm text-primary-foreground/70">Forever</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-card py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-primary font-bold mb-3">FAQs</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Got questions?
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {[
              { q: "What is Fitness Friends?", a: "Fitness Friends is a social fitness app that connects you with real workout partners based on your goals, schedule, and gym. It's not another tracker — it's the accountability partner you've been missing." },
              { q: "How does the matching system work?", a: "Our algorithm matches you based on fitness goals, workout schedule, preferred gym locations, experience level, and training style. You'll get personalized match recommendations." },
              { q: "Is it really free?", a: "Yes! The first 1,000 users get lifetime free access as founding members. We want to build this with our community, and your early feedback is worth more than any subscription fee." },
              { q: "When will the mobile apps be available?", a: "We're developing iOS and Android versions. Beta testers get early access before the public launch. Join now to be among the first to try the mobile experience." },
              { q: "Is my personal information safe?", a: "Absolutely. Your data is encrypted and secure. You control what you share — you never need to give out your phone number or personal contact info." },
              { q: "What if there's nobody in my area yet?", a: "As our community grows, so do your potential matches. In the meantime, you can plan workouts, track progress, and build routines. We're expanding fast." },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-background rounded-xl border border-border px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            You've read this far.<br />
            <span className="text-primary">That means something.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            You're not looking for another app. You're looking for a reason to keep going. Let us be that reason.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg text-lg px-10 py-7 font-bold" asChild>
            <Link to="/auth">
              <Rocket className="w-5 h-5" />
              Get Early Access (Free)
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground border-t border-border/10 text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <FitnessLogo className="justify-center mb-6" textColor="text-primary-foreground" />
          <p className="text-muted-foreground mb-6">
            Because the strongest version of you shouldn't have to go it alone.
          </p>
          <div className="flex justify-center gap-6 mb-6 text-sm">
            <Link to="/support" className="text-muted-foreground hover:text-primary-foreground transition-colors">Support</Link>
            <a href="#faq" className="text-muted-foreground hover:text-primary-foreground transition-colors">FAQ</a>
            <a href="mailto:support@fitnessfriends.app" className="text-muted-foreground hover:text-primary-foreground transition-colors">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground/50">© 2026 Fitness Friends. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
