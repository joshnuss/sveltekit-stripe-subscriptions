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

## License

MIT
