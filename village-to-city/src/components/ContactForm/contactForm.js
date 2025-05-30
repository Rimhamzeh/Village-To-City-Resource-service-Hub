import React, { useState } from "react";
import { database } from "../../FireBaseConf"; 
import { FaPhoneVolume } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";
function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !message.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Incomplete Form",
      text: "Please fill in all the fields before submitting.",
    });
    return;
  }
  const lebanesePhoneRegex =/^(?:\+961|0)?(1\d{1}|3\d{1}|7[0-9]|8[1-9])?\d{6,7}$/;
      if (!lebanesePhoneRegex.test(phone.trim())) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Phone Number",
          text: "Please enter a valid phone number.",
        });
        return;
      }
       const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
          };
          if (!isValidEmail(email)) {
            Swal.fire({
              icon: "warning",
              title: "Oops...",
              text: "Please enter a valid Email!",
            });
            return;
          }
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

    Swal.fire({
      icon: "success",
      title: "Request Submitted!",
      text: "Thank you for contacting us. We'll get back to you soon.",
      timer: 2500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error submitting request: ", error);

    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: "Something went wrong. Please try again later.",
    });
  }
};
  

  return (
    <section id="ContactUs" className="contact">
      <div className="contact-container">
        <h1 className="contact-h1">Kindly review and share your feedback</h1>
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
