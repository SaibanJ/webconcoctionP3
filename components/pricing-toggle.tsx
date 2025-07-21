"use client"

import { useState } from "react"
import { motion } from "framer-motion"

type BillingFrequency = "monthly" | "annually"

interface PricingToggleProps {
  onToggle: (isYearly: boolean) => void
}

export function PricingToggle({ onToggle }: PricingToggleProps) {
  const [billing, setBilling] = useState<BillingFrequency>("monthly")

  const handleToggle = (freq: BillingFrequency) => {
    setBilling(freq)
    onToggle(freq === "annually")
  }

  return (
    <div className="relative flex w-fit items-center rounded-full border border-gray-200 dark:border-gray-700 p-1">
      <button
        onClick={() => handleToggle("monthly")}
        className={`relative z-10 rounded-full px-6 py-2 text-sm transition-colors ${
          billing === "monthly" ? "text-white" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => handleToggle("annually")}
        className={`relative z-10 rounded-full px-6 py-2 text-sm transition-colors ${
          billing === "annually" ? "text-white" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        Annually
      </button>
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="absolute inset-0 z-0 h-full rounded-full bg-purple-600"
        initial={{ x: "0%" }}
        animate={{ x: billing === "monthly" ? "0%" : "calc(100% - 4px)" }}
        style={{
          width: billing === "monthly" ? "calc(50% + 2px)" : "calc(50% + 2px)",
          left: billing === "monthly" ? "2px" : "auto",
          right: billing === "annually" ? "2px" : "auto",
        }}
      />
    </div>
  )
}
