import { createUserWithEmailAndPassword,signOut, signInWithEmailAndPassword } from "firebase/auth";
import { query,getDocs,where,setDoc,addDoc,collection,doc,getDoc,updateDoc,arrayUnion,arrayRemove,} from "firebase/firestore";

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
  firstName, lastName, phoneNumber, email, storeName,
  storePicture, storeTypeSelected, storeSince, description,
  location, password
) => {
  try {
    await addDoc(collection(database, "sellerRequests"), {
      firstName,
      lastName,
      phoneNumber,
      email,
      storeName,
      storePicture,
      storeTypeSelected,
      storeSince,
      description,
      location,
      password, 
     status: "pending",
    });

    return { success: true };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, error: error.message };
  }
};


export const login = async (email, password) => {

    return loginUser(email, password);
 
}





export const loginUser = async (email, password) => {
  try {
    
    const usersRef = collection(database, "users");
    const userQuery = query(usersRef, where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
    
      const requestsRef = collection(database, "sellerRequests");
      const requestQuery = query(
        requestsRef,
        where("email", "==", email),
        where("status", "==", "pending")
      );
      const requestSnapshot = await getDocs(requestQuery);

      if (!requestSnapshot.empty) {
       
        return { success: false, error: "Your account is pending approval." };
      } else {
       
        return { success: false, error: "User not found. Please register first." };
      }
    }

   
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;

   
    const userDoc = userSnapshot.docs[0];
    return { success: true, user: userDoc.data() };
  } catch (error) {
    console.error("Firebase login error:", error);
    return { success: false, error: error.message };
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















export function getFrontendErrorMessage(errorCodeOrMessage) {

  const errorCodeMatch = errorCodeOrMessage?.match(/\(auth\/[a-z-]+\)/);
  const errorCode = errorCodeMatch ? errorCodeMatch[0].slice(1, -1) : errorCodeOrMessage;

  switch (errorCode) {
    case "auth/user-not-found":
      return "This email is not registered, please make sure you enter a registered email.";
    case "auth/wrong-password":
      return "The password entered is wrong. Please make sure you enter the correct password.";
    case "auth/weak-password":
      return "The password should be at least 6 characters.";
    case "auth/email-already-in-use":
      return "The email address is already in use. Please use a different email.";
    case "auth/invalid-email":
      return "Invalid email address. Please enter a valid email.";
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/operation-not-allowed":
      return "This operation is currently not allowed. Please try again later.";
    case "auth/too-many-requests":
      return "Too many requests, please try again in some minutes.";
    default:
      return "An error occurred. Please try again.";
  }
}
