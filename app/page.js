"use client";

import "./globals.css";
import React, {  useEffect, useState } from 'react';
import { FaArrowRightLong } from "react-icons/fa6";
import { registerUser,LoginUser,LogoutUser,autoLogin } from './GlobalRedux/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import Link from 'next/link'

export default function Home() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user);
  const [login, setLogin] = useState(true);

  const [registerStatus,setRegisterStatus] = useState(false);


  useEffect(()=>{
    dispatch(autoLogin());  
  },[])


  function convertToURLFriendly(text) { 
    const normalizedText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const urlFriendlyText = normalizedText
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')  
      .replace(/-+/g, '-')         
      .replace(/^-|-$/g, '');      
    return urlFriendlyText;
  }

  const handleRegister = () => {

   

    

    if(login==false){ 

      

    if(name && email && password && !registerStatus){
      setRegisterStatus(true);
      const userData = { name, email,password };
      const url = convertToURLFriendly(name);
      userData.url=url;
      dispatch(registerUser(userData))
      .then(() => {

        Swal.fire({
          position: "center",
          icon: "success",
          text: "Kayıt başarıyla gerçekleşti. Hemen giriş yap.",
          showConfirmButton: false,
          timer: 1500,
        });

        setName("");
        setEmail("");
        setPassword("");
        setLogin(true);
        setRegisterStatus(false);
      })
      .catch((error) => {
       
      });

    }
  } 
  else{
    if(email && password){
      dispatch(LoginUser(null,email,password)).then(()=>{
        setName('');
        setEmail('');
        setPassword('');
      });
    }
  }

  };

  const logout =()=>{
    dispatch(LogoutUser(currentUser));
  }


  return (
    <main className="landing relative min-h-svh h-fit w-full ">
    <div className="absolute p-0 left-0 top-0 h-full w-full bg-blue-900/60 flex-col flex justify-center items-center">
    
    
      <img src="logo.png" className="h-32 pb-8 w-auto" alt="" />
    
    <div className="max-w-[700px]  w-full flex gap-4 flex-col ">

      {currentUser ? (
 <div className="w-full max-[500px]:flex-col max-[500px]:gap-3 bg-white rounded-md flex  p-4 h-fit justify-between items-center min-h-[60px]">
 <span><span className="font-bold mr-2">{currentUser.name}</span>oturum zaten açık.</span>
 <div className="flex cursor-pointer text-white gap-3 justify-center items-center">
   <div onClick={()=>{logout()}} className="bg-blue-900 rounded-md px-3 py-2">Çıkış yap</div>
   
  
   <Link href={"/restaurant/"+currentUser.url} className="bg-blue-900 cursor-pointer rounded-md flex gap-2 px-3 py-2  justify-center items-center">Devam et
   <FaArrowRightLong style={{ color: 'white', fontSize: '16px' }} />
   </Link>
 </div>
  </div>
      )
      : null

      }
     
    <div className="flex min-h-[400px] max-[600px]:flex-col  rounded-md h-fit bg-white ">
    <div className="active-part w-1/2 max-[600px]:w-full max-[600px]:py-3   flex flex-col justify-center items-center gap-4">
      <span className="font-bold text-2xl mb-4">{login ? "Giriş yap" : "Kayıt ol"}</span>

      <form action={()=>{handleRegister()}} className="w-4/5 flex flex-col gap-3">
        <label >
          <span className="text-sm">E-mail adres:</span>

        <input 
        className="outline-none bg-slate-100 rounded-sm h-8 w-full p-2" 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="on"
         required  />


        </label>
        <label>
          <span className="text-sm">Şifre:</span>


        <input 
        className="outline-none bg-slate-100 rounded-sm h-8 w-full p-2" 
        type="password"
        value={password}
        maxLength={20}
        onChange={(e) => setPassword(e.target.value)}
        required/>


        </label>
        {
           !login ? (<label>
            <span className="text-sm">Firma Adı:</span>


          <input 
          className="outline-none bg-slate-100 rounded-sm h-8 w-full p-2"
           type="text" 
           value={name}
           autoComplete="on"
           maxLength={20}
           onChange={(e) => setName(e.target.value)}
           required  />



          </label>) : null 
        }    

      <input type="submit" value={ login ? "Giriş yap": "Kayıt ol"} className="m-auto bg-blue-900 rounded-3xl cursor-pointer px-4 py-2 min-w-[150px] text-center mt-6 text-white"/>
      </form>

    </div>
    <div className=" active-part  w-1/2 rounded-r-md max-[600px]:w-full max-[600px]:py-3  flex-col bg-blue-900 flex justify-center items-center gap-2">
    <span className="font-bold text-3xl mb-4 text-white">Merhaba</span>
    <span className="w-[90%] text-white text-center">{ login ? "Firmanız için dilediğiniz kategorileri oluşturarak, ürünlerinizi kolayca ekleyin. Qr kod yardımıyla müşterilerinizle buluşturun." : "Zaten bir hesabın var mı ?"}
</span>
{ !login ? null :  (<span className="text-white mt-2">Hemen deneyin.</span>) }
<div onClick={()=>{setLogin(!login)}} className="bg-blue-900 rounded-3xl cursor-pointer px-4 py-2 min-w-[150px] text-center mt-2 border border-white text-white">{ login ? "Kayıt ol" : "Giriş yap"}</div>
    </div>
    </div>
    </div>
    
    </div>
  </main>
  );
}
