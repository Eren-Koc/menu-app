"use client";
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoginUser} from '../../../GlobalRedux/features/userSlice';
import { useRouter } from 'next/navigation';
import "../../../globals.css";
import Loader from '../../../components/Loading';
import CategoryProductsForm from '../../../components/inputForm';
import TableItemProducts from '../../../components/tableItem';
import DisplayQrcode from '../../../components/popupQr';
import '../../../../node_modules/semantic-ui-css/semantic.min.css'; // Semantic UI CSS
import { IoMdArrowRoundBack } from "react-icons/io";
import { HiViewGridAdd } from "react-icons/hi";
import { IoQrCodeOutline } from "react-icons/io5";
const adminPanel = ({params}) => {
    
    const router = useRouter();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const [loading, setLoading] = useState(true);
    const [pageActive,setPageActive]=useState(false);
    const [visible,setVisible]=useState(false);

    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [qrcodePopupVisible,setQrcodePopupVisible] = useState(false);
    
    const generateQrCode = () => {
      
      let url = "localhost:3000/restaurant/"+currentUser.url;
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
        setQrCodeUrl(qrApiUrl);
        setQrcodePopupVisible(true);
    };



   

    

    useEffect(()=>{

      const id = localStorage.getItem("id");
      if(id){
        dispatch(LoginUser(id)).then((result) => {
          setLoading(false);
     
        }).catch((err) => {
        setLoading(false);
        }); 
      }
      else{
        console.log("buraya girdi");
        router.push('/');
      }
      },[dispatch,router])

      useEffect(() => {
        if (!loading) {
          if (!currentUser) {
            router.push('/');
          } else {
            authorizationCheck();
          }
        }
      }, [currentUser, loading, router]);

    const  authorizationCheck=()=>{
  
      if(currentUser?.url !== params.restaurantUrl){
        router.push('/');
      }
      else{
        setPageActive("true");
      }
    }

  

  return (
  <div id='admin-panel-bg' className='w-full min-h-screen h-fit flex justify-center items-center'>
        
{
  pageActive ? (
    <>

     <CategoryProductsForm visible={visible} setVisible={setVisible} currentUser={currentUser} />
   {qrcodePopupVisible ? <DisplayQrcode qrCodeUrl={qrCodeUrl} qrcodePopupVisible={qrcodePopupVisible} setQrcodePopupVisible={setQrcodePopupVisible}/> : null}  
     <div className="table-container  m-4">
     <div className='btn-container sticky top-0  mb-6 w-full max-[600px]:fixed max-[600px]:top-3 max-[600px]:px-4 max-[600px]:left-0 max-[600px]:gap-3 max-[600px]:flex-col-reverse  flex justify-between items-center'>
       
      <div className='flex justify-center max-[600px]:flex-col max-[600px]:w-full items-center gap-3'>

      <div onClick={()=>{setVisible(true)}} className='flex justify-center items-center gap-3 p-2 rounded-md cursor-pointer max-[600px]:w-full  max-[600px]:text-center bg-[#1E3A8A] text-white'>
       <HiViewGridAdd  className='text-white'/>
       <span>Kategori & Ürün Ekle</span>
         </div>

      <div onClick={()=>{qrCodeUrl ? setQrcodePopupVisible(true) : generateQrCode()}} className='flex justify-center items-center gap-3 p-2 rounded-md cursor-pointer max-[600px]:w-full  max-[600px]:text-center bg-[#1E3A8A] text-white'>
       <IoQrCodeOutline  className='text-white'/>
       <span>Qr Kod Oluştur</span>
         </div>
      </div>
      
      
      <a className=' max-[600px]:w-full' href={"/restaurant/"+currentUser.url}> <div className='flex justify-center items-center gap-3 p-2 cursor-pointer rounded-md bg-[#1E3A8A]  max-[600px]:w-full  max-[600px]:text-center text-white'>
       <IoMdArrowRoundBack className='text-white'/>
       <span>Menüye Dön</span>
         </div>
         </a>
     </div>
     <div className="table-container-2 max-[700px]:w-full">
     <table className="w-full h-[300px] overflow-auto rounded-md ">
  <thead>
    <tr>
      <th>Ürün Adı</th>
      <th >Ürün Kategori</th>
      <th >Ürün Açıklama</th>
      <th >Ürün Fiyatı</th>
      <th >Ürün Fotoğrafı</th>
      <th>Ürünü Sil</th>
    </tr>
  </thead>
 

 {currentUser.menu.map((eachCategory)=>{
  return(
    <tbody key={"container-"+eachCategory.categoryId}>
    { 
      eachCategory.products.map((eachProduct)=>{
        return (
         
          <TableItemProducts currentUser={currentUser} eachProduct={eachProduct} eachCategory={eachCategory} key={eachProduct.productId} />     
        )
      })
    }
 </tbody>
  )
 })}

   
   

  
</table>
</div>  
</div>

  </>
) :  <Loader props={"Yetkiniz kontrol ediliyor..."}/>
}
  
    
    </div>
  )
}

export default adminPanel