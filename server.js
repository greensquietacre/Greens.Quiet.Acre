const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { name, email, phone, checkin, checkout } = req.body;

  const nights = Math.ceil(
    (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)
  );

  let amount = 60000; // default monthly
  let description = `Monthly stay for ${name}`;

  if (nights <= 14) {
    amount = nights * 4000;
    description = `${nights} night stay for ${name}`;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'RV Site Reservation',
            description,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://www.greensquietacre.com?success=true',
      cancel_url: 'https://www.greensquietacre.com?canceled=true',
      metadata: {
        name,
        phone,
        checkin,
        checkout,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
