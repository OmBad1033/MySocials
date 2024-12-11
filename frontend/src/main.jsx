import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'
import { RecoilRoot } from 'recoil'
import { SocketContextProvider } from '../context/SocketContext.jsx'

const styles ={
  global:(props)=>({
    body:{
      color:mode('gray.800', 'whiteAlpha.900')(props),
      bg:mode('white', '#0e0505')(props),
    }
  })
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

const colors={
  gray: {
    light : "#616161",
    dark : "#0f0f0f"
  },
  
}

const theme = extendTheme({ config, styles, colors });


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <SocketContextProvider>
        <App />
        </SocketContextProvider>
      </ChakraProvider>
    </BrowserRouter>
    </RecoilRoot>
  </StrictMode>,
)
