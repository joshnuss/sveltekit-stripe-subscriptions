<script>
  import { PUBLIC_STRIPE_KEY } from '$env/static/public'
  import { onMount } from 'svelte'
  import { loadStripe } from '@stripe/stripe-js'
  import { Elements, PaymentElement } from 'svelte-stripe'

  export let data

  let stripe
  let elements

  $: ({ clientSecret, returnUrl } = data)

  // load Stripe client from CDN
  onMount(async () => {
    stripe = await loadStripe(PUBLIC_STRIPE_KEY)
  })

  // handle form submission
  async function submit() {
    const { error } = await stripe.confirmPayment({
      // `Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: returnUrl
      }
    })

    if (error) {
      // handle error
      console.error(error)
    }
  }
</script>

<h1>Payment</h1>

<!-- wait for stripe install to be loading -->
{#if stripe}
  <form on:submit|preventDefault={submit}>
    <Elements {stripe} {clientSecret} bind:elements>
      <PaymentElement />
    </Elements>

    <button>Pay</button>
  </form>
{:else}
  Loading Stripe...
{/if}
