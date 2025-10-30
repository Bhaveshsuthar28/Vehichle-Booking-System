import { useEffect} from 'react'
import {io} from 'socket.io-client'
import { SocketContext } from './SocketDataContext.js';

const socket = io(`${import.meta.env.VITE_BASE_URL}`);

const SocketProvider = ({children}) => {
    useEffect(()=> {
        socket.on('connect' , () => {
            console.log('connected to server')
        });

        socket.on('disconnect' , () => {
            console.log('Disconnected from server')
        });
    } , [])

    return(
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider