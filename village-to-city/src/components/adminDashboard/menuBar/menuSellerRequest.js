import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { auth, database } from "../../../FireBaseConf";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FcApproval, FcFullTrash, FcDisapprove, FcDeleteRow } from "react-icons/fc";

function MenuSellerRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmBox, setConfirmBox] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(database, "sellerRequests"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(list);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setLoading(false);
    }
  };

  const showAlert = (message, type = "success") => {
    const alertBox = document.createElement("div");
    alertBox.className = `alert alert-${type} mt-3 position-fixed top-0 start-50 translate-middle-x p-3 shadow`;
    alertBox.style.zIndex = 9999;
    alertBox.innerText = message;
    document.body.appendChild(alertBox);
    setTimeout(() => alertBox.remove(), 3000);
  };

  const confirmAction = (message, onConfirm, actionType) => {
    setConfirmBox({ message, onConfirm, actionType });
  };

  const approveRequest = (request) => {
    confirmAction(
      `Are you sure you want to approve seller "${request.email}"?`,
      async () => {
        try {
          const res = await createUserWithEmailAndPassword(
            auth,
            request.email,
            request.password
          );
          const user = res.user;

          await setDoc(doc(database, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            firstName: request.firstName,
            lastName: request.lastName,
            phoneNumber: request.phoneNumber,
            storeName: request.storeName,
            storePicture: request.storePicture,
            storeTypeSelected: request.storeTypeSelected,
            storeSince: request.storeSince,
            description: request.description,
            location: request.location,
            roleId: { id: "2", name: "Seller" },
            status: "approved",
            createdAt: new Date(),
          });

          await deleteDoc(doc(database, "sellerRequests", request.id));
          setRequests((prev) => prev.filter((r) => r.id !== request.id));
          showAlert(`🎉 Seller "${request.storeName}" approved successfully!`, "success");
        } catch (error) {
          console.error("Error approving seller:", error);
          showAlert("Failed to approve seller. See console for details.", "danger");
        }
        setConfirmBox(null);
      },
      "approve"
    );
  };

  const ignoreRequest = (id, storeName) => {
    confirmAction(
      `Ignore and delete request for "${storeName}"?`,
      async () => {
        try {
          await deleteDoc(doc(database, "sellerRequests", id));
          setRequests((prev) => prev.filter((r) => r.id !== id));
          showAlert(`Request for "${storeName}" ignored.`, "warning");
        } catch (error) {
          console.error("Ignore failed:", error);
          showAlert("Error ignoring request: " + error.message, "danger");
        }
        setConfirmBox(null);
      },
      "ignore"
    );
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">📥 Pending Seller Requests</h2>

      {confirmBox && (
        <div
          className="alert alert-warning position-fixed top-0 start-50 translate-middle-x mt-3 text-center shadow"
          style={{ zIndex: 10000, maxWidth: "600px", width: "auto" }}
        >
          <p className="mb-2">{confirmBox.message}</p>
          {confirmBox.actionType === "approve" ? (
            <button
              className="btn btn-sm btn-success me-2"
              onClick={confirmBox.onConfirm}
            >
              <FcApproval /> Confirm
            </button>
          ) : (
            <button
              className="btn btn-sm btn-danger me-2"
              onClick={confirmBox.onConfirm}
            >
              <FcFullTrash /> Delete
            </button>
          )}
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => setConfirmBox(null)}
          >
            <FcDeleteRow /> Cancel
          </button>
        </div>
      )}

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No pending seller requests.</p>
      ) : (
        requests.map((req) => (
          <div
            key={req.id}
            className="border rounded p-3 mb-3 shadow-sm bg-light"
          >
            <h5 className="mb-2">{req.storeName}</h5>
            <p><strong>Email:</strong> {req.email}</p>
            <p><strong>Owner:</strong> {req.firstName} {req.lastName}</p>
            <p><strong>Phone:</strong> {req.phoneNumber}</p>
            <p><strong>Location:</strong> {req.location}</p>
            <p><strong>Description:</strong> {req.description}</p>

            <button
              onClick={() => approveRequest(req)}
              className="btn btn-success btn-sm me-2"
            >
              <FcApproval /> Approve
            </button>
            <button
              onClick={() => ignoreRequest(req.id, req.storeName)}
              className="btn btn-danger btn-sm"
            >
              <FcDisapprove /> Ignore
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default MenuSellerRequest;
