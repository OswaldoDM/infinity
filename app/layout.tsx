import type { Metadata } from "next";
import { Urbanist, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./ui/Navbar";

const urbanist = Urbanist({
    weight: ['400', '500','600','700', '800'],
    variable: "--font-urbanist",
    subsets: ['latin'],
});

const inter = Inter({    
    variable: "--font-inter",
    subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Infinity",
  description: "Next.js E-commerce",
};

export default function RootLayout({children}:Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${urbanist.className} ${inter.variable} antialiased`}>
        <main className='min-h-screen flex bg-gray-200 text-sm 2xl:text-base'>
          <section className='container mx-auto flex flex-col'>
            <Navbar />
            {children}
          </section>
        </main>              
      </body>
    </html>
  );
}
