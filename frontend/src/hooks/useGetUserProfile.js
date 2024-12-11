import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useShowToast from './useShowToast';

function useGetUserProfile() {
  const  [user, setUser] = useState(null);
  const [load, setLoad] = useState(true);
  const {username} = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
        try{
          const res = await fetch(`/api/users/profile/${username}`);
          const data = await res.json();
          if (data.error) {
            showToast("Invalid Username",data.error,"error");
            return;
          }
          setUser(data);
        } catch (error) {
          showToast("Error",error.message,"error");
        } finally{
          setLoad(false);
        }
      }
      getUser();
  }, [username, setUser, showToast, setLoad])

  return {load, user}
}

export default useGetUserProfile