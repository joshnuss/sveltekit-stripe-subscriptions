# SvelteKit + Stripe Subscriptions

Example of using [Stripe PaymentElement](https://stripe.com/docs/payments/payment-element) with [SvelteKit](https://kit.svelte.dev).

**Note**: [Stripe Checkout](https://stripe.com/payments/checkout) is an alternative approach

## Payment Flow

To complete a subscription payment:

1. User enters their e-mail address and name.
2. Stripe Customer record is created and id is stored in a cookie.
3. Stripe Subscription record is created based on a `priceId` and the Payment Intent's secret is returned.
4. User is presented with the PaymentElement to enter their payment info.
5. User submits form, causing `stripe.confirmPayment()` to be called.
6. Stripe redirects user to thank you page.
7. Stripe sends webhook `customer.subscription.created`.

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

Run the dev server:

```sh
pnpm dev
```

## License

MIT
