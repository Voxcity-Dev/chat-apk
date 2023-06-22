import React,{useContext} from 'react'
import { UserContext } from '../context/UserProvider';
import Signed from './signed';
import Unsigned from './unsigned';
import { GroupProvider } from '../context/GroupProvider';
import { ContacProvider } from '../context/ContacProvider';

const AppRoutes = () => {
    const {signed}  = useContext(UserContext);

    if(signed){
        return (
            
            <ContacProvider>
                <GroupProvider>
                    <Signed />
                </GroupProvider>
            </ContacProvider>
        );
    }else{
        return (
            <Unsigned />
        );
    }
};

export default AppRoutes;
