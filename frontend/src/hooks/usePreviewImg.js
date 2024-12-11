import React, { useState } from 'react'
import useShowToast from './useShowToast';


function usePreviewImg() {
    const [imgUrl , setImgUrl] = useState(null);
    const showToast = useShowToast();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                setImgUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImgUrl(null);
            showToast("Invalid file type","Please select an image file","error");
        }
        console.log(imgUrl);
    }
  return { handleImageChange, imgUrl, setImgUrl}
}

export default usePreviewImg