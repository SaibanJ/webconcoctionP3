"use client"

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface PopularPlanCardProps {
  pkg: {
    name: string
    monthlyPrice: number
    yearlyPrice: number
    features: string[]
  }
  isYearly: boolean
}

export function PopularPlanCard({ pkg, isYearly }: PopularPlanCardProps) {
  return (
    <div className="relative scale-105 shadow-lg shadow-purple-500/20 rounded-xl">
      <style jsx>{`
        .animated-border-glow::before {
          content: "";
          position: absolute;
          inset: -2px;
          z-index: -1;
          border-radius: 14px; /* slightly larger than card's border-radius */
          background: conic-gradient(
            from var(--angle),
            transparent 25%,
            #d8b4fe,
            #a855f7,
            transparent 50%
          );
          animation: rotate 4s linear infinite;
          filter: blur(2px);
        }

        @property --angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes rotate {
          to {
            --angle: 360deg;
          }
        }
      `}</style>
      <div className="animated-border-glow" />
      <Card className="bg-white dark:bg-gray-900/80 backdrop-blur-sm border-transparent flex flex-col h-full">
        <CardHeader className="relative">
          <div className="absolute top-0 right-4 -translate-y-1/2 bg-purple-600 text-white px-3 py-1 text-xs font-bold rounded-full z-10">
            POPULAR
          </div>
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
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Choose Plan</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
