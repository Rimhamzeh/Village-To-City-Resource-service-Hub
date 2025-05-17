import { useNavigate } from "react-router-dom";
import { GiVillage } from "react-icons/gi";
import { FaCity } from "react-icons/fa6";

function StoreCard({ Store }) {
  const {
    id,
    name,
    since,
    storePicture,
    address,
    phone,
    firstName,
    storeTypeSelected,
  } = Store;
  const navigate = useNavigate();

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 text-center border-dark">
        <img
          src={Store?.storePicture || "/images/StoreImage.png"}
          className="card-img-top p-3"
          alt={name}
          style={{ height: "150px", objectFit: "contain" }}
        />
        <div className="card-body">
          <p className="text-muted">Since {since || "N/A"}</p>
          <h5 className="card-title">
            <u>{name}</u>
          </h5>

          <p className="card-text">Owner: {firstName || "Unknown"}</p>
          <p className="card-text">Address: {address}</p>
          <p className="card-text">Call Us: {phone}</p>

          <p className="card-text d-flex justify-content-center align-items-center gap-2">
            {storeTypeSelected === "Village Store" ? (
              <>
                <GiVillage className="text-success" />
                Village Store
              </>
            ) : storeTypeSelected === "City Store" ? (
              <>
                <FaCity className="text-primary" />
                City Store
              </>
            ) : (
              "Type Unknown"
            )}
          </p>
        </div>
        <div className="card-footer bg-transparent border-0">
          <button
            className="btn btn-dark rounded-pill"
            onClick={() => navigate(`/StoreVisit/${Store.uid}`)}
          >
            Visit Store
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoreCard;
