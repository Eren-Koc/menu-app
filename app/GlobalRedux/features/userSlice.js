import { createSlice } from '@reduxjs/toolkit';
import { db } from '../../firebase/firebaseConfig';
import { getDocs, query, where,addDoc,updateDoc,doc, collection,arrayUnion,getDoc  } from 'firebase/firestore';

import Swal from 'sweetalert2'
import { useState } from 'react';

import {storage} from '../../firebase/firebaseConfig';
import {ref ,uploadBytes,getDownloadURL} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';




const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload; // Şu anki oturum açmış kullanıcıyı günceller
    },
    clearCurrentUser: (state) => {
      state.currentUser = null; // Oturum açmış kullanıcıyı temizler (örneğin logout durumda)
    },
  },
});

export const { addUser, setUsers, setCurrentUser, clearCurrentUser, setStatus, setError } = userSlice.actions;

// Kullanıcı kaydetme ve mevcut kullanıcıları kontrol etme fonksiyonu
export const registerUser = (userData) => async (dispatch) => {
  dispatch(setStatus('loading'));
  try {
    // Firestore'dan tüm kullanıcıları çekme
    const usersCollectionRef = collection(db, 'clients');
    console.log(userData,"userData");

    const newUserData={
      ...userData,
      menu:[],

    }
    const q = query(usersCollectionRef, where('email', '==', newUserData.email));
    const querySnapshot = await getDocs(q);

    // Eğer e-posta zaten kayıtlıysa hata döndür
    if (!querySnapshot.empty) {
      dispatch(setStatus('failed'));
      dispatch(setError('Bu e-posta adresi zaten kayıtlı.'));
      Swal.fire({
        position: "center",
        icon: "error",
        text: "Bu e-posta adresi zaten kayıtlı.",
        showConfirmButton: true,
      });
      return;
    }

    try {
      const newUrl = await generateUniqueUrl(newUserData.url);
      console.log(newUrl,"newUrl");

      newUserData.url = newUrl;

      const docRef = await addDoc(usersCollectionRef, newUserData);
       const userWithId = { id: docRef.id, ...newUserData };

       await updateDoc(doc(db, 'clients', docRef.id), userWithId);

    dispatch(addUser(userWithId));
    dispatch(setCurrentUser(userWithId));
    dispatch(setStatus('succeeded'));

    localStorage.setItem("id",userWithId.id);



      const allUsersSnapshot = await getDocs(collection(db, 'clients'));
      const allUsers = allUsersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dispatch(setUsers(allUsers));
      dispatch(autoLogin());

    } catch (error) {
      console.error('Kullanıcı kaydedilirken hata oluştu:', error);
      dispatch(setError('Kullanıcı kaydedilirken bir hata oluştu.'));
    }

  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setStatus('failed'));
    console.error('Kayıt sırasında bir hata oluştu:', error);
  }
};

export const autoLogin=()=> async (dispatch) =>{
  const id = localStorage.getItem("id");
  if(id){
    dispatch(LoginUser(id));
  }
}

