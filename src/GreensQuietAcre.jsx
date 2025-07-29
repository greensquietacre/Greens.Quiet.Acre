import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51RqGTvBEW9j8HbgOcHVJD7KdThjN6OjhQJQ5OPFjDRdyuPF7Hcp65Bfekx6Q9RF9VTuo616XewzJ16y9hRqW4mVc00wKctfX8w");

export default function GreensQuietAcre() {
  const [bookingInfo, setBookingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    checkin: "",
    checkout: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    const stripe = await stripePromise;
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingInfo)
    });
    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h1>Green’s Quiet Acre</h1>
      <p>Quiet stays in the heart of Osceola</p>
      <h2>Book Your Stay</h2>
      <input name="name" placeholder="Name" onChange={handleInputChange} /><br />
      <input name="email" placeholder="Email" onChange={handleInputChange} /><br />
      <input name="phone" placeholder="Phone" onChange={handleInputChange} /><br />
      <input type="date" name="checkin" placeholder="Check-In" onChange={handleInputChange} /><br />
      <input type="date" name="checkout" placeholder="Check-Out" onChange={handleInputChange} /><br />
      <button onClick={handleBooking}>Pay & Book</button>
    </div>
  );
}
