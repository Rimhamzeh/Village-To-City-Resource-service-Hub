import { createUserWithEmailAndPassword,signOut, signInWithEmailAndPassword } from "firebase/auth";
import {
  setDoc,
  doc,
  query,
  collection,
  where,
  getDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { auth, database } from "./FireBaseConf";
import { isAdmin } from "./environment/environment";

export const loginAdmin = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      
      
      if (isAdmin(res.user.roleId.id)) {
      
        window.location.href = "adminDashboard";  
      } 
  
      return { success: true,user:user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
export const registerUser = async (
    firstName,
    lastName,
    phoneNumber,
    email,
    storeName,
    uploadedUrl,
    storeTypeSelected,
    storeSince,
    description,
    location,
    password
) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        const user = res.user;

        await setDoc(doc(database, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            storeName: storeName,
            storePicture: uploadedUrl,
            storeTypeSelected: storeTypeSelected,
            storeSince: storeSince,
            description: description,
            location: location,
            roleId: { id: '2', name: 'Seller' } 
        })
        console.log("Data saved to Firestore for user:", user.uid);
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message };
    }
};


export const login = async (email, password) => {

    return loginUser(email, password);
 
}


export const loginUser = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    const userDocRef = doc(database, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (!userDocSnap.exists()) {
      return {
        success: false,
        error: "User profile not found in Firestore",
      };
    }
    
    let userData = userDocSnap.data();
    
  
    if (!userData.roleId) {
      console.log("No roleId found, setting default"); 
      const defaultRole = { id: '2', name: 'Seller' };
      await updateDoc(userDocRef, {
        roleId: defaultRole
      });
      userData.roleId = defaultRole;
    }

    console.log("Final user data:", {
      uid: user.uid,
      email: user.email,
      ...userData,
    }); 

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        ...userData,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const logoutUser=async (email,password)=>{
  
    try{
          await signOut(auth)
         
          return{succes:true}
      } 
      catch(error){
          return{succes:false,error:error.message};
      }
};



export const updateArrayData = async (product) => {
  const buyer = auth.currentUser;

  const docRef = doc(database, "buyers", buyer.uid);

  try {
    await updateDoc(docRef, {
      cartProducts: arrayUnion(product),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const removeArrayData = async (product) => {
  const buyer = auth.currentUser;

  const docRef = doc(database,"buyers", buyer.uid);

  try {
    await updateDoc(docRef, {
      cartProducts: arrayRemove(product),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};















export function getFrontendErrorMessage(errorCode) {
  switch (errorCode) {
    case "Firebase: Error (auth/user-not-found).":
      return "This email is not registered, please make sure you enter a registered email.";
    case "Firebase: Error (auth/wrong-password).":
      return "The password entered is wrong. Please make sure you enter the correct password.";
    case "Firebase: Password should be at least 6 characters (auth/weak-password).":
      return "The password should be at least 6 characters.";
    case "Firebase: Error (auth/email-already-in-use).":
      return "The email address is already in use. Please use a different email.";
    case "Firebase: Error (auth/invalid-email).":
      return "Invalid email address. Please enter a valid email.";
    case "Firebase: Error (auth/weak-password).":
      return "Weak password. Please choose a stronger password.";
    case "Firebase: Error (auth/invalid-login-credentials).":
      return "Incorrect credentials, please make sure you add correct ones.";
    case "Firebase: Error (auth/operation-not-allowed).":
      return "This operation is currently not allowed. Please try again later.";
    case "Firebase: Error (auth/too-many-requests).":
      return "Too many requests, please try again in some minutes";
    default:
      return "An error occurred. Please try again.";
  }
}