import React, { useState,useContext,useEffect } from 'react';
import { View,StyleSheet,Text } from 'react-native';
import AtendimentosEspera from './types/espera';
import MeusAtendimentos from './types/meusAtendimento';
import AtendimentosPotencial from './types/potencial';
import { AttendanceContext } from '../../context/AttendanceProvider';
import { UserContext } from '../../context/UserProvider';
import Chat from '../Chat/index';

export default  function Atendimentos (props) {
  const {user} = useContext(UserContext);
  const {attendances,waitingAttendances, selectedAtendimento} = useContext(AttendanceContext);
  const [atendimentos, setAtendimentos] = useState([]);
  const [atendimentosEspera, setAtendimentosEspera] = useState([]);
  const [atendimentosPotencial, setAtendimentosPotencial] = useState([]);

  useEffect(() => {
    let newAtendimentos = attendances.filter((att) => att.atendente === user._id)
    setAtendimentos(newAtendimentos);
  }, [attendances]);

  useEffect(() => {
    let newAtendimentosEspera = waitingAttendances
    setAtendimentosEspera(newAtendimentosEspera);
  }, [waitingAttendances]);

  useEffect(() => {
    let newAttendances = attendances.filter((att) =>{
      return !att.waiting && !att.atendente && att.historico[att.historico.length - 1]?.action !== 'Finalizado' && new Date(att.lastMessage?.createdAt).getTime() > new Date(Date.now() - (1000 * 60 * 60 * 24)).getTime()
    });
    setAtendimentosPotencial(newAttendances);
  }, [attendances]);
 
  const views = {
    "espera": <AtendimentosEspera atendimentos={atendimentosEspera}/>,
    "potencial": <AtendimentosPotencial atendimentos={atendimentosPotencial}/>,
    "meus": <MeusAtendimentos atendimentos={atendimentos}/>
  }
    
  return (
    <View style={styles.container}>
      {selectedAtendimento ? <Chat tipo={"att"}/> : views[props.type]}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      width:"100%",
      flex: 1,
      backgroundColor: '#FFF',
      color: '#111',
    }

});

