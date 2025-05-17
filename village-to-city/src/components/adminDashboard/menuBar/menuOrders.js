import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { database } from "../../../FireBaseConf";
import { useParams } from "react-router-dom";
function MenuOrders() {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [storeNames, setStoreNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  
  useEffect(() => {
    const fetchOrdersAndStores = async () => {
      setLoading(true);
      try {
        const ordersSnapshot = await getDocs(collection(database, "guestOrders"));
        const fetchedOrders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders);

        
        const uniqueStoreIds = new Set();
        fetchedOrders.forEach((order) => {
          order.cartProducts?.forEach((product) => {
            const storeRef = product.storeRef;
            if (
              storeRef &&
              storeRef._key &&
              storeRef._key.path &&
              Array.isArray(storeRef._key.path.segments)
            ) {
              const segments = storeRef._key.path.segments;
              const storeId = segments[segments.length - 1];
              uniqueStoreIds.add(storeId);
            }
          });
        });

        
        const fetchedStoreNames = {};
        await Promise.all(
          Array.from(uniqueStoreIds).map(async (storeId) => {
            const storeDoc = await getDoc(doc(database, "users", storeId));
            fetchedStoreNames[storeId] = storeDoc.exists()
              ? storeDoc.data().storeName || "Unnamed Store"
              : "Unknown Store";
          })
        );
        setStoreNames(fetchedStoreNames);
      } catch (error) {
        console.error("Error loading orders or stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndStores();
  }, []);

  
  const handleStatusChange = async (orderId, productIndex, newStatus) => {
  setUpdatingStatusId(`${orderId}-ALL`);
  try {
    const orderDocRef = doc(database, "guestOrders", orderId);

   
    const orderToUpdate = orders.find((order) => order.id === orderId);
    if (!orderToUpdate) return;

   
    const targetProduct = orderToUpdate.cartProducts[productIndex];
    let targetStoreId = null;
    const storeRef = targetProduct.storeRef;
    if (
      storeRef &&
      storeRef._key &&
      storeRef._key.path &&
      Array.isArray(storeRef._key.path.segments)
    ) {
      const segments = storeRef._key.path.segments;
      targetStoreId = segments[segments.length - 1];
    }

    if (!targetStoreId) return;

   
    const updatedCartProducts = orderToUpdate.cartProducts.map((product) => {
      let productStoreId = null;
      const pStoreRef = product.storeRef;
      if (
        pStoreRef &&
        pStoreRef._key &&
        pStoreRef._key.path &&
        Array.isArray(pStoreRef._key.path.segments)
      ) {
        const segments = pStoreRef._key.path.segments;
        productStoreId = segments[segments.length - 1];
      }

      if (productStoreId === targetStoreId) {
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
    console.error("Failed to update product status:", error);
  } finally {
    setUpdatingStatusId(null);
  }
};


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center mt-4">
        <h5>No orders found.</h5>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border rounded shadow mt-4">
      <h3 className="mb-4">All Orders</h3>

      <table className="table table-hover table-bordered">
        <thead className="table-light">
          <tr>
            <th>Invoice No</th>
            <th>Order Time</th>
            <th>Customer Name</th>
            <th>Phone Number</th>
            <th>Payment Method</th>
            <th>Store Name</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.flatMap((order, orderIndex) =>
            order.cartProducts.map((product, productIndex) => {
              const customerName = `${order.buyerInfo?.firstName || ""} ${order.buyerInfo?.lastName || ""}`.trim();
              const orderDate = order.createdAt?.toDate
                ? order.createdAt.toDate().toLocaleString()
                : "N/A";
              const amount = (product.price * product.quantity).toFixed(2);
              const phoneNumber = order.buyerInfo?.phone || "N/A";
              const productStatus = product.status || "Pending";

            
              let storeId = null;
              const storeRef = product.storeRef;
              if (
                storeRef &&
                storeRef._key &&
                storeRef._key.path &&
                Array.isArray(storeRef._key.path.segments)
              ) {
                const segments = storeRef._key.path.segments;
                storeId = segments[segments.length - 1];
              }
              const storeName = storeId ? storeNames[storeId] || "Unknown Store" : "Unknown Store";

              return (
                <tr key={`${order.id}-${productIndex}`}>
                  <td>INV-{orderIndex + 1}</td>
                  <td>{orderDate}</td>
                  <td>{customerName}</td>
                  <td>{phoneNumber}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{storeName}</td>
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
                    <select
                      value={productStatus}
                      onChange={(e) =>
                        handleStatusChange(order.id, productIndex, e.target.value)
                      }
                      disabled={updatingStatusId === `${order.id}-${productIndex}`}
                      className="form-select form-select-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MenuOrders;
