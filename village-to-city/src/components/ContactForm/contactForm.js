import React, { useState } from "react";
import { database } from "../../FireBaseConf"; 
import { FaPhoneVolume } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await addDoc(collection(database, "buyerRequests"), {
        firstName,
        lastName,
        email,
        phone,
        message,
        requestDate: serverTimestamp(),
      });
  
     
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setMessage("");
  
      alert("Your request has been submitted!");
    } catch (error) {
      console.error("Error submitting request: ", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <section id="ContactUs" className="contact">
      <div className="contact-container">
        <h1 className="contact-h1">Feel free to contact us for any question</h1>
        <div className="contact-info">
          <div className="contact-left">
            <h4 className="contact-phone_h3">
              <FaPhoneVolume /> <strong>Phone Number</strong>
            </h4>
            <p className="contact-phone_p">79-563789</p>
            <h4>
              <MdEmail /> <strong>Email Address</strong>
            </h4>
            <p className="contact-phone_p">villagetocity12@gmail.com</p>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
              <div className="input-pair">
                <div className="input-container">
                  <label className="input-label">First Name</label>
                  <input
                    type="text"
                    className="contact-input"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="last-name" className="input-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="contact-input"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-pair">
                <div className="input-container">
                  <label htmlFor="email" className="input-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="contact-input"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="phone" className="input-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="contact-input"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-container">
                <label htmlFor="message" className="input-label">
                  Your Message
                </label>
                <textarea
                  id="message"
                  className="contact-textarea"
                  placeholder="Enter your message"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="contact-submit">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
