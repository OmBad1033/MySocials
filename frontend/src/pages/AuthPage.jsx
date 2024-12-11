import SignUp from '../components/SignUp'
import Login from '../components/Login'
import { useRecoilValue } from 'recoil'
import authAtom from '../../atoms/authAtom'
import { Box } from '@chakra-ui/react';






function AuthPage() {
    const authScreenState = useRecoilValue(authAtom);
    //console.log(authScreenState);
    //const [value , setValue] = React.useState('login');   setValue = useRecoilState(authScreenState);
  return (
    <>
      {authScreenState === 'login' ? (
        <Box className="flex justify-center items-center">
        <Login />
        </Box>) : <SignUp />} 
      
    </>
   );
    

  
}

export default AuthPage