import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import AtendimentosEspera from './types/espera';
import MeusAtendimentos from './types/meusAtendimento';
import AtendimentosPotencial from './types/potencial';
import { AttendanceContext } from '../../context/AttendanceProvider';
import { UserContext } from '../../context/UserProvider';
import Chat from '../Chat/index';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

export default function Atendimentos(props) {
  const { user } = useContext(UserContext);
  const { attendances, myWaitingAtt, selectedAtendimento, setSelectedAtendimento } = useContext(AttendanceContext);
  const [atendimentos, setAtendimentos] = useState([]);
  const [atendimentosEspera, setAtendimentosEspera] = useState([]);
  const [atendimentosPotencial, setAtendimentosPotencial] = useState([]);
  const navigation = useNavigation();

  const [search, setSearch] = useState('');
  useEffect(() => {
    let newAtendimentos = attendances.filter((att) => att.atendente === user._id)
    if (search) newAtendimentos = newAtendimentos.filter((att) => att.pushname?.toLowerCase().includes(search.toLowerCase()));
    setAtendimentos(newAtendimentos);
    //   newContacts = newContacts.filter((contact)=>{
    //     let val = contact.nome ? contact.nome : contact.pushName ? contact.pushName : contact.telefone;
    //     return val.toLowerCase().includes(search.toLowerCase());
    // })
  }, [search, attendances]);

  useEffect(() => {
    let newAtendimentosEspera = myWaitingAtt
    if (search) newAtendimentosEspera = newAtendimentosEspera.filter((att) => att.pushname?.toLowerCase().includes(search.toLowerCase()));
    setAtendimentosEspera(newAtendimentosEspera);
  }, [search, myWaitingAtt]);

  useEffect(() => {
    let newAttendances = attendances.filter((att) => {
      return !att.waiting && !att.atendente && att.historico[att.historico.length - 1]?.action !== 'Finalizado' && new Date(att.lastMessage?.createdAt).getTime() > new Date(Date.now() - (1000 * 60 * 60 * 24)).getTime()
    });
    if (search) newAttendances = newAttendances.filter((att) => att.pushname?.toLowerCase().includes(search.toLowerCase()));
    setAtendimentosPotencial(newAttendances);
  }, [search, attendances]);


  const views = {
    "espera": <AtendimentosEspera atendimentos={atendimentosEspera} setSelectedAtendimento={setSelectedAtendimento} type={props.type} />,
    "potencial": <AtendimentosPotencial atendimentos={atendimentosPotencial} setSelectedAtendimento={setSelectedAtendimento} />,
    "meus": <MeusAtendimentos atendimentos={atendimentos} />
  }

  function navigateToNewAttendance() {
    navigation.navigate('Novo Atendimento')
  }

  return (
    <View style={styles.container}>
      {!selectedAtendimento && <Text style={styles.text}>
        {
          props.type === "espera" ? "Atendimentos em Espera" :
            props.type === "potencial" ? "Atendimentos Potenciais" :
              "Meus Atendimentos"
        }
      </Text>}
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

      {!selectedAtendimento ? (
        <TouchableOpacity onPress={navigateToNewAttendance} style={{ width: 70, backgroundColor: "#142a4c", padding: 10, borderRadius: 5, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 60, right: 10 }}>
          <View style={{ position: 'absolute', zIndex: 2, bottom: 24, left: 22 }}>
            <Icon type='entypo' name='plus' color="#9ac31c" size={25} />
          </View>
          <Icon type='ionicon' name='chatbox' color='#fff' size={45} />
        </TouchableOpacity>) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: '#FFF',
    color: '#111',
    position: 'relative',
    gap: 3,
  },
  searchContainer: {
    width: '92%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.4,
    borderColor: '#142a4c',
    height: 40,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
  searchInput: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: 40,
    color: '#142a4c',
    fontSize: 16,
  },
  text: {
    color: "#142a4c",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 10,
    width: "60%",
    borderBottomWidth: 1,
    borderColor: "#9ac31c",
    textAlign: "center",
    alignSelf: "center"
  },

});

