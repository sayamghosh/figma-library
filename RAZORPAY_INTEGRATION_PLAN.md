# Razorpay Payment Integration Plan

## Overview

Add Razorpay payment integration for purchasing pro components with two subscription plans:
- **Plan A:** ₹99 for 100 pro components (180 days)
- **Plan B:** ₹199 for 250 pro components (180 days)

---

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend  │────▶│  Backend (API)  │────▶│    Razorpay     │
│  (React)    │     │   (Express)      │     │   (Checkout)    │
└─────────────┘     └──────────────────┘     └─────────────────┘
                           │                        ▲
                           │                        │
                           ▼                        │
                    ┌──────────────────┐            │
                    │     MongoDB      │────────────┘
                    │  (Webhooks)      │   Payment Verification
                    └──────────────────┘
```

---

## Database Schema

### Plans Collection

```javascript
{
  _id: ObjectId,
  name: String,           // "starter", "pro"
  displayName: String,    // "Pro Plan - 100 Components"
  description: String,    // "Access 100 premium components"
  price: Number,          // in paisa (9900 = ₹99)
  durationDays: Number,   // 180
  componentLimit: Number, // 100 or 250
  isActive: Boolean,
  razorpayPlanId: String, // Optional: Razorpay Recurring Plan ID
  sortOrder: Number,      // For display ordering
  features: [String],     // ["100 Components", "180 Days Access", "Priority Support"]
  createdAt: Date,
  updatedAt: Date
}
```

### Subscriptions Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // ref: User
  planId: ObjectId,           // ref: Plan
  razorpaySubscriptionId: String,
  razorpayCustomerId: String,
  status: String,             // "active", "expired", "cancelled", "pending"
  startDate: Date,
  endDate: Date,
  componentCountUsed: { type: Number, default: 0 },
  maxComponents: Number,      // From plan at time of subscription
  transactions: [ObjectId],   // ref: Transaction
  createdAt: Date,
  updatedAt: Date
}
```

### Transactions Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  subscriptionId: ObjectId,
  planId: ObjectId,
  razorpayPaymentId: String,
  razorpayOrderId: String,
  amount: Number,           // in paisa
  currency: { type: String, default: "INR" },
  status: String,           // "pending", "captured", "failed", "refunded"
  paymentMethod: String,
  signature: String,
  metadata: Object,
  errorCode: String,
  errorDescription: String,
  createdAt: Date,
  updatedAt: Date
}
```

### User Model Update

```javascript
activeSubscription: { type: ObjectId, ref: "Subscription" }
isProUser: { type: Boolean, default: false }
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/plans` | Get all active plans |
| GET | `/api/plans/:id` | Get single plan details |
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment signature (client-side) |
| POST | `/api/payments/webhook` | Razorpay webhook handler |
| GET | `/api/subscriptions/current` | Get user's active subscription |
| GET | `/api/subscriptions/history` | Get subscription/payment history |
| POST | `/api/subscriptions/cancel` | Cancel subscription |
| POST | `/api/payments/check-access` | Check if user can access pro components |

---

## Security Measures

### Payment Verification

1. **Client-side verification**: Use `Razorpay.verifyPaymentSignature()` after checkout
2. **Server-side verification**: Verify webhook signatures using HMAC SHA256
3. **Amount validation**: Server validates amount matches plan price

### Idempotency

- Store `razorpay_payment_id` with unique index
- Check for duplicate webhooks before processing
- Use MongoDB transactions for atomic operations

### Fraud Prevention

- Validate webhook signatures
- Rate limit payment endpoints (max 5 requests/minute)
- Log all payment attempts with user context
- Verify user authentication on all payment endpoints

### Webhook Security

```javascript
// Webhook signature verification
const crypto = require('crypto');
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

