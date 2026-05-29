'use client';
import React from 'react'

const BookEvent = () => {
    const [email, setEmail] = React.useState("");
    const [submitted, setSubmitting] = React.useState(false);
    const handleSubmit =(e: React.FormEvent)=>{
        e.preventDefault();
        setTimeout(() => {
            setSubmitting(true)
        }, 1000);

    }

    return (
        <div id={"book-event"}>
            {submitted ? (
                <p>Thank you for booking your spot!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="email"
                           placeholder="Enter your email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           id = "email"
                    />
                    <button type="submit" className={"button-submit"} onClick={() => setSubmitting(true)}>Book Now</button>
                </form>
            )}

        </div>
    )
}
export default BookEvent
