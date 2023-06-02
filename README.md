# SvelteKit + Stripe Subscriptions

Example of using Stripe [Subscriptions](https://stripe.com/docs/api/subscriptions) & [PaymentElement](https://stripe.com/docs/payments/payment-element) with [SvelteKit](https://kit.svelte.dev).

**Note**: [Stripe Checkout](https://stripe.com/payments/checkout) is an alternative approach if you want to use pre-built payment forms. [Need help choosing?](https://dev.to/stripe/making-sense-of-stripe-checkout-payment-links-and-the-payment-element-23o5)

## Payment Flow

To complete a subscription payment:

1. The User enters their e-mail address and name. [View code](https://github.com/joshnuss/sveltekit-stripe-subscriptions/blob/main/src/routes/checkout/%2Bpage.svelte)
2. A Stripe Customer record is created and `customer.id` is stored in a cookie. [View code](https://github.com/joshnuss/sveltekit-stripe-subscriptions/blob/main/src/routes/checkout/%2Bpage.server.js)
3. A Stripe Subscription record is created based on a `priceId`. Then the Payment Intent's secret is returned. [View code](https://github.com/joshnuss/sveltekit-stripe-subscriptions/blob/main/src/routes/checkout/payment/%2Bpage.server.js)
4. The User is presented with the `<PaymentElement>` to enter their payment info. [View code](https://github.com/joshnuss/sveltekit-stripe-subscriptions/blob/91f4ba230d9aff634cf9ddd88e55804bd97a6e04/src/routes/checkout/payment/%2Bpage.svelte#L40-L42)
5. The User submits the form, and `stripe.confirmPayment()` is called. [View code](https://github.com/joshnuss/sveltekit-stripe-subscriptions/blob/91f4ba230d9aff634cf9ddd88e55804bd97a6e04/src/routes/checkout/payment/%2Bpage.svelte#L21-L27)
6. Stripe redirects the User to the thank you page. [View code](https://github.com/joshnuss/sveltekit-stripe-subscriptions/blob/main/src/routes/checkout/complete/%2Bpage.server.js)
7. Stripe sends webhook `customer.subscription.created`. [View code](https://github.com/joshnuss/sveltekit-stripe-subscriptions/blob/main/src/routes/stripe/webhooks/%2Bserver.js)

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
- `STRIPE_PRICE_ID`: The `priceId` for the subscription product. You might want to store this in your database.
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
