# WeBioDigital-Wellness-App

A comprehensive wellness and biohacking platform built with Next.js and Supabase, designed to help you track, analyze, and optimize your health.

## ✨ Key Features

- **Secure Authentication:** User registration and login system powered by Supabase Auth.
- **Health Dashboard:** A centralized view of your vital health metrics, including Sleep Score, Readiness Score, HRV, and SpO2.
- **Data Synchronization:** Seamlessly sync your health data from connected devices and services.
- **Interactive Visualizations:** Track your progress with beautiful, interactive charts for trends and insights, built with Recharts.
- **Genomics Insights:** A dedicated section to explore and understand your genomic data.
- **Milestone Tracking:** Set, manage, and celebrate your personal wellness goals.
- **Command Palette:** A quick and efficient command menu (`Ctrl+K`) for easy navigation and actions.
- **Theme Customization:** Switch between light, dark, and system-default themes.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15.x (with App Router)
- **Backend & Auth:** [Supabase](https://supabase.io/)
- **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Forms:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or newer)
- npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd WeBioDigital-Wellness-App
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**

    Create a `.env.local` file in the project root and add your Supabase project URL and anon key.

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📂 Project Structure

The project uses the `src` directory and organizes code by feature and function:

```
/src
├── app/                # Next.js App Router
│   ├── (auth)/         # Auth-related pages (Login, Register)
│   └── (dashboard)/    # Protected dashboard pages
├── components/         # Reusable UI components
├── context/            # React Context providers for global state
├── hooks/              # Custom React hooks
├── integrations/       # Supabase client setup
└── lib/                # Utility functions and constants
```
