import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  QueryConstraint
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

export const useFirestoreCollection = <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    const userConstraint = where("userId", "==", user.uid);
    const q = query(
      collection(db, collectionName),
      userConstraint,
      ...constraints
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore timestamps to JavaScript dates
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
          expiryDate: doc.data().expiryDate?.toDate?.() || doc.data().expiryDate,
          plannedDate: doc.data().plannedDate?.toDate?.() || doc.data().plannedDate,
        })) as T[];
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user, collectionName]);

  const addItem = async (item: Omit<T, 'id'>) => {
    if (!user) throw new Error("User not authenticated");
    
    const itemWithUser = {
      ...item,
      userId: user.uid,
      createdAt: Timestamp.now(),
    };

    try {
      const docRef = await addDoc(collection(db, collectionName), itemWithUser);
      return docRef.id;
    } catch (error) {
      console.error(`Error adding ${collectionName}:`, error);
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error(`Error updating ${collectionName}:`, error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      console.error(`Error deleting ${collectionName}:`, error);
      throw error;
    }
  };

  return {
    data,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
  };
};

// Specific hooks for each collection
export const useGroceryItems = () => {
  return useFirestoreCollection("groceryItems", [
    orderBy("createdAt", "desc")
  ]);
};

export const useShoppingList = () => {
  return useFirestoreCollection("shoppingListItems", [
    orderBy("isCompleted", "asc"),
    orderBy("priority", "desc"),
    orderBy("createdAt", "desc")
  ]);
};

export const useSavedRecipes = () => {
  return useFirestoreCollection("savedRecipes", [
    orderBy("savedAt", "desc")
  ]);
};

export const useMealPlans = () => {
  return useFirestoreCollection("mealPlans", [
    orderBy("plannedDate", "asc")
  ]);
};

export const useNotifications = () => {
  return useFirestoreCollection("notifications", [
    orderBy("createdAt", "desc")
  ]);
};
