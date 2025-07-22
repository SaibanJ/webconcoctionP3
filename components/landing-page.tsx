"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Rocket, ShieldCheck, Zap, Search, ArrowRight, CheckCircle } from "lucide-react"
import { PricingToggle } from "@/components/pricing-toggle"
import { ThemeToggleButton } from "@/components/theme-toggle-button"
import { useTheme } from "next-themes"
import { PopularPlanCard } from "@/components/popular-plan-card"
import { AwesomeHeroAnimation } from "@/components/awesome-hero-animation"
import { DomainWizard } from "@/components/domain-wizard";
import { MobileNav } from "@/components/mobile-nav";

export function LandingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const { theme } = useTheme()
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isDomainWizardOpen, setIsDomainWizardOpen] = useState(false);

  const pricingPackages = [
    {
      id: "webcrtae_basic",
      name: "Starter",
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: ["1 Website", "50 GB SSD Storage", "Unmetered Bandwidth", "Free SSL Certificate"],
      popular: false,
    },
    {
      id: "webcrtae_pro",
      name: "Pro",
      monthlyPrice: 59,
      yearlyPrice: 590,
      features: [
        "Unlimited Websites",
        "100 GB SSD Storage",
        "Unmetered Bandwidth",
        "Free SSL & Domain",
        "Daily Backups",
      ],
      popular: true,
    },
    {
      id: "webcrtae_elite",
      name: "Business",
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        "Unlimited Websites",
        "200 GB NVMe Storage",
        "Priority Support",
        "Advanced Security",
        "Staging Environment",
      ],
      popular: false,
    },
  ]

  const handlePlanSelect = useCallback((plan) => {
    setSelectedPlan(plan);
    setIsDomainWizardOpen(true);
  }, []);

  return (
      <div className="flex flex-col min-h-[100dvh] bg-white dark:bg-[#0a0a0a] text-gray-800 dark:text-gray-200 font-sans">
        <header className="px-4 lg:px-8 h-16 flex items-center fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-black/20 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto w-full flex items-center">
            <Link href="#" className="flex items-center justify-center">
              <span className="ml-2 text-xl font-bold tracking-wider text-gray-900 dark:text-white">WebConcoction</span>
            </Link>
            <nav className="ml-auto hidden lg:flex gap-6 text-sm font-medium">
              <Link
                  href="#services"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
              >
                Services
              </Link>
              <Link
                  href="#why-us"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
              >
                Why Us
              </Link>
              <Link
                  href="#pricing"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
              >
                Pricing
              </Link>
              <Link
                  href="#testimonials"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
              >
                Testimonials
              </Link>
            </nav>
            <div className="ml-4 hidden lg:flex items-center gap-2">
              <ThemeToggleButton />
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
            </div>
            <div className="ml-auto lg:hidden flex items-center gap-2">
              <ThemeToggleButton />
              <MobileNav />
            </div>
          </div>
        </header>

        <main className="flex-1">
          <section className="w-full h-screen flex items-center justify-center relative bg-gray-50 dark:bg-transparent">
            <div className="absolute inset-0 z-0">
              <AwesomeHeroAnimation theme={theme} />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                  Craft Your Digital Masterpiece...
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl">
                  WebConcoction provides the tools, speed, and reliability to bring your web projects to life. From idea
                  to launch, we've got you covered.
                </p>
                <div className="space-x-4">
                  <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20"
                  >
                    Start Building <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                      size="lg"
                      variant="outline"
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white bg-transparent"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section id="services" className="w-full py-20 md:py-32 bg-gray-100 dark:bg-[#111111]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">
                  Our Services
                </h2>
                <p className="max-w-[600px] mx-auto text-gray-600 dark:text-gray-400">
                  Everything you need to build, deploy, and scale your web applications.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Rocket className="h-8 w-8 text-purple-500" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Blazing Fast Hosting</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Experience unparalleled speed with our NVMe SSD storage and global CDN.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <ShieldCheck className="h-8 w-8 text-purple-500" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ironclad Security</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Free SSL, DDoS protection, and daily backups to keep your site safe and sound.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Zap className="h-8 w-8 text-purple-500" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Effortless Scalability</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Scale your resources with one click as your traffic grows. No downtime.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section id="why-us" className="w-full py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">
                    Why Choose WebConcoction?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    We're not just another hosting provider. We're your partner in digital success, committed to providing
                    an elite platform for creators and businesses.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Developer-Friendly</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          Git integration, SSH access, and support for all modern frameworks.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">24/7 Expert Support</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          Our team of experts is always available to help you with any issue.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">99.9% Uptime Guarantee</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          We stand by our infrastructure with a rock-solid uptime promise.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="group relative w-full h-80 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 flex items-center justify-center p-8 overflow-hidden transition-transform duration-500 ease-in-out hover:scale-105">
                  {/* The AwesomeHeroAnimation was here, now it's in the hero section */}
                </div>
              </div>
            </div>
          </section>

          <section id="pricing" className="w-full py-20 md:py-32 bg-gray-100 dark:bg-[#111111]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">
                  Flexible Pricing for Everyone
                </h2>
                <p className="max-w-[600px] mx-auto text-gray-600 dark:text-gray-400">
                  Choose the perfect plan for your needs. Switch anytime.
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <PricingToggle onToggle={setIsYearly} />
                  <span className="ml-2 text-sm font-medium text-purple-500 dark:text-purple-400">(Save 2 months!)</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                {pricingPackages.map((pkg) =>
                    pkg.popular ? (
                        <PopularPlanCard key={pkg.name} pkg={pkg} isYearly={isYearly} onSelectPlan={handlePlanSelect} />
                    ) : (
                        <Card
                            key={pkg.name}
                            className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 flex flex-col h-full"
                        >
                          <CardHeader>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{pkg.name}</h3>
                            <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                          ${isYearly ? Math.floor(pkg.yearlyPrice / 12) : pkg.monthlyPrice}
                        </span>
                              <span className="text-gray-500 dark:text-gray-400">/month</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {isYearly ? `$${pkg.yearlyPrice} billed annually` : "Billed monthly"}
                            </p>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <ul className="space-y-3">
                              {pkg.features.map((feature) => (
                                  <li key={feature} className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                  </li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter>
                            <Button
                                className="w-full bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white"
                                onClick={() => handlePlanSelect(pkg)}
                            >
                              Choose Plan
                            </Button>
                          </CardFooter>
                        </Card>
                    ),
                )}
              </div>
            </div>
          </section>

          <section id="testimonials" className="w-full py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">
                  Loved by Developers Worldwide
                </h2>
                <p className="max-w-[600px] mx-auto text-gray-600 dark:text-gray-400">
                  Don't just take our word for it. Here's what our customers are saying.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    "The speed is insane. My site loads in a blink. WebConcoction has been a game-changer for my
                    e-commerce store."
                  </p>
                  <div className="flex items-center gap-4">
                    <img src="/diverse-person-avatar.png" alt="Avatar" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Sarah L.</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Founder of StyleHub</p>
                    </div>
                  </div>
                </Card>
                <Card className="bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    "I migrated from another host and the difference is night and day. The support team was incredibly
                    helpful during the process."
                  </p>
                  <div className="flex items-center gap-4">
                    <img src="/person-avatar-2.png" alt="Avatar" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Mike R.</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Freelance Developer</p>
                    </div>
                  </div>
                </Card>
                <Card className="bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    "The developer tools are top-notch. Git integration works flawlessly and saved me so much time on
                    deployments."
                  </p>
                  <div className="flex items-center gap-4">
                    <img src="/person-avatar-3.png" alt="Avatar" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Chen W.</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">CTO at Innovatech</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          <section
              id="domain-wizard"
              className="w-full py-20 md:py-32 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <DomainWizard isOpen={isDomainWizardOpen} onClose={() => setIsDomainWizardOpen(false)} initialPlan={selectedPlan} />
            </div>
          </section>
        </main>

        <footer className="bg-gray-100 dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} WebConcoction. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:gap-6">
              <Link href="#" className="text-sm hover:underline underline-offset-4 text-gray-500 dark:text-gray-400">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm hover:underline underline-offset-4 text-gray-500 dark:text-gray-400">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </footer>
      </div>
  )
}
