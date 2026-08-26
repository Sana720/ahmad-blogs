# PayPal + License Key System

## 1. Project Overview

Build a custom payment and license-management system for the Chrome extension.

**Note:** This system will be integrated directly into the existing `ahmad-blogs` Next.js (App Router) codebase, utilizing the existing Firebase/Firestore setup, Tailwind CSS styling, and project structure.

The system will replace Gumroad for payment processing while providing the same core functionality:

* PayPal checkout
* Monthly / Yearly / Lifetime plans
* Automatic payment verification
* Unique license-key generation
* License activation
* Device/browser binding
* License validation from the Chrome extension
* Refund handling
* Customer/license management
* Admin dashboard
* Email delivery of license keys

### Recommended Stack

* **Frontend:** Next.js
* **Backend:** Next.js API Routes / Route Handlers
* **Database:** Firebase / Firestore
* **Payment:** PayPal REST API + PayPal JavaScript SDK
* **Extension:** Chrome Extension
* **Email:** Resend / SMTP
* **Hosting:** Vercel
* **Authentication:** Admin authentication for dashboard

---

# 2. High-Level Architecture

```text
                    ┌───────────────────┐
                    │     Customer      │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ ahmad-blogs Nextjs│
                    │                   │
                    │ Pricing / Checkout│
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ PayPal Checkout   │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ PayPal API        │
                    └─────────┬─────────┘
                              │
                       Payment Success
                              │
                              ▼
                    ┌───────────────────┐
                    │ ahmad-blogs API   │
                    └─────────┬─────────┘
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
        ┌─────────────────┐       ┌─────────────────┐
        │ Firebase        │       │ Email Service   │
        │                 │       │                 │
        │ Orders          │       │ License Email   │
        │ Licenses        │       └─────────────────┘
        │ Customers       │
        └────────┬────────┘
                 │
                 ▼
        ┌───────────────────┐
        │ Chrome Extension  │
        │                   │
        │ Enter License Key │
        └─────────┬─────────┘
                  │
                  ▼
        ┌──────────────────────┐
        │ License API          │
        │                      │
        │ Validate             │
        │ Activate             │
        │ Deactivate           │
        └──────────────────────┘
```

---

# 3. Plans

Initial plans:

| Plan     | Price |  Duration |
| -------- | ----: | --------: |
| Monthly  | $1.99 |   30 days |
| Yearly   | $4.99 |  365 days |
| Lifetime | $9.99 | No expiry |

Plans are fully dynamic and tied to specific products (`productId`). Admins will create, edit, and configure pricing for these plans dynamically via the Admin Dashboard. A single product can have multiple associated plans (e.g., Monthly, Yearly, Lifetime).

---

# 4. PayPal Integration

## 4.1 PayPal Account

Create a PayPal Business account and PayPal Developer application.

Extend existing admin dashboard:

* Sandbox application
* Production application

Store:

```env
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENVIRONMENT=sandbox
```

Production:

```env
PAYPAL_ENVIRONMENT=production
```

Never expose:

```text
PAYPAL_CLIENT_SECRET
```

to the frontend or Chrome extension.

---

# 5. PayPal Checkout

## Frontend

Pricing page:

```text
Monthly
$1.99

[Buy Now]
```

```text
Yearly
$4.99

[Buy Now]
```

```text
Lifetime
$9.99

[Buy Now]
```

PayPal JavaScript SDK displays the PayPal checkout button.

---

# 6. Create PayPal Order

API:

```text
POST /api/paypal/create-order (Route Handler in src/app/api/paypal/create-order/route.ts)
```

Request:

```json
{
  "planId": "lifetime"
}
```

Backend:

1. Validate plan.
2. Get price from database/config.
3. Authenticate with PayPal.
4. Create PayPal order.
5. Return PayPal Order ID.

Example:

```json
{
  "orderId": "PAYPAL_ORDER_ID"
}
```

---

# 7. Capture Payment

API:

```text
POST /api/paypal/capture-order
```

Request:

```json
{
  "orderId": "PAYPAL_ORDER_ID"
}
```

Backend:

