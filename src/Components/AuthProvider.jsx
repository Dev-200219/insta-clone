import { createContext, useEffect, useState } from "react";
import { auth, firestore } from "../firebase";

export const userContext = createContext();

let AuthProvider = (props) => {
  let [user, setUser] = useState(null);
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        let { uid, displayName, email, photoURL } = user;
        console.log(user);

        let docRef = firestore.collection("users").doc(uid);
        let documentSnapshot = await docRef.get();

        if (!documentSnapshot.exists) {
          docRef.set({
            uid,
            displayName,
            photoURL,
          });
        }

        setUser({
          displayName,
          uid,
          email,
          photoURL,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <>
      <userContext.Provider value={user}>
        {!loading && props.children}
      </userContext.Provider>
    </>
  );
};

export default AuthProvider;
