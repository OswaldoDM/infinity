# 🛒 INFINITY-Ecommerce

A modern, full-stack e-commerce platform built with **Next.js 15**, **Auth.js (v5)**, and **Tailwind CSS**. This application features a robust authentication system, a complete shopping flow, and integrated image management.

## 🚀 Features

- **🔐 Secure Authentication**: Implemented with Auth.js (v5 Beta) and bcryptjs for password hashing.
- **📦 Product Management**: Dynamic product browsing and detailed views.
- **🛒 Shopping Cart**: Fully functional cart for managing selections before checkout.
- **💳 Checkout & Payments**: Seamless multi-step payment and order confirmation process.
- **👤 User Profiles**: Dedicated dashboard for users to manage their info and view order history.
- **🖼️ Image Hosting**: Integrated Cloudinary support for high-performance image handling.
- **⚡ Performance First**: Leveraging Next.js 15 Server Components and Server Actions for speed and SEO.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Authentication**: [Auth.js v5](https://authjs.dev/)
- **Database**: PostgreSQL (via `pg` driver)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Media**: [Cloudinary](https://cloudinary.com/)
- **Icons**: [Lucide React](https://lucide.dev/) (implied)

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm / yarn / pnpm / bun
- A PostgreSQL database instance
- A Cloudinary account for image storage

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd auth-next-ecommerce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Create a `.env` file in the root directory and add the following:
   ```env
   # Database
   DATABASE_URL="your_postgresql_url"

   # Auth.js
   AUTH_SECRET="your_secret_key" # You can generate one with: npx auth secret
   AUTH_TRUST_HOST=true

   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
  - `(auth)/`: Authentication routes (login, register).
  - `(shop)/`: Main e-commerce routes (cart, product, payment, orders).
  - `(profile)/`: User-specific routes.
  - `actions/`: Server actions for handling form submissions and data mutations.
  - `api/`: API route handlers.
- `lib/`: Shared utility functions and database configuration.
- `ui/`: Reusable UI components.
- `types.d.ts`: TypeScript definitions


