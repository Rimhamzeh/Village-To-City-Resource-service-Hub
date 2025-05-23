import { getAllUsers } from "../../../utils/productService";

import { useEffect, useState } from "react";
function MenuSellers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    (user.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between text-center mb-4">
        <h3>Sellers</h3>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search By Store Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive ">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>Phone Number</th>
              <th>Store Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td className="centered-cell">{user.uid}</td>
                <td className="centered-cell">{user.firstName || "-"}</td>
                <td className="centered-cell">{user.email || "-"}</td>{" "}
                
                <td className="centered-cell">{user.phone || "-"}</td>{" "}
                
                <td className="centered-cell">{user.name}</td>{" "}
               
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MenuSellers;
