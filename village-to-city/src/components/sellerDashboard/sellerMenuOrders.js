import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { database } from "../../FireBaseConf";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

function SellerMenuOrders() {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  useEffect(() => {
    const fetchSellerStoreName = async () => {
      if (!userId) return;
      const storeDoc = await getDoc(doc(database, "users", userId));
      if (storeDoc.exists()) {
        setStoreName(storeDoc.data().storeName || "Unnamed Store");
      } else {
        setStoreName("Unknown Store");
      }
    };

    fetchSellerStoreName();
  }, [userId]);

  useEffect(() => {
    const fetchOrdersForStore = async () => {
      if (!userId) return;
      setLoading(true);

      try {
        const querySnapshot = await getDocs(
          collection(database, "guestOrders")
        );
        const allOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

       

        const filteredOrders = allOrders.filter((order) =>
          order.cartProducts?.some((product) => {
            const storeRef = product.storeRef;
            if (
              storeRef &&
              storeRef._key &&
              storeRef._key.path &&
              Array.isArray(storeRef._key.path.segments)
            ) {
              const segments = storeRef._key.path.segments;
              const productStoreId = segments[segments.length - 1];
              return productStoreId === userId;
            }
            return false;
          })
        );

        setOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching orders for store:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersForStore();
  }, [userId]);

  const handleStatusChange = async (
    orderId,
    _clickedProductIndex,
    newStatus
  ) => {
    setUpdatingStatusId(`${orderId}-ALL`);
    try {
      const orderDocRef = doc(database, "guestOrders", orderId);

     
      const orderToUpdate = orders.find((order) => order.id === orderId);
      if (!orderToUpdate) return;

      const updatedCartProducts = orderToUpdate.cartProducts.map((product) => {
        let productStoreId = null;
        const storeRef = product.storeRef;
        if (
          storeRef &&
          storeRef._key &&
          storeRef._key.path &&
          Array.isArray(storeRef._key.path.segments)
        ) {
          const segments = storeRef._key.path.segments;
          productStoreId = segments[segments.length - 1];
        }

       
        if (productStoreId === userId) {
          return { ...product, status: newStatus };
        }
        return product;
      });

      
      await updateDoc(orderDocRef, { cartProducts: updatedCartProducts });

      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, cartProducts: updatedCartProducts }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Failed to update all products status from same store:",
        error
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  if (!userId)
    return (
      <p className="text-danger text-center mt-4">
        Please provide seller store ID.
      </p>
    );

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "300px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="text-center mt-4">
        <h5>
          No orders found for store:{" "}
          <span className="text-primary">{storeName}</span>
        </h5>
      </div>
    );

  return (
    <div className="p-4 bg-white border rounded shadow mt-4">
      <h3 className="mb-4">Orders for Store: {storeName}</h3>

      <table className="table table-hover table-bordered">
        <thead className="table-light">
          <tr>
            <th>Invoice No</th>
            <th>Order Time</th>
            <th>Customer Name</th>
            <th>Phone Number</th>
            <th>Payment Method</th>
            <th>Product Image</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.flatMap((order, orderIndex) =>
            order.cartProducts
              .map((product, productIndex) => {
                
                const storeRef = product.storeRef;
                if (
                  !(
                    storeRef &&
                    storeRef._key &&
                    storeRef._key.path &&
                    Array.isArray(storeRef._key.path.segments)
                  )
                ) {
                  return null;
                }
                const segments = storeRef._key.path.segments;
                const productStoreId = segments[segments.length - 1];
                if (productStoreId !== userId) return null;

               
                const customerName = `${order.buyerInfo?.firstName || ""} ${
                  order.buyerInfo?.lastName || ""
                }`.trim();
                const orderDate = order.createdAt?.toDate
                  ? order.createdAt.toDate().toLocaleString()
                  : "N/A";
                const amount = (product.price * product.quantity).toFixed(2);
                const phoneNumber = order.buyerInfo?.phone || "N/A";
                const productStatus = product.status || "Pending";

                return (
                  <tr key={`${order.id}-${productIndex}`}>
                    <td>INV-{orderIndex + 1}</td>
                    <td>{orderDate}</td>
                    <td>{customerName}</td>
                    <td>{phoneNumber}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      {product.productImage ? (
                        <img
                          src={product.productImage}
                          alt={product.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "4px",
                            marginRight: "8px",
                          }}
                        />
                      ) : (
                        <span className="text-muted">No image</span>
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>${amount}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          productStatus === "Pending"
                            ? "warning"
                            : productStatus === "Delivered"
                            ? "success"
                            : productStatus === "Processing"
                            ? "primary"
                            : "secondary"
                        }`}
                      >
                        {productStatus}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <select
                          value={productStatus}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              productIndex,
                              e.target.value
                            )
                          }
                          disabled={
                            updatingStatusId === `${order.id}-${userId}`
                          }
                          className="form-select form-select-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        {updatingStatusId === `${order.id}-${userId}` && (
                          <div
                            className="spinner-border spinner-border-sm text-primary ms-2"
                            role="status"
                          >
                            <span className="visually-hidden">Updating...</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
              .filter(Boolean)
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SellerMenuOrders;
