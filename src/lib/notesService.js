import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

function notesCollection(uid) {
  return collection(db, "users", uid, "notes");
}

// 실시간 구독 — 다른 기기에서 저장해도 자동으로 반영됨
// 반환값(unsubscribe 함수)을 useEffect의 cleanup에서 호출해야 함
export function subscribeToNotes(uid, callback, onError) {
  const q = query(notesCollection(uid), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const notes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(notes);
    },
    (error) => {
      console.error("Notes subscription error:", error);
      if (onError) onError(error);
    }
  );
}

export async function addNote(uid, note) {
  return addDoc(notesCollection(uid), {
    ...note,
    createdAt: serverTimestamp(),
  });
}

export async function deleteNote(uid, noteId) {
  return deleteDoc(doc(db, "users", uid, "notes", noteId));
}

export async function updateNoteSrs(uid, noteId, srs) {
  return updateDoc(doc(db, "users", uid, "notes", noteId), { srs });
}