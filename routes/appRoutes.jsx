import React,{useContext} from 'react'
import { userContext } from '../context/userContext';
import Signed from './signed';
import Unsigned from './unsigned';

const AppRoutes = () => {
    const {signed}  = useContext(userContext);

    if(signed){
        return (
            <Signed />
        );
    }else{
        return (
            <Unsigned />
        );
    }
};

export default AppRoutes;
