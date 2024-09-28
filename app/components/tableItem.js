import React, { useState } from 'react'
import { FaRegTrashAlt } from "react-icons/fa";
import { FaTurkishLiraSign } from "react-icons/fa6";
import { deleteProduct,changeProduct } from '../GlobalRedux/features/userSlice';
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux';

const tableItem = ({currentUser,eachCategory,eachProduct}) => {
    const dispatch = useDispatch();

    const [productDetails, setProductDetails] = useState({
        title: eachProduct.title,
        price: eachProduct.price,
        description: eachProduct.description,
        imageURL:eachProduct.imageURL,
        productId:eachProduct.productId,
      });

      const roundUp=(number)=>{
        return Math.ceil(number);
      }


    const handleChange = (event) => {
        const { name, value } = event.target;
            setProductDetails({
                ...productDetails,
                [name]: value
            });

      };
      const handleBlur = () => {
        dispatch(changeProduct(currentUser.id,eachCategory,productDetails));
       
      };
    
      const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            dispatch(changeProduct(currentUser.id,eachCategory,productDetails));
          event.target.blur();
        }
      };



    const deleteRequest =(userId,category,product)=>{

        Swal.fire({
          title: "Silmek istiyor musun?",
          text: "Bu işlem geri alınamaz.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#1E3A8A",
          iconColor:"#1E3A8A",
          cancelButtonText:"Vazgeç",
          cancelButtonColor: "#aaa",
          confirmButtonText: "Sil"
        }).then((result) => {
          if (result.isConfirmed) {
  
            dispatch(deleteProduct(userId,category,product)).then((result) => {
  
              Swal.fire({
                title: "Silindi!",
                text: "Ürün başarıyla silindi.",
                icon: "success"
              });
  
            })
           
          }
        });
        
      }

  return (

    <tr key={eachProduct.productId+"-td"}>
    <td >

    <input 
    type="text"  
    value={productDetails.title} 
    name="title"
    onChange={handleChange} 
    onKeyDown={handleKeyDown} 
    onBlur={handleBlur} 
    maxLength={30}
    className='max-w-[100px] text-center outline-none bg-transparent h-[65px] p-2' /> </td>

    <td className='text-center'> {eachCategory.name} </td>
    <td>

    <textarea
    name="description"
    value={productDetails.description} 
    onChange={handleChange} 
    onKeyDown={handleKeyDown} 
    onBlur={handleBlur} 
    maxLength={70}
    rows={productDetails.description.length/18 > 1 ? roundUp(productDetails.description.length/18) : 1}
    className='bg-transparent text-center outline-none resize-none'></textarea>
    
     </td> 
    <td> <div className='flex text-center justify-center items-center gap-2 w-full h-full'>
    <FaTurkishLiraSign className='w-[8px]'/>

    <input
    type="number"
    name='price'
    value={productDetails.price} 
    onChange={handleChange} 
    onKeyDown={handleKeyDown} 
    onBlur={handleBlur} 
    className='bg-transparent text-center outline-none max-w-[50px] h-[65px]' />
    
    </div>
    </td>
    <td > <img className='w-[60px] h-[60px] m-auto object-cover' src={eachProduct.imageURL}/> </td> 
    <td className='group cursor-pointer' onClick={()=>{deleteRequest(currentUser.id,eachCategory,eachProduct)}} > <FaRegTrashAlt className='m-auto group-hover:text-blue-600 transition-all'/> </td> 
  </tr>

  )
}

export default tableItem