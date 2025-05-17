import { useEffect, useState } from "react";
import ProductTable from "../Shared/productTable";
import { useMainContext } from "../../utils/context";

function ManageProducts() {
  const { user } = useMainContext();
  
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ProductTable userRole="seller" sellerId={user.uid} />
    </div>
  );
}

export default ManageProducts;