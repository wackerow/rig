import type { Metadata } from "next"
import { EB_Garamond, Montserrat } from "next/font/google"

import Logo from "@/components/svg/rig-logo.svg"
import GitHub from "@/components/svg/github.svg"
import Twitter from "@/components/svg/twitter.svg"
import Email from "@/components/svg/email.svg"
import ThemeSwitch from "@/components/ThemeSwitch"

import "./globals.css"

const garamondSerif = EB_Garamond({
  variable: "--font-eb-garamond",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
})

const montserratSans = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Robust Incentives Group",
  description: "Robust Incentives Group", // TODO: Add description
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${garamondSerif.variable} ${montserratSans.variable} grid min-h-screen grid-rows-[auto_1fr_auto] items-center justify-items-center p-8 font-serif antialiased sm:px-18 sm:py-10`}
      >
        <header className="flex w-full justify-between">
          <Logo
            className="text-foreground text-[9rem]"
            alt="Robust Incentives Group RIG logo"
          />
          <nav className="flex items-center gap-4">
            <ThemeSwitch />
          </nav>
        </header>
        {children}
        <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6 font-sans font-bold">
          <div id="socials" className="flex items-center gap-x-4 text-3xl">
            <span className="text-accent-foreground text-[50px]">&#91;</span>
            <GitHub className="text-primary" />
            <Twitter className="text-primary" />
            <Email className="text-primary" />
            <span className="text-accent-foreground text-[50px]">&#93;</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