function verifyWebhookSignature(body, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');
  return signature === expectedSignature;
}
```

---

## Dynamic Pricing System

Plans are stored in MongoDB for runtime configuration:

```javascript
// Admin can update via API
PUT /api/admin/plans/:id
{
  "price": 14900,           // Change to ₹149
  "durationDays": 365,      // Change to 1 year
  "componentLimit": 150,    // Change component limit
  "isActive": true
}
```

### Seed Data

```javascript
[
  {
    name: "pro_starter",
    displayName: "Pro Starter",
    description: "Access 100 premium components",
    price: 9900,          // ₹99
    durationDays: 180,
    componentLimit: 100,
    features: ["100 Components", "180 Days Access", "Email Support"],
    sortOrder: 1,
    isActive: true
  },
  {
    name: "pro_ultimate",
    displayName: "Pro Ultimate",
    description: "Access 250 premium components",
    price: 19900,         // ₹199
    durationDays: 180,
    componentLimit: 250,
    features: ["250 Components", "180 Days Access", "Priority Support", "New Components Included"],
    sortOrder: 2,
    isActive: true
  }
]
```

---

## Implementation Phases

### Phase 1: Setup & Models
- [ ] Install `razorpay` npm package
- [ ] Create Plan model
- [ ] Create Subscription model
- [ ] Create Transaction model
- [ ] Update User model with subscription fields
- [ ] Seed initial plans

### Phase 2: Backend API
- [ ] Create plan routes & controllers
- [ ] Implement `create-order` endpoint
- [ ] Implement `verify` endpoint
- [ ] Set up webhook handler
- [ ] Add subscription management endpoints
- [ ] Add `check-access` endpoint

### Phase 3: Frontend
- [ ] Create Pricing Plans UI component
- [ ] Integrate Razorpay Checkout modal
- [ ] Add subscription status display
- [ ] Create upgrade/cancel flow
- [ ] Add success/failure pages

### Phase 4: Security & Testing
- [ ] Test webhook locally (ngrok)
- [ ] Verify signature handling
- [ ] Test duplicate webhook handling
- [ ] Add error handling & retry logic
- [ ] Add rate limiting

---

## Environment Variables

### Backend (.env)
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxx
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

---

## Razorpay Dashboard Setup

1. Create Razorpay account (test mode for development)
2. Generate API Keys:
   - Settings → API Keys → Generate Key
   - Copy Key ID and Key Secret
3. Set up Webhook:
   - Settings → Webhooks → Add Webhook
   - URL: `https://your-domain.com/api/payments/webhook`
   - Events: `payment.captured`, `subscription.activated`, `subscription.cancelled`
4. Enable Test Mode for development

---

## Pro Component Access Flow

```
User Clicks "Subscribe"
        │
        ▼
Display Plan Selection Modal
        │
        ▼
User Selects Plan → Click "Pay ₹XX"
        │
        ▼
Create Order API → Get razorpay_order_id
        │
        ▼
Open Razorpay Checkout Modal
        │
        ▼
User Completes Payment
        │
        ├──────────────────┐
        ▼                  ▼
    Success              Failure
        │                  │
        ▼                  ▼
Verify Signature      Show Error
        │                 Message
        ▼
Webhook: payment.captured
        │
        ▼
Create/Update Subscription
        │
        ▼
Return Success → Show Confirmation
```

---

## Component Access Logic

```javascript
async function canAccessProComponent(userId, componentId) {
  const user = await User.findById(userId);
  const component = await Component.findById(componentId);

  // Check if component is pro
  if (!component.isPro) return true;

  // Check subscription
  const subscription = await Subscription.findOne({
    userId: user._id,
    status: "active",
    endDate: { $gt: new Date() }
  });

  if (!subscription) return false;

  // Check component limit
  if (subscription.componentCountUsed >= subscription.maxComponents) {
    return false;
  }

  return true;
}
```

---

## Error Handling

| Error Code | Description | User Message |
|------------|-------------|--------------|
| PAYMENT_FAILED | Payment was declined | "Payment failed. Please try again." |
| SUBSCRIPTION_EXISTS | User already has active subscription | "You already have an active subscription" |
| PLAN_NOT_FOUND | Invalid plan ID | "Plan not found" |
| AMOUNT_MISMATCH | Price changed during checkout | "Price has changed. Please try again." |
| INVALID_SIGNATURE | Payment signature verification failed | "Payment verification failed" |

---

## Testing Checklist

- [ ] Create order with valid plan
- [ ] Verify payment with valid signature
- [ ] Verify payment with invalid signature (should fail)
- [ ] Handle duplicate webhook (idempotency)
- [ ] Access pro component with active subscription
- [ ] Deny access when subscription expired
- [ ] Deny access when component limit reached
- [ ] Cancel subscription flow
- [ ] Rate limiting on payment endpoints