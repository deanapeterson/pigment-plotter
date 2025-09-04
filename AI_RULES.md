# AI Rules for Color Palette Builder

This document outlines the core technologies used in this project and provides guidelines for using specific libraries.

## Tech Stack

*   **React**: A JavaScript library for building user interfaces.
*   **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript, enhancing code quality and maintainability.
*   **Vite**: A fast build tool that provides a lightning-fast development experience.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.
*   **shadcn/ui**: A collection of re-usable components built with Radix UI and Tailwind CSS.
*   **React Router**: For declarative routing in the application.
*   **Lucide React**: A library for beautiful and consistent open-source icons.
*   **TanStack Query (React Query)**: For data fetching, caching, and state management.
*   **React Hook Form & Zod**: For robust form management and schema validation.
*   **Sonner**: A modern toast library for displaying notifications.

## Library Usage Rules

To maintain consistency and best practices, please adhere to the following guidelines when developing:

*   **UI Components**: Always prioritize using components from `shadcn/ui`. If a required component does not exist, create a new one following the `shadcn/ui` pattern (e.g., using Radix UI primitives and Tailwind CSS). Do not modify existing `shadcn/ui` files directly.
*   **Styling**: Use **Tailwind CSS** exclusively for all styling. Avoid inline styles or custom CSS files unless absolutely necessary for very specific, isolated cases (which should be rare).
*   **Icons**: Use icons from the `lucide-react` library.
*   **Routing**: Implement all client-side routing using `react-router-dom`. All main application routes should be defined in `src/App.tsx`.
*   **State Management & Data Fetching**: For server state and complex client-side state management, use `@tanstack/react-query`.
*   **Forms & Validation**: Use `react-hook-form` for all form handling, and `zod` for schema-based form validation.
*   **Toasts/Notifications**: Use `sonner` for displaying user-facing notifications and feedback.
*   **Date Pickers**: Use `react-day-picker` for any date selection functionality, integrated with `date-fns` for date manipulation.
*   **File Structure**:
    *   Pages should reside in `src/pages/`.
    *   Reusable UI components should be in `src/components/`.
    *   Custom React hooks should be in `src/hooks/`.
    *   Utility functions should be in `src/lib/`.
    *   Service-related logic (e.g., API interactions, data manipulation) should be in `src/services/`.
*   **Responsiveness**: All new components and features must be designed with responsiveness in mind, utilizing Tailwind CSS's responsive utilities.
*   **Error Handling**: Do not implement `try/catch` blocks for errors unless specifically requested. Errors should be allowed to bubble up for centralized handling.