export const ENV = {
    roles: [
      { id: '1', name: "Admin" },
      { id: '2', name: "Seller" },
    ],
  
    api: {
      baseUrl: "https://api.myapp.com",
      firebaseProjectId: "my-firebase-project"
    },
  
    app: {
      name: "My Cool App",
      version: "1.0.0",
      enableFeatureX: true
    }
  };
  
 
  export const getRoleNameById = (id) => {
    const role = ENV.roles.find(r => r.id === id);
    return role ? role.name : 'Unknown Role';
  };

  export const isAdmin = (roleId) => {
    console.log("Checking admin status for roleId:", roleId);
    const role = ENV.roles.find(r => r.id === roleId);
    console.log("Found role:", role); 
    return role?.name === 'Admin';
  };

  