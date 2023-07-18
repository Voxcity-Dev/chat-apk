import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet,TextInput } from 'react-native';
import AtendimentosEspera from './types/espera';
import MeusAtendimentos from './types/meusAtendimento';
import AtendimentosPotencial from './types/potencial';
import { AttendanceContext } from '../../context/AttendanceProvider';
import { UserContext } from '../../context/UserProvider';
import Chat from '../Chat/index';
import { Icon } from '@rneui/themed';
export default function Atendimentos(props) {
  const { user } = useContext(UserContext);
  const { attendances, myWaitingAtt, selectedAtendimento, setSelectedAtendimento } = useContext(AttendanceContext);
  const [atendimentos, setAtendimentos] = useState([]);
  const [atendimentosEspera, setAtendimentosEspera] = useState([]);
  const [atendimentosPotencial, setAtendimentosPotencial] = useState([]);

  const [search, setSearch] = useState('');
  useEffect(() => {
    let newAtendimentos = attendances.filter((att) => att.atendente === user._id)
    if(search)newAtendimentos = newAtendimentos.filter((att) => att.pushname?.toLowerCase().includes(search.toLowerCase()));
    setAtendimentos(newAtendimentos);
  //   newContacts = newContacts.filter((contact)=>{
  //     let val = contact.nome ? contact.nome : contact.pushName ? contact.pushName : contact.telefone;
  //     return val.toLowerCase().includes(search.toLowerCase());
  // })
  }, [search,attendances]);

  useEffect(() => {
    let newAtendimentosEspera = myWaitingAtt
    if(search)newAtendimentosEspera = newAtendimentosEspera.filter((att) => att.pushname?.toLowerCase().includes(search.toLowerCase()));
    setAtendimentosEspera(newAtendimentosEspera);
  }, [search,myWaitingAtt]);

  useEffect(() => {
    let newAttendances = attendances.filter((att) => {
      return !att.waiting && !att.atendente && att.historico[att.historico.length - 1]?.action !== 'Finalizado' && new Date(att.lastMessage?.createdAt).getTime() > new Date(Date.now() - (1000 * 60 * 60 * 24)).getTime()
    });
    if(search)newAttendances = newAttendances.filter((att) => att.pushname?.toLowerCase().includes(search.toLowerCase()));
    setAtendimentosPotencial(newAttendances);
  }, [search,attendances]);


  const views = {
    "espera": <AtendimentosEspera atendimentos={atendimentosEspera} setSelectedAtendimento={setSelectedAtendimento} type={props.type} />,
    "potencial": <AtendimentosPotencial atendimentos={atendimentosPotencial} setSelectedAtendimento={setSelectedAtendimento} />,
    "meus": <MeusAtendimentos atendimentos={atendimentos} />
  }

  return (
    <View style={styles.container}>

      {selectedAtendimento ? <Chat tipo={"att"} /> :
        <>
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#142a4c" />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar"
              placeholderTextColor="#142a4c"
              onChangeText={(text) => setSearch(text)}
              value={search}
            />
          </View>
          {views[props.type]}
        </>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: '#FFF',
    color: '#111',
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderWidth: 1,
    borderColor: "#142a4c",
    marginLeft: 50,
    marginTop: 10,
  },
  searchInput: {
    width: "80%",
    marginLeft: 10,
    color: "#142a4c",
  }
  

});

