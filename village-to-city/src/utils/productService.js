import {
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { database } from "../FireBaseConf";

const productsRef = collection(database, "products");
const categoriesRef = collection(database, "categories");

export const createProduct = async (productData) => {
  try {
    const docRef = await addDoc(productsRef, productData);

    await setDoc(doc(productsRef, docRef.id), {
      ...productData,
      id: docRef.id,
    });

    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error("Error adding product: ", error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(categoriesRef, categoryData);

    await setDoc(doc(categoriesRef, docRef.id), {
      ...categoryData,
      id: docRef.id,
    });

    return { id: docRef.id, ...categoryData };
  } catch (error) {
    console.error("Error adding category: ", error);
    throw error;
  }
};
export const getCategories = async () => {
  const querySnapshot = await getDocs(categoriesRef);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
export const deleteCategory = async (id) => {
  await deleteDoc(doc(categoriesRef, id));
};
export const updateCategory = async (id, categoryData) => {
  await updateDoc(doc(categoriesRef, id), categoryData);
};

export const getCategoryById = async (id) => {
  try {
    const docRef = doc(database, "categories", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.error("No such category found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw error;
  }
};
export const getAllProducts = async () => {
  try {
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products: ", error);
    throw error;
  }
};
export const fetchSpecialProducts = async () => {
  const specialQuery = query(
    collection(database, "products"),
    where("special", "==", true)
  );
  const snapshot = await getDocs(specialQuery);
  const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log("Special Products from DB:", products);
  return products;
};
export const getProductsByStore = async (storeId) => {
  try {
    const storeRef = doc(database, "users", storeId);
    const q = query(productsRef, where("storeRef", "==", storeRef));
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map((docSnap) => {
      const data = docSnap.data(); 
      return {
        id: docSnap.id,
        ...data,
        storeId: data.storeRef?.id || "",
      };
    });
    return products;
  } catch (error) {
    throw error;
  }
};
export const getProductById = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("Invalid product id");
  }
  try {
    const docRef = doc(database, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error("Error fetching product: ", error);
    throw error;
  }
};

export const updateProduct = async (productId, updatedData) => {
  try {
    const docRef = doc(database, "products", productId);
    await updateDoc(docRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating product: ", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const docRef = doc(database, "products", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error;
  }
};
export const getAllUsers = async () => {
  try {
    const usersSnapshot = await getDocs(collection(database, "users"));
    console.log("Docs found:", usersSnapshot.docs.length);
    console.log(
      "Raw snapshot:",
      usersSnapshot.docs.map((doc) => doc.data())
    );

    const users = usersSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          uid: data.uid,
          role: data.role || "",
          name: data.storeName || "",
          since: data.storeSince || "",
          storePicture: data.storePicture || "",
          address: data.location || "",
          phone: data.phoneNumber || "",
          firstName: data.firstName || "",
          storeTypeSelected: data.storeTypeSelected || "",
          email:data.email|| "",
        };
      })
      .filter((store) => store.name !== "" && store.role !== "admin");
    return users;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
};
export const getStoreById = async (storeId) => {
  try {
    const docRef = doc(database, "users", storeId); // storeId is string
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      if (data.role === "admin" || !data.storeName) {
        console.warn(`User with id ${storeId} is admin or has no store`);
        return null;
      }

      return {
        id: data.uid,
        name: data.storeName || "",
        since: data.storeSince || "",
        storePicture: data.storePicture || "",
        address: data.location || "",
        description: data.description,
        phone: data.phoneNumber || "",
        firstName: data.firstName || "",
        storeTypeSelected: data.storeTypeSelected || "",
      };
    } else {
      console.warn(`Store with id ${storeId} not found`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching store by id:", error.message);
    throw error;
  }
};
export const getUserById = async (userId) => {
  try {
    const userRef = doc(database, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
export const updateUserProfile = async (userId, updatedData) => {
  try {
    const userRef = doc(database, "users", userId);
    await updateDoc(userRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating user profile: ", error);
    throw error;
  }
};
