import React, { useContext } from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { Icon } from '@rneui/themed';
import { ContactContext } from '../../../context/ContacProvider';
import { GroupContext } from '../../../context/GroupProvider';
import { AttendanceContext } from '../../../context/AttendanceProvider';
import { useNavigation } from '@react-navigation/native';
import apiUser from '../../../apiUser';

export default function Header() {
  const { selectedContact,setSelectedContact } = useContext(ContactContext);
  const { selectedGroup,setSelectedGroup } = useContext(GroupContext);
  const { selectedAtendimento,setSelectedAtendimento } = useContext(AttendanceContext);
  const navigation = useNavigation();


  function backToContacts(){
    navigation.navigate('Chat Privado')
    setSelectedContact(null)
  };
   function backToGroups(){
    setSelectedGroup(null)
    navigation.navigate('Chat Grupo')
  };

  function backToAtendimentos(){
    setSelectedAtendimento(null)
    navigation.navigate('Atendimento')
  };

  function finishAtendimento(selectedContact){
    let newContact = JSON.parse(JSON.stringify(selectedContact))
    delete newContact.allMessages;
    apiUser.post("/atendimentos/finish", { contact: newContact }).then((res) => {
      alert("Atendimento finalizado com sucesso!");
      setSelectedAtendimento(null)
    });
  }

  function transferAtendimento(){
    navigation.navigate('Transferir Atendimento')
  }

  return (
    <View>
      
      {selectedGroup && (
        <View style={styles.groupNameContainer}>
          <Icon name='arrow-back-outline' type='ionicon'style={styles.icone} color={"#FFF"} onPress={backToGroups}/>
          {selectedGroup.foto ? (
            <Image source={{ uri: selectedGroup.foto }} style={{ width: 40, height: 40, borderRadius: 20 }} />) : (
              <Image source={require('../../../assets/avatar2.png')} style={{ width: 40, height: 40, borderRadius: 20 }} />
            )
          }          
          <Text style={styles.groupNameText}>{selectedGroup.nome}</Text>
        </View>
      )}

      {selectedContact && (
        <View style={styles.contactNameContainer}>
          <Icon name='arrow-back-outline' type='ionicon'style={styles.icone} color={"#FFF"} onPress={backToContacts}/>  
          {selectedContact.foto ? (
            <Image source={{ uri: selectedContact.foto }} style={{ width: 40, height: 40, borderRadius: 20 }} />) : (
              <Image source={require('../../../assets/avatar2.png')} style={{ width: 40, height: 40, borderRadius: 20 }} />
            )
          }
          <Text style={styles.contactNameText}>{selectedContact.nome} - {selectedContact.status}</Text>
        </View>
      )}

      {selectedAtendimento && (
        <View style={styles.contactNameContainer}>
          <Icon name='arrow-back-outline' type='ionicon'style={styles.icone} color={"#FFF"} onPress={backToAtendimentos}/>
          {selectedAtendimento.foto ? (
            <Image source={{ uri: selectedAtendimento.foto }} style={{ width: 40, height: 40, borderRadius: 20 }} />) : (
              <Image source={require('../../../assets/avatar2.png')} style={{ width: 40, height: 40, borderRadius: 20 }} />
            )
          }
          <Text style={styles.contactNameText}>{selectedAtendimento.pushname ? selectedAtendimento.pushname : selectedAtendimento.telefone}</Text>

          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"flex-end",width:"40%"}}>
            <Icon name='checkmark-done-outline' type='ionicon' color={"#FFF"} onPress={()=>{finishAtendimento(selectedAtendimento)}}/>
            <Icon name="swap-horizontal-outline" style={{marginLeft:10,marginRight:0}} type="ionicon" size={25} color={"#FFF"} onPress={()=> transferAtendimento()} />
          </View>

        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  groupNameContainer: {
    width: '100%',
    backgroundColor: '#9ac31c',
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    border: 'none',
  },
  groupNameText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },contactNameContainer:{
    backgroundColor: '#9ac31c',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    border: 'none',
  },
  contactNameText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },icone:{
    margin: 5,
    padding: 3,
    resizeMode: 'stretch',
    alignItems: 'center',
    color:"#FFF",
  } , overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF',
    zIndex: 9999,
  },
});
