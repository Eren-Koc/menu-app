"use client";
import "../../globals.css";
import { getDocs, query, where,addDoc,updateDoc,doc, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiAdminFill } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";
import Loader from '../.././components/Loading';
import { HiViewGridAdd } from "react-icons/hi";

export default function ClientPage({params}) {
const [pageClient,setPageClient] = useState({});
const [loading,setLoading] = useState(true);



const router = useRouter(); 

const getPageData = async (url) => {
 

    const usersCollectionRef = collection(db, 'clients');
    const q = query(usersCollectionRef, where('url', '==', url));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs[0]?.data(); 
  };

  const fetchData = async () => {
    try {
      const url = params.restaurantUrl;
      const data = await getPageData(url);
      if (data) {

          const newData ={
              url:data.url,
              name: data.name,
              id:data.id,
              menu:data.menu,
          }

          setPageClient(newData);  
          
     
        } else {
       
          router.push('/notFound'); 
        }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    fetchData();
    
  }, [params.restaurantUrl, router]);

  useEffect(()=>{

    if(pageClient.menu){
      setLoading(false);
      
    }
    
  },[pageClient])


  if(loading){
    return <Loader />
  }
  

  
  
 


  return (
    <>
    <div id="menu-panel-bg" key={pageClient.id} className='w-full bg-slate-100 flex justify-center items-center min-h-screen'>
    <div  className='content flex flex-col max-w-[700px]  w-full h-fit min-h-screen bg-slate-100'>

    <div className=' header-title-bg '>
    <a href={"/"}> <IoMdArrowRoundBack className="absolute top-2 left-2 text-white z-20 w-[23px] h-auto"/></a>
   <a href={"/restaurant/"+pageClient.url+"/admin"}> <button className="absolute top-2 right-2 bg-white rounded-md flex justify-center items-center gap-2 text-sm p-2 z-20"><RiAdminFill/> admin</button></a>
    <span className='header-title text-2xl text-white font-semibold uppercase bg-black/50'>{pageClient.name}</span>
    </div>

    <div className="nav-categories sticky z-50 top-0 bg-slate-100 backdrop-blur-[2px] font-medium whitespace-nowrap gap-6 text-sm flex mt-4 py-4 my-4 px-4  overflow-x-auto w-full">
    {pageClient ? pageClient.menu.length>0 ? (
      
      pageClient.menu.map((eachCategory,i)=>{
        return eachCategory.products.length>0 ? <a key={"nav-"+eachCategory.categoryId} href={"#"+eachCategory.name}> <div   className="category-nav px-3 py-2 rounded-md border  cursor-pointer  border-black">{eachCategory.name}</div></a> : <></>
      })

    ): <div className="w-full  flex justify-center items-center flex-col gap-4">
      <span>Bu menü henüz hazır değil.</span>
      <a href={"/restaurant/"+pageClient.url+"/admin"}><button className='p-2 bg-blue-600 text-white rounded-md flex gap-2 items-center justify-center'>
        <HiViewGridAdd/>
        <span>Kategori & Ürün ekle</span>
      </button></a> 
    </div> : null 
    }
    </div>
    

    {pageClient ? (
      
      pageClient.menu.map((eachCategory,i)=>{
        return (
          <div key={"menu-"+eachCategory.eachCategoryId+i} className="h-fit py-2">
         {eachCategory.products.length>0 ? <span id={eachCategory.name} key={"title-"+eachCategory.categoryId} className="eachCategory-title   font-semibold w-full max-sm:text-lg p-2 text-xl">{eachCategory.name}</span> : null} 
          {
            eachCategory.products.map((eachProducts,i)=>{
              return (
               
              <div key={"product-"+eachProducts.productId} className="eachProduct shadow-sm flex flex-col  px-2 py-3 my-3 bg-white rounded-md ">
              
              <div className="flex w-full mt-4 flex-row mb-2 justify-between  h-fit">
              <div className="flex flex-col gap-3 max-[400px]:max-w-[150px]  max-[700px]:max-w-[250px]">
              <span className="eachProduct-title font-medium ">{eachProducts.title}</span> 
              <span className="eachProduct-desc text-sm text-gray-700 ">{eachProducts.description}</span>      
              </div>
              
              <div className="relative ">
              <img  src={eachProducts.imageURL} className="w-[110px] h-[110px] rounded-md object-cover eachProduct-img" alt="" />
              <span className="absolute uppercase z-10 left-1/2 bottom-[-5px] font-semibold bg-white text-sm p-[6px] rounded-md border border-black  -translate-x-1/2  ">{eachProducts.price}tl</span>
              </div> 
              </div>
              </div>  
               
              )
            })
          }
          </div>
        )
      })

    ) : null 
    }


     
      
    
   
      

      

      
      

    </div>
    </div>
     
    </>
   
  )

}

