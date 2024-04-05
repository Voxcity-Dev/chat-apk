import React, { useContext } from 'react'
import { UserContext } from '../context/UserProvider';
import Signed from './signed';
import Unsigned from './unsigned';
import { GroupProvider } from '../context/GroupProvider';
import { ContacProvider } from '../context/ContacProvider';
import { AttendanceProvider } from '../context/AttendanceProvider';
import { ReplyForwardingProvider } from '../context/ReplyForwardingProvider';
import { ProfessionalProvider } from '../context/ProfissionalProvider';
import { FlowBotProvider } from '../context/FlowBotProvider';



const AppRoutes = () => {
    const { signed } = useContext(UserContext);

    if (signed) {
        return (

            <ContacProvider>
                <GroupProvider>
                    <AttendanceProvider>
                        <ReplyForwardingProvider>
                            <ProfessionalProvider>
                                <FlowBotProvider>
                                    <Signed />
                                </FlowBotProvider>
                            </ProfessionalProvider>
                        </ReplyForwardingProvider>
                    </AttendanceProvider>
                </GroupProvider>
            </ContacProvider>
        );
    } else {
        return (
            <Unsigned />
        );
    }
};

export default AppRoutes;
