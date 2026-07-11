# Multi-Vendor Marketplace Feature Design

## Overview
Transforming Yoe Yar Zay into a Multi-Vendor Marketplace (similar to Shopee/Lazada) with clear role separations.

## Current State
Currently, the application has a unified `/admin/login` portal. Since role-based access control is not yet fully implemented, anyone logging into the portal has "Super Admin" privileges and can see, edit, or delete all products, categories, and orders across the entire platform. It does not yet restrict a seller to only see their own products.

## Target Roles & Separations

1. **Platform Admin (Super Admin)**
   - **Dashboard Location:** `/admin`
   - **Capabilities:**
     - Approve/Reject new seller registrations.
     - Manage global site settings (Categories, Platform fees, Banners, Homepage layouts).
     - Oversee all orders, transactions, and users on the platform.
     - Enforce security and policy compliance.

2. **Seller**
   - **Dashboard Location:** `/seller` (or a restricted view within `/admin`)
   - **Capabilities:**
     - Log into a distinct "Seller Dashboard".
     - Manage **only their own** products, inventory, and pricing.
     - View and fulfill **only their own** customer orders.
     - Track their individual shop analytics and revenue.

3. **Buyer (Customer)**
   - **Location:** Main storefront (e.g., `/`, `/products`, `/cart`)
   - **Capabilities:**
     - Browse products from multiple sellers.
     - Add items to cart (potentially splitting orders by seller during checkout).
     - Track order history.
     - Leave product reviews.

## Open Questions for Development
- Do we want to build a completely separate UI for the Seller Dashboard (e.g., `/seller/dashboard`), or use the existing `/admin` UI but hide features/filter data based on the user's role in the database?
- How should the checkout process handle a cart that contains products from multiple different sellers? (Split into multiple orders?)
- What is the registration flow for a new seller? (Do they need admin approval, or is it instant?)

## Next Steps
- Await user feedback on the exact Multi-Vendor structure they prefer.
- Address the missing function-level authorization (identified in the API Security Scan) by implementing a robust `role` check (`admin`, `seller`, `buyer`) across Server Actions.
