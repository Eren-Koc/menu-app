"use client";
import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineFileUpload } from "react-icons/md";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { createCategory,UploadProduct } from '../GlobalRedux/features/userSlice';
import { useDispatch } from 'react-redux'
import { IoCloseCircle } from "react-icons/io5";
import Swal from 'sweetalert2'
const inputForm = ({visible,setVisible,currentUser}) => {
    const dispatch = useDispatch();
    const [pageState,setPageState] = useState(0); 
    const divRef = useRef(null);
    const [file,setFile] = useState("");
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [price,setPrice] = useState("");
    const [category,setCategory] = useState("");
    const [img,setImg] = useState("");


    const handleClickOutside = (event) => {

      if (divRef.current && !divRef.current.contains(event.target)) {
        setVisible(false);
      }
    };


    useEffect(() => {
      const handleClick = (event) => {
        handleClickOutside(event);
      };
  
      document.addEventListener('mousedown', handleClick);
      return () => {
        document.removeEventListener('mousedown', handleClick);
      };
    }, []);






    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];    
        setImg(selectedFile ? URL.createObjectURL(selectedFile) : undefined); 
        setFile(selectedFile);
        
       
      };
  
  
      const changeFunc=()=>{
      var selectBox = document.getElementById("selectBox");
      var selectedValue = selectBox.options[selectBox.selectedIndex].innerHTML;
      setCategory(selectedValue);
     }

    const handleProductOrCategoryEntry =async()=>{

        if(pageState == 1){
          if(title){
            const newCategory= {     
              name:title,
              products:[],
            }
            dispatch(createCategory(currentUser.id,newCategory)).then((result) => {
              setTitle("");
            });
  
          }
          else{
            Swal.fire({
              position: "center",
              icon: "error",
              text: "Kategori ismi giriniz.",
              showConfirmButton: true,
            });
          }
  
        }
        else{
          if(title && file && category && description && price){
            console.log("buraya girdi");
               dispatch(UploadProduct(currentUser.id,title,file,category,description,price)).then((result) => {
                setFile("");
                setTitle("");
                setDescription("");
                setPrice("");
                setImg("");
  
                Swal.fire({
                  position: "center",
                  icon: "success",
                  text:"Ürün başarıyla yüklendi.",
                  showConfirmButton: false,
                  timer: 1500,
                });
  
               });
           
          }
         
        }
  
               
      }

    const activePageStyle={
        fontWeight:'700',
        fontSize:'17px',
        backgroundColor:'#1E40AF',
        color:'White',
  
        
      }
      const pasivePageStlye={
        fontWeight:'500',
        fontSize:'16px',
        color:'Black',
        backgroundColor:'#FFF',
  
  
      }


    return (
   
    <div  style={{display: visible ?  "flex" : "none"}} className='w-full backdrop-blur-[2px]  min-h-screen fixed z-40 top-0 left-0 bg-black/30 flex justify-center items-center'>
    <div onClick={()=>{setVisible(false)}} className='cursor-pointer absolute right-3 top-3 z-50'><IoCloseCircle className='w-[40px] text-white h-auto'/></div>
    <div ref={divRef} className='w-full max-w-[700px] p-4 rounded-md flex flex-col justify-center items-center'>

    <div className='w-full  mb-2 flex justify-center items-center'>
    <div onClick={()=>{setPageState(pageState==0 ? !pageState : pageState)}} style={pageState ? activePageStyle : pasivePageStlye} className='w-1/2 text-center rounded-l-md cursor-pointer p-3 bg-slate-200 '>Kategori ekle</div>
    <div onClick={()=>{setPageState(pageState==1 ? !pageState : pageState)}} style={!pageState ? activePageStyle : pasivePageStlye} className='w-1/2 text-center rounded-r-md cursor-pointer  p-3 bg-slate-200'>Ürün ekle</div>

  </div>

    {!pageState ? (   <div className="eachProduct w-full flex flex-col  px-2 py-3 my-2 bg-white rounded-md ">
              
              <div className="flex w-full mt-4 flex-row mb-2 justify-between  h-fit">
              <div className="flex flex-col gap-3 max-[400px]:max-w-[150px]  max-[700px]:max-w-[250px]">
              <span className="eachProduct-title font-medium ">{ title ? title : "Ürün başlığı."}</span> 
              <span className="eachProduct-desc text-sm text-gray-700 ">{description ? description : "Ürün açıklamanız burada gözükecek."}</span>      
              </div>
              
              <div className="relative ">
              <img  src={img ? img : "../../logo.png"} style={{backgroundColor: !img ? '#1E40AF' : null}} className="w-[110px] h-[110px] rounded-md object-cover eachProduct-img" alt="" />
              <span className="absolute uppercase z-10 left-1/2 bottom-[-5px] font-semibold bg-white text-sm p-[6px] rounded-md border border-black  -translate-x-1/2  ">{ price ? price : "200"}tl</span>
              </div> 
              </div>
              </div>    ) : null}
    

   
      
   
  <div className='w-full h-fit flex flex-col bg-white p-4 border rounded-md'>
    <span className='text-xl font-semibold mb-4'>{!pageState ?  "Ürün Ekle" : "Kategori Ekle"}</span>
<div className='my-2 relative flex flex-col gap-2'>
<span className='font-medium'>{!pageState ?  "Ürün Başlığı" : "Kategori Adı"} </span>
<input 
placeholder={!pageState ?  "Ürün Başlığı" : "Kategori Adı"} 
className='h-[40px]  outline-none w-full p-2 rounded-md border' 
type="text"
value={title}
maxLength={30}
required
onChange={(e) => setTitle(e.target.value)}
style={{borderColor: title.length>0 ? '#16a34a' : '#E5E7EB'}}
/>
<span className='absolute right-2 top-2 text-gray-600 text-sm '>{title.length + '/30'}</span>
</div>

{!pageState ? (<div className='my-2 relative flex flex-col gap-2'>
<span className='font-medium'>Ürün Açıklaması</span>
<input 
placeholder={"Ürün Açıklaması"} 
className='h-[40px] outline-none w-full p-2 rounded-md border' 
type="text"
maxLength={70}
required
value={description}
onChange={(e) => setDescription(e.target.value)}
style={{borderColor: description.length>0 ? '#16a34a' : '#E5E7EB'}}
 />
<span className='absolute right-2 top-2  text-gray-600 text-sm '>{description.length + '/70'}</span>
</div>) : null}


{!pageState ? (<div className='my-2 flex flex-col gap-2'>
<span className='font-medium'>Ürün Fiyatı</span>
<input 
placeholder={"200"} 
className='h-[40px] outline-none w-full p-2 rounded-md border' 
type="number"
required
value={price}
style={{borderColor: price.length>0 ? '#16a34a' : '#E5E7EB'}}
onChange={(e) => setPrice(e.target.value)}
 />
</div>) : null}


{!pageState ? (<div className='my-2 flex flex-col gap-2'>
<span className='font-medium'>Kategori Seç</span>

<select style={{borderColor: category ? '#16a34a' : '#E5E7EB'}} id='selectBox' onChange={()=>{changeFunc()}} className="ui dropdown rounded-md h-[40px]">
  {!category ? <option value="">Kategori Seçiniz</option> :null}
 {currentUser.menu.map((eachCategory, i)=>{
   return <option key={"select-"+eachCategory.categoryId} value={i}>{eachCategory.name}</option>
 })}
</select>
</div>) : null}





{!pageState ? (
  <div className='my-4 flex justify-between items-center gap-2'>
  <input 
  type="file"
  onChange={handleFileChange}
  required
    id="uploadIMG"/>
  <label style={{borderColor: img ? '#16a34a' : '#1E40AF'}} className=' h-[40px] cursor-pointer outline-none w-full p-2 rounded-md flex justify-center gap-2 items-center  border' htmlFor="uploadIMG">
   {img ? <IoCheckmarkDoneOutline className='w-6 h-6 text-green-600 object-contain'/> : <MdOutlineFileUpload className='w-6 h-6 object-contain'/>}
    <span>Fotoğraf yükle</span>
  </label>
 
</div>
) : null}



<button onClick={()=>{handleProductOrCategoryEntry()}} className=' w-full h-[40px] flex justify-center items-center cursor-pointer bg-blue-800 rounded-md text-lg text-white font-semibold'>{!pageState ?  "Ürün Ekle" : "Kategori Ekle"}</button>
  </div>
  </div>
  </div>
  )
}

export default inputForm