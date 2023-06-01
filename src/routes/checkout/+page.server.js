import { stripe } from '$lib/stripe'
import { redirect } from '@sveltejs/kit'

export const actions = {
  // default form action
  default: async ({ request, cookies }) => {
    // get the form
    const form = await request.formData()

    /* Create the customer
     *
     * https://stripe.com/docs/api/customers/create
     */
    const customer = await stripe.customers.create({
      email: form.get('email'),
      name: form.get('name')
    })

    // set the cookie
    cookies.set('customerId', customer.id)

    // redirect to collect payment
    throw redirect(303, '/checkout/payment')
  }
}