export const LoginUser = (userId,email,password) => async (dispatch) => {

  if(userId){
  const usersCollectionRef = collection(db, 'clients');
    const q = query(usersCollectionRef, where('id', '==', userId));
    const querySnapshot = await getDocs(q);
    const cUser =  querySnapshot.docs[0]?.data();
    

    if(cUser){
      dispatch(setCurrentUser(cUser));
    }
  }
  else{

    const usersCollectionRef = collection(db, 'clients');
    const q = query(usersCollectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    const cUser =  querySnapshot.docs[0]?.data();

    console.log(cUser);
    let init = false;
    if(cUser){
      if(cUser.password==password){
        init=true;
        localStorage.setItem("id",cUser.id);
        dispatch(setCurrentUser(cUser));
        successPopup("Giriş işlemi başarıyla gerçekleşti.")
       
      }
    }
    if(!init){
    errorPopup("E-posta adresi veya şifre hatalı.");
    }
      
    
    

  }


    
}
export const LogoutUser = (crUser) => async (dispatch) => {

  dispatch(clearCurrentUser(crUser));
  localStorage.clear();
  successPopup("Başarıyla çıkış yapıldı.");
}

const generateUniqueUrl = async (baseUrl) => {
  let uniqueUrl = baseUrl;
  let counter = 1;
  const usersCollectionRef = collection(db, 'clients');
  const q = query(usersCollectionRef, where('url', '==', uniqueUrl));
  const querySnapshot = await getDocs(q);
  while (!querySnapshot.empty) {
    uniqueUrl = `${baseUrl}-${counter}`;
    counter++;
    const newQ = query(usersCollectionRef, where('url', '==', uniqueUrl));
    const newQuerySnapshot = await getDocs(newQ);
    if (newQuerySnapshot.empty) {
      break;
    }
  }

  return uniqueUrl;
};

export const createCategory =(id,category)=> async (dispatch) =>{
  
  //data.title

   try {
    // clients koleksiyonundan ilgili kullanıcıyı referans alıyoruz
    const clientRef = doc(db, "clients", id);
    let categoryId = uuidv4();
    const newCategory ={
      ...category,
      categoryId
    }
    // Firestore'da menu dizisine yeni obje eklemek için arrayUnion kullanıyoruz
    await updateDoc(clientRef, {
      menu: arrayUnion(newCategory),
    })

    const updatedUserSnap = await getDoc(clientRef);

    if (updatedUserSnap.exists()) {
      const updatedUserData = updatedUserSnap.data();
      dispatch(setCurrentUser(updatedUserData));
    }

    successPopup("Kategori başarıyla eklendi.");
  } catch (error) {
    errorPopup("Kategori eklenirken bir hata oluştu.");
  }

  }

export const UploadProduct =(id,title,file,category,description,price)=> async (dispatch) =>{

 

  try {
    const clientRef = doc(db, "clients", id);
    const clientSnap = await getDoc(clientRef);
  
    if (clientSnap.exists()) {
      const clientData = clientSnap.data();
      let updatedMenu = [...clientData.menu]; // Mevcut menü dizisini al
  
      // İlgili kategoriyi bul ve yeni ürünü ekle
      const categoryIndex = updatedMenu.findIndex((eachCategory) => eachCategory.name === category);
  
      if (categoryIndex !== -1) {
        const imageRef = ref(storage, `images/${file.name + uuidv4()}`);
  
        // Resmi yükle ve URL'yi al
        const snapshot = await uploadBytes(imageRef, file);
        const imageURL = await getDownloadURL(snapshot.ref);
        let productId = uuidv4();
        // Ürünü resim URL'si ile birlikte güncelle
        updatedMenu[categoryIndex].products = [
          ...(updatedMenu[categoryIndex].products || []), // Eğer bu kategori altında ürünler varsa, onları al
          {
            productId,
            title,
            imageURL, // Resim URL'sini buraya ekle
            description,
            price,
          },
        ];
  
        // Firestore'daki kullanıcı verisini güncelle
        await updateDoc(clientRef, {
          menu: updatedMenu,
        })
  
        const updatedUserSnap = await getDoc(clientRef);

    if (updatedUserSnap.exists()) {
      const updatedUserData = updatedUserSnap.data();
      dispatch(setCurrentUser(updatedUserData));
    }
    
        console.log("Ürün başarıyla eklendi!");
      } else {
        console.error("Belirtilen kategori bulunamadı!");
      }
    } else {
      console.error("Kullanıcı bulunamadı!");
    }
  } catch (error) {
    console.error("Ürün eklenirken hata oluştu:", error);
  }

}

export const deleteProduct =(userId,category,product)=> async (dispatch) =>{
 

  const newCategory = {
    ...category,
    products: category.products.filter(item => item.productId !== product.productId)
  };

  const usersCollectionRef = collection(db, 'clients');
  const q = query(usersCollectionRef, where('id', '==', userId));
  const querySnapshot = await getDocs(q);
  const cUser =  querySnapshot.docs[0]?.data();

  const index = cUser.menu.findIndex(item => item.categoryId == category.categoryId);

  if (index !== -1) {
    const newMenu = [...cUser.menu]; 
    newMenu[index] = newCategory; 
    await updateDoc(doc(db,"clients",userId), {menu:newMenu});

const clientRef = doc(db, "clients", userId);
const updatedUserSnap = await getDoc(clientRef);

 if (updatedUserSnap.exists()) {
      const updatedUserData = updatedUserSnap.data();
      dispatch(setCurrentUser(updatedUserData));
    }

    
  } else {
    errorPopup("Bir hata oluştu daha sonra tekrar deneyiniz.");
  }

}

export const changeProduct =(userId,category,newProduct)=> async (dispatch) =>{


  const Productindex = category.products.findIndex(item => item.productId == newProduct.productId);

  if (Productindex !== -1) {
    const newProducts = [...category.products]; 
    newProducts[Productindex] = newProduct; 


    const newCategory = {
      ...category,
      products: newProducts
    };

    const usersCollectionRef = collection(db, 'clients');
    const q = query(usersCollectionRef, where('id', '==', userId));
    const querySnapshot = await getDocs(q);
    const cUser =  querySnapshot.docs[0]?.data();
  
    const index = cUser.menu.findIndex(item => item.categoryId == category.categoryId);
  
   if (index !== -1) {
      const newMenu = [...cUser.menu]; 
      newMenu[index] = newCategory; 
  
      await updateDoc(doc(db,"clients",userId), {menu:newMenu});
  
    
    } else {
      errorPopup("Bir hata oluştu daha sonra tekrar deneyiniz.");
    }
  }
  else {
      errorPopup("Bir hata oluştu daha sonra tekrar deneyiniz.");
    }



 
}


const successPopup =(intext)=>{
  Swal.fire({
    position: "center",
    icon: "success",
    text:intext,
    showConfirmButton: false,
    timer: 1500,
  });
}

const errorPopup =(intext)=>{
  Swal.fire({
    position: "center",
    icon: "error",
    text: intext,
    showConfirmButton: true,
  });
}


export default userSlice.reducer;
