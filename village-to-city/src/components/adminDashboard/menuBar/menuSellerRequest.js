import { collection, getDocs } from "firebase/firestore";
import { database } from "../../../FireBaseConf"; // adjust path if needed
import { useEffect, useState } from "react";

function MenuSellerRequest() {
  const [buyerRequests, setBuyerRequests] = useState([]);

  useEffect(() => {
    const fetchBuyerRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(database, "buyerRequests"));
        const requests = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBuyerRequests(requests);
      } catch (error) {
        console.error("Error fetching buyer requests: ", error);
      }
    };

    fetchBuyerRequests();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between text-center mb-4">
        <h3>Buyers Requests</h3>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>FIRST NAME</th>
              <th>LAST NAME</th>
              <th>EMAIL</th>
              <th>PHONE NUMBER</th>
              <th>MESSAGE</th>
              <th>REPLY</th>
            </tr>
          </thead>
          <tbody>
            {buyerRequests.map((request, index) => {
              const phoneWithoutZero = request.phone.replace(/^0+/, '');
              const messageText = `Hello ${request.firstName}, regarding your request on Village-To-City Website: ${request.message}`;
              const encodedMessage = encodeURIComponent(messageText);

              const whatsappLink = `https://wa.me/961${phoneWithoutZero}?text=${encodedMessage}`;

              return (
                <tr key={index}>
                  <td className="centered-cell">{request.id}</td>
                  <td className="centered-cell">{request.firstName}</td>
                  <td className="centered-cell">{request.lastName}</td>
                  <td className="centered-cell">
                    <strong>{request.email}</strong>
                  </td>
                  <td className="centered-cell">
                    <strong>{request.phone}</strong>
                  </td>
                  <td className="centered-cell">{request.message}</td>
                  <td className="centered-cell">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success"
                    >
                      Reply on WhatsApp
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MenuSellerRequest;