1. Send capture request to PayPal.
2. Verify response.
3. Confirm payment status.
4. Extract transaction information.
5. Save order.
6. Generate license.
7. Return success.

---

# 8. Important Payment Security

Do **not** generate a license simply because the customer reaches:

```text
/success
```

The backend must verify the actual PayPal transaction.

The system should verify:

```text
PayPal Order ID
Payment status
Amount
Currency
Plan
Transaction ID
```

The expected amount must match the selected plan.

Example:

```text
User selects Lifetime

Expected:
$9.99 USD

PayPal reports:
$9.99 USD

→ Valid
```

If PayPal reports:

```text
$0.99
```

the system must reject fulfillment.

---

# 9. Firestore Collections

## 9.1 `plans`

```text
plans
├── id
├── productId
├── name
├── slug
├── price
├── currency
├── durationDays
├── lifetime
├── active
├── maxDevices
├── createdAt
└── updatedAt
```

Example:

```json
{
  "name": "Lifetime",
  "slug": "lifetime",
  "price": 9.99,
  "currency": "USD",
  "durationDays": null,
  "lifetime": true,
  "active": true,
  "maxDevices": 1
}
```

---

# 10. `orders`

```text
orders
├── id
├── paypalOrderId
├── paypalTransactionId
├── customerEmail
├── customerName
├── productId
├── planId
├── amount
├── currency
├── paymentStatus
├── paypalStatus
├── licenseId
├── createdAt
└── updatedAt
```

Payment statuses:

```text
PENDING
COMPLETED
FAILED
REFUNDED
CANCELLED
```

---

# 11. `licenses`

```text
licenses
├── id
├── key
├── productId
├── planId
├── orderId
├── customerEmail
├── status
├── activated
├── activationCount
├── maxDevices
├── expiresAt
├── createdAt
├── updatedAt
└── revokedAt
```

Statuses:

```text
ACTIVE
EXPIRED
REVOKED
REFUNDED
SUSPENDED
```

---

# 12. License Key Generation

Generate a cryptographically random license.

Example:

```text
CPLP-7K9D-X82M-PQ41
```

Another:

```text
CPLP-A82F-K91P-X7QD
```

Requirements:

* Random
* Unpredictable
* Unique
* Database unique index
* Not based on PayPal order ID
* Not generated inside the Chrome extension

---

# 13. License Activation

Chrome extension screen:

```text
┌─────────────────────────────┐
│      Chrome Profile Lock    │
│                             │
│ Enter License Key           │
│                             │
│ [ CPLP-XXXX-XXXX-XXXX ]     │
│                             │
│       [ Activate ]           │
└─────────────────────────────┘
```

API:

```text
POST /api/license/activate
```

Request:

```json
{
  "licenseKey": "CPLP-XXXX-XXXX-XXXX",
  "deviceId": "DEVICE_ID"
}
```

Backend checks:

1. License exists.
2. License is active.
3. License isn't expired.
4. License isn't refunded.
5. License isn't revoked.
6. Device limit hasn't been exceeded.

---

# 14. Device Activation

Recommended initial configuration:

```text
Lifetime → 1 device
Yearly   → 1 device
Monthly  → 1 device
```

Can be changed later.

Database:

```text
activations
├── id
├── licenseId
├── deviceId
├── browserId
├── activatedAt
├── lastSeenAt
└── status
```

---

# 15. License Validation

API:

```text
POST /api/license/validate
```

Request:

```json
{
  "licenseKey": "CPLP-XXXX-XXXX-XXXX",
  "deviceId": "DEVICE_ID"
}
```

Response:

```json
{
  "valid": true,
  "plan": "lifetime",
  "expiresAt": null
}
```

Invalid:

```json
{
  "valid": false,
  "reason": "LICENSE_EXPIRED"
}
```

---

# 16. Do Not Validate Only Locally

The Chrome extension should **not** contain the entire license database or license-verification algorithm.

Bad:

```text
Extension
   ↓
Local validation
   ↓
Unlock
```

Recommended:

```text
Extension
   ↓
HTTPS
   ↓
Your License API
   ↓
Firestore
   ↓
Validation
```

This makes license abuse considerably harder.

---

# 17. License Caching

