# SvelteKit + Stripe Subscriptions

Example of using Stripe [Subscriptions](https://stripe.com/docs/api/subscriptions) & [PaymentElement](https://stripe.com/docs/payments/payment-element) with [SvelteKit](https://kit.svelte.dev).

**Note**: [Stripe Checkout](https://stripe.com/payments/checkout) is an alternative approach if you want to use pre-built payment forms. [Need help choosing?](https://dev.to/stripe/making-sense-of-stripe-checkout-payment-links-and-the-payment-element-23o5)

## Payment Flow

To complete a subscription payment:

1. [User enters their e-mail address and name](https://github.com/joshnuss/sveltekit-stripe-subscriptions/blob/main/src/routes/checkout/%2Bpage.svelte).
2. [Stripe Customer record is created and id is stored in a cookie.](https://github.com/joshnuss/sveltekit-stripe-subscriptions/blob/main/src/routes/checkout/%2Bpage.server.js)
3. [Stripe Subscription record is created based on a `priceId` and the Payment Intent's secret is returned.](https://github.com/joshnuss/sveltekit-stripe-subscriptions/blob/main/src/routes/checkout/payment/%2Bpage.server.js)
4. [User is presented with the PaymentElement to enter their payment info.](https://github.com/joshnuss/sveltekit-stripe-subscriptions/blob/820c9ae025caf5c34a6bc1e725eefa87d64e576d/src/routes/checkout/payment/%2Bpage.svelte#L40-L46)
5. [User submits form, causing `stripe.confirmPayment()` to be called.](https://github.com/joshnuss/sveltekit-stripe-subscriptions/blob/820c9ae025caf5c34a6bc1e725eefa87d64e576d/src/routes/checkout/payment/%2Bpage.svelte#L21-L32)
6. [Stripe redirects user to thank you page.](https://github.com/joshnuss/sveltekit-stripe-subscriptions/blob/main/src/routes/checkout/complete/%2Bpage.server.js)
7. [Stripe sends webhook `customer.subscription.created`.](https://github.com/joshnuss/sveltekit-stripe-subscriptions/blob/main/src/routes/stripe/webhooks/%2Bserver.js)

**Note**: Steps 6 and 7 may happen in reverse order. Make sure to provision the subscription from the thank you page **and** the webhook handler.

## Setup

Clone the repo:

```sh
gh repo clone joshnuss/sveltekit-stripe-subscriptions
```

Configure environment variables in `.env`:

```sh
cp .env.example .env
```

- `PUBLIC_STRIPE_KEY`: Your public Stripe key.
- `SECRET_STRIPE_KEY`: Your private Stripe key.
- `SECRET_STRIPE_WEBHOOK_KEY`: Stripe's secret used to sign webhooks.
- `STRIPE_PRICE_ID`: The `priceId` for the subscription product. You might want to store this in your databases.
- `DOMAIN`: The site's domain. Used for creating redirect URLs. Default is `http://localhost:5173`
  Install dependecies:

```sh
pnpm install
```

## Usage

Tunnel Stripe events:

```sh
stripe listen --forward-to localhost:5173/stripe/webhooks
```

Run the dev server:

```sh
SECRET_STRIPE_WEBHOOK_KEY=whsec_.... pnpm dev
```

## License

MIT
