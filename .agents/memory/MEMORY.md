# Running Context Memory (Project: Lin Let Online Shop)

> **Goal:** High-performance E-commerce platform built with Next.js (App Router) and Supabase.

## Current Focus
Developing core e-commerce features (Search, Filter, Authentication, Orders, Reviews, and Profile Settings).

## Log

- **2026-07-09**: Implemented Search, Filtering, Authentication, Reviews, and User Profiles.
  - **Changed:** Added global search bar and sort/filter dropdowns to products page. Built order history (`/account/orders`), product reviews component (`/products/[id]`), and a dedicated profile settings page (`/account/settings`). Added database migrations for `public.users` (with auth trigger) and `public.product_reviews`, and modified the `orders` table to include `user_id`. Updated the project directory to `Lin Let`.
  - **Why:** To satisfy user requests for Search & Filtering (Feature 4), Customer Authentication & Order History (Feature 5), Reviews & Ratings (Feature 6), and a User Profile Settings page.
  - **Gotchas:** The Supabase CLI was not linked to the remote project, so database migrations (creating `users`, `product_reviews`, modifying `orders`) had to be run manually by the user in the Supabase SQL Editor via provided SQL scripts in the walkthroughs.
  - **Open threads:** None.

- **2026-07-09**: Initialized AI agent configurations.
  - **Changed:** Copied and adapted `.agents` and `.claude` directories from the previous project to fit the online-shop structure.
  - **Why:** To bootstrap the AI agent workflows and provide project-specific context.
  - **Gotchas:** None.
  - **Open threads:** Git repository name and remote setup are pending.
