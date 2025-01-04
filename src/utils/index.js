import { toast } from "react-toastify";
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { format } from "date-fns";
import { Bike, Dumbbell } from "lucide-react";

export const showToast = (type, message) => {
  const position = {
    position: "bottom-right"
  }

  if (type === "success") toast.success(message, position);
  else if (type === "error") toast.error(message, position);
}

//Upload Image to Firebase
export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

export const firebaseStorageUrl = "gs://next-js-ecommerce-4d2a9.appspot.com";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseStorageUrl);

const createUniqueFileName = (getFile) => {
  const timeStamp = Date.now();
  const randomStringValue = Math.random().toString(36).substring(2, 12);
  return `${getFile.name}-${timeStamp}-${randomStringValue}`;
}
export async function uploadImageToFirebase(file) {
  const getFileName = createUniqueFileName(file);
  const storageReference = ref(storage, `strongym/${getFileName}`);
  const uploadImage = uploadBytesResumable(storageReference, file);

  return new Promise((resolve, reject) => {
    uploadImage.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
          .then((downloadUrl) => resolve(downloadUrl))
          .catch((error) => reject(error));
      }
    );
  });
}
export const initialMemberFormData = {
  imageUrl: "",
  name: "",
  birth: "",
  gender: null,
  phone: "",
  address: "",
  membershipPlanId: null,
  status: "expired",
  expiredDate: format(new Date(), "yyyy-MM-dd"),
}

export const initialMemberFormControls = [
  { label: "Họ và tên", name: "name", type: "text" },
  {
    label: "Ngày sinh",
    name: "birth",
    type: "date",
    format: (value) => format(new Date(value), "yyyy-MM-dd"),
  },
  {
    label: "Giới tính",
    name: "gender",
    type: "radio",
    options: [
      { value: true, label: "Nam" },
      { value: false, label: "Nữ" },
    ],
  },
  { label: "Số điện thoại", name: "phone", type: "text" },
  { label: "Địa chỉ", name: "address", type: "text" },
];
