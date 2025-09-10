// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"

import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  onAuthStateChanged,
} from "firebase/auth"
import { getFunctions, httpsCallable } from "firebase/functions" // Add this

const firebaseConfig = {
  apiKey: "AIzaSyA96G6JacRzzrU-CQNYR6FVOelyC-W9IMg",
  authDomain: "atlantis-5f07f.firebaseapp.com",
  projectId: "atlantis-5f07f",
  storageBucket: "atlantis-5f07f.appspot.com",
  messagingSenderId: "414784607815",
  appId: "1:414784607815:web:35e28bdee042523c584362",
  measurementId: "G-8NS6XT97D0",
}

const app = initializeApp(firebaseConfig)
const functions = getFunctions(app)

setPersistence(getAuth(app), browserLocalPersistence)
  .then(() => {
    console.log("Firebase Auth persistence state set to local")
  })
  .catch((error) => {
    console.error("Error setting Firebase Auth persistence state:", error)
  })

let accessToken = null
export const getAccessToken = async () => {
  return new Promise((resolve, reject) => {
    const auth = getAuth(app)
    console.log(auth)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(user)
      if (user) {
        try {
          accessToken = await user.getIdToken()
          resolve(accessToken)
        } catch (error) {
          console.error("Error getting access token:", error)
          reject(error)
        } finally {
          unsubscribe()
        }
      } else {
        accessToken = null

        resolve(null)
      }
    })
  })
}

export const fetchConfig = async () => {
  const getConfig = httpsCallable(functions, "getConfig") // Cloud Function name
  try {
    const result = await getConfig()
    return result.data
  } catch (error) {
    console.error("Error fetching Firebase Config:", error)
    throw error
  }
}

export const auth = getAuth(app)
