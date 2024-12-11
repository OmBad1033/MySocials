import { useSetRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowToast from "./useShowToast";

function useLogout() {
  const setUser = useSetRecoilState(userAtom);
  const showtoast = useShowToast();
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showtoast("Error", data.error, "error");
        return;
      }
      localStorage.removeItem("user-threads");
      setUser(null);
    } catch (error) {
      showtoast("Error", error, "error");
    }
  };
  return handleLogout;
}
export default useLogout;