The extension can temporarily cache successful validation.

Example:

```text
Successful validation
        ↓
Cache validation
        ↓
Extension continues working
        ↓
Periodic server validation
```

This prevents the extension from breaking immediately during a temporary network outage.

---

# 18. PayPal Webhooks

Extend existing admin dashboard:

```text
POST /api/paypal/webhook
```

Register the webhook inside PayPal.

Important events include successful payment and refund-related events.

Example:

```text
PAYMENT.CAPTURE.COMPLETED
          ↓
       Payment
          ↓
    License Active
```

Refund:

```text
PAYMENT.CAPTURE.REFUNDED
          ↓
     Find Order
          ↓
    Find License
          ↓
    Revoke License
```

Webhook messages must be verified before processing.

---

# 19. Prevent Duplicate Licenses

Webhooks can potentially be delivered more than once.

Therefore:

```text
paypalTransactionId
```

must have a unique index.

Before generating a license:

```text
Does transaction already exist?
       │
   ┌───┴───┐
  YES      NO
   │        │
Ignore    Create
```

This prevents accidental generation of multiple licenses for one payment.

---

# 20. Customer Email

After successful payment:

```text
Payment completed
       ↓
License generated
       ↓
Email customer
```

Email:

```text
Subject:
Your Chrome Profile Lock License

Your payment was successful.

Plan:
Lifetime

License Key:
CPLP-XXXX-XXXX-XXXX

Enter this license key in the Chrome extension to activate Pro features.
```

Use:

