import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { CiLogout } from "react-icons/ci";

function Logout() {
    const setUser = useSetRecoilState(userAtom);
    const showtoast = useShowToast();
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
      })
      const data = await res.json();
      if (data.error) {
        showtoast("Error",data.error,"error");
        return;
      }
      localStorage.removeItem("user-threads");
      setUser(null);
    } catch (error) {
        showtoast("Error",error,"error");
    }
  };


  return (
    <Button
      position={"fixed"}
      top={"10"}
      right={"10"}
      size={"sm"}
      onClick={() => handleLogout()}
    >
      <CiLogout size={20} />
    </Button>
  );
}

export default Logout;
