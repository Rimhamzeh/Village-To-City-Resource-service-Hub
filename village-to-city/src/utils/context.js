import { createContext, useContext, useState, useEffect } from 'react';
import { auth, database } from '../FireBaseConf';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const MainContext = createContext();

export const MainContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('guestCart');
    if (savedCart) {
      try {
        setCartProducts(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setCartProducts([]);
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(database, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Check if roleId exists, if not, set default role
            if (!userData.roleId) {
              const defaultRole = { id: '2', name: 'Seller' };
              await updateDoc(userDocRef, {
                roleId: defaultRole
              });
              userData.roleId = defaultRole;
            }

            // Set user data in context
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userData
            });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserData = async () => {
    if (auth.currentUser) {
      const userDocRef = doc(database, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(prevUser => ({
          ...prevUser,
          ...userData
        }));
      }
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCartProducts(prevCart => {
      const existingProduct = prevCart.find(p => p.id === product.id);
      let newCart;
      
      if (existingProduct) {
        newCart = prevCart.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      } else {
        newCart = [...prevCart, { ...product, quantity }];
      }
      
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCartProducts(prevCart => {
      const newCart = prevCart.filter(p => p.id !== productId);
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateCartItemQuantity = (productId, quantity) => {
    setCartProducts(prevCart => {
      const newCart = prevCart.map(p =>
        p.id === productId ? { ...p, quantity } : p
      );
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCartProducts([]);
    localStorage.removeItem('guestCart');
  };

  return (
    <MainContext.Provider value={{
      user,
      setUser,
      loading,
      updateUserData,
      cartProducts,
      setCartProducts,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart
    }}>
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
