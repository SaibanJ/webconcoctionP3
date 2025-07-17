"use client"

import { useState } from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { ThemeToggleButton } from "@/components/theme-toggle-button"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
        <nav className="flex flex-col gap-6 text-lg font-medium py-6">
          <Link
            href="#services"
            className="text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
          <Link
            href="#why-us"
            className="text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Why Us
          </Link>
          <Link
            href="#pricing"
            className="text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="#testimonials"
            className="text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Testimonials
          </Link>
        </nav>
        <div className="mt-auto flex flex-col gap-4 p-4 border-t border-gray-200 dark:border-gray-800">
          <ThemeToggleButton />
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