* Resend (https://resend.com)

---

# 21. Success Page

After payment:

```text
/payment/success
```

Display:

```text
Payment Successful 🎉

Thank you for your purchase.

Plan:
Lifetime

License Key:

CPLP-XXXX-XXXX-XXXX

[Copy License]

A copy of your license has also been sent to your email.
```

Do not trust query parameters for license information.

The page should retrieve the order/license from your backend.

---

# 22. Failed Payment

Page:

```text
/payment/failed
```

Display:

```text
Payment was not completed.

No license has been generated.

[Try Again]
```

---

# 23. Admin Dashboard

Extend existing admin dashboard:

```text
/admin
```

Dashboard:

```text
Total Orders
Total Revenue
Active Licenses
Expired Licenses
Refunded Orders
```

---

# 24. Admin Orders

Table:

```text
Order ID
Customer
Plan
Amount
PayPal Transaction
Status
License
Date
```

Actions:

```text
View
Resend License
Refund Status
View License
```

---

# 25. Admin License Management

Admin can:

```text
Search license
Search email
Search transaction
```

Actions:

```text
Activate
Deactivate
Revoke
Reset Device
Extend Expiry
Change Device Limit
```

---

# 26. Reset Device

Customer changes computer/browser.

Admin can:

```text
Reset Activation
```

Then:

```text
Old Device
    ↓
Removed

New Device
    ↓
Can activate
```

Later, this can also be exposed through a customer portal.

---

# 27. Customer Portal — Optional Phase 2

Customer enters email/license.

Can see:

```text
Plan
License
Activation
Expiry
Devices
Payment history
```

Actions:

```text
Deactivate device
Reactivate
Download invoice
```

---

# 28. API Structure

Recommended:

```text
/api/paypal/create-order (Route Handler in src/app/api/paypal/create-order/route.ts)
/api/paypal/capture-order
/api/paypal/webhook

/api/license/activate
/api/license/validate
/api/license/deactivate

/api/customer/order
/api/customer/license

/api/admin/orders
/api/admin/licenses
/api/admin/licenses/revoke
/api/admin/licenses/reset-device
```

---

# 29. Security Requirements

## Backend

* HTTPS only
* Validate all API input
* Rate-limit license APIs
* Rate-limit activation attempts
* Never expose PayPal secret
* Never expose Firebase admin credentials
* Verify PayPal webhooks
* Validate PayPal amount
* Validate currency
* Validate transaction status
* Use unique database indexes
* Log important payment events

## Chrome Extension

Never store:

```text
PAYPAL_CLIENT_SECRET
FIREBASE_PROJECT_ID
ADMIN_SECRET
```

inside the extension.

---

# 30. Environment Variables

```env
FIREBASE_PROJECT_ID=

PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENVIRONMENT=sandbox

PAYPAL_WEBHOOK_ID=

NEXT_PUBLIC_PAYPAL_CLIENT_ID=

LICENSE_SECRET=

RESEND_API_KEY=
EMAIL_FROM=
```

Production values should be configured through Vercel Environment Variables.

---

# 31. Deployment

### Website/API

```text
Next.js
   ↓
Vercel
```

### Database

```text
Firebase
```

### Payment

```text
PayPal
```

### Extension

```text
Chrome Web Store
```

Architecture:

```text
Chrome Extension
       │
       ▼
Vercel / Next.js
       │
 ┌─────┴─────┐
 ▼           ▼
Firestore     PayPal
```

---

# 32. Development Phases

## Phase 1 — Database

* [ ] Reuse existing Firebase project & Firestore database setup ( & )
* [ ] Create plans collection
* [ ] Create orders collection
* [ ] Create licenses collection
* [ ] Create activations collection
* [ ] Add unique indexes

## Phase 2 — PayPal Sandbox

* [ ] Create PayPal Developer application
* [ ] Configure sandbox
* [ ] Add Client ID
* [ ] Add Client Secret
* [ ] Implement OAuth
* [ ] Create order API
* [ ] Capture order API
* [ ] Test sandbox payment

## Phase 3 — License System

* [ ] Generate unique license
* [ ] Save license
* [ ] Associate license with order
* [ ] Implement activation
* [ ] Implement validation
* [ ] Implement device limits
* [ ] Implement expiry

## Phase 4 — Webhooks

* [ ] Create webhook endpoint
* [ ] Verify webhook signature
* [ ] Process payment completion
* [ ] Prevent duplicate processing
* [ ] Process refunds
* [ ] Revoke refunded licenses

## Phase 5 — Email

* [ ] Configure email provider
* [ ] Create license email template
* [ ] Send license after payment
* [ ] Add resend functionality

## Phase 6 — Website

* [ ] Pricing page
* [ ] PayPal buttons
* [ ] Checkout page
* [ ] Success page
* [ ] Failed-payment page
* [ ] License display
* [ ] Copy license button

## Phase 7 — Chrome Extension

* [ ] Add license activation screen
* [ ] Generate device ID
* [ ] Connect to activation API
* [ ] Connect to validation API
* [ ] Implement local validation cache
* [ ] Lock Pro features when invalid
* [ ] Handle expired licenses
* [ ] Handle revoked licenses

## Phase 8 — Admin

* [ ] Admin authentication
* [ ] Dashboard
* [ ] Orders
* [ ] Licenses
* [ ] Customers
* [ ] Revoke license
* [ ] Reset device
* [ ] Resend license

## Phase 9 — Production

* [ ] Create PayPal production app
* [ ] Configure production credentials
* [ ] Configure webhook
* [ ] Configure Vercel environment variables
* [ ] Test production checkout
* [ ] Test license generation
* [ ] Test refund flow
* [ ] Test Chrome extension activation
* [ ] Enable production payments

---

# 33. Final Customer Flow

```text
Customer sees your website
          ↓
Selects Lifetime $9.99
          ↓
Clicks PayPal
          ↓
Logs into PayPal
          ↓
Pays
          ↓
PayPal confirms payment
          ↓
Your backend verifies payment
          ↓
Unique license generated
          ↓
License stored in Firestore
          ↓
License emailed to customer
          ↓
Customer opens extension
          ↓
Enters license
          ↓
Server validates license
          ↓
Device activated
          ↓
PRO features unlocked
```

---

# 34. Recommended MVP

For the **first version**, don't build everything.

Build only:

```text
PayPal
+
3 Plans
+
Firestore
+
License Generation
+
License Activation
+
License Validation
+
1 Device
+
Email License
+
PayPal Webhook
+
Basic Admin
```

Then add customer portal, device management, invoices, analytics, etc. in Phase 2.

This will give you a **Gumroad-like payment → automatic license delivery → Chrome extension activation system**, but with your own database and complete control over the licenses.
