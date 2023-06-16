import React,{useContext} from 'react'
import { UserContext } from '../context/UserProvider';
import Signed from './signed';
import Unsigned from './unsigned';

const AppRoutes = () => {
    const {signed}  = useContext(UserContext);

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
