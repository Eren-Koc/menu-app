import React, { useEffect, useRef } from 'react'
import { IoPrintOutline } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import Swal from 'sweetalert2'

const popupQr = ({qrCodeUrl,qrcodePopupVisible,setQrcodePopupVisible}) => {
    const printRef = useRef(null);  
    const divRef = useRef(null);


    useEffect(() => {
        const handleClick = (event) => {
          handleClickOutside(event);
        };
    
        document.addEventListener('mousedown', handleClick);
        return () => {
          document.removeEventListener('mousedown', handleClick);
        };
      }, []);

    const handleClickOutside = (event) => {

        if (divRef.current && !divRef.current.contains(event.target)) {
            setQrcodePopupVisible(false);
        }
      };



    const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(qrCodeUrl);

          Swal.fire({
            position: "center",
            icon: "success",
            text:"Başarıyla kopyalandı.",
            showConfirmButton: false,
            timer: 1500,
          });

        } catch (err) {
          console.error('Kopyalama başarısız', err);
        }
      };

      const handlePrint = () => {
        if (printRef.current) {
          const printContents = printRef.current.innerHTML;
          const newWindow = window.open("", "", "width=600,height=400");
    
          newWindow.document.write(`
            <html>
              <head>
                <style>
                  body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                  img { max-width: 100%; height: auto; }
                </style>
              </head>
              <body>
                ${printContents}
              </body>
            </html>
          `);
          newWindow.document.close();
          newWindow.focus();
          newWindow.print();
          setTimeout(() => {
            newWindow.close();
          }, 1000);  
        }
      };

  return (
<div className='fixed left-0 top-0 h-full w-full bg-black/20'>
    <div ref={divRef}  className='absolute shadow-sm top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white py-6 px-4 rounded-md flex justify-center items-center w-[250px] flex-col gap-4'>
    <div ref={printRef}>
    <img src={qrCodeUrl} className='w-[150px] h-[150px]'/>
    </div>
    <div className='flex w-full justify-center items-center gap-2'>
    <div onClick={()=>{handleCopy()}} className='cursor-pointer w-1/2 text-center rounded-md px-3 py-2 bg-blue-600 text-white font-semibold flex justify-center items-center gap-2'>
  <FaRegCopy/>
   <span>Kopyala</span>
    </div>
    <div onClick={()=>{handlePrint()}} className='cursor-pointer w-1/2 text-center rounded-md px-3 py-2 bg-blue-600 text-white font-semibold flex justify-center items-center gap-2'>
    <IoPrintOutline/>
    <span>Yazdır</span>
    </div>
    </div>
    
   
    </div>
    </div>
  )

}

export default popupQr