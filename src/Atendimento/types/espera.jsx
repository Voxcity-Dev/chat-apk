import React,{useContext,useEffect,useState} from 'react'
import { View,StyleSheet,Text,TouchableOpacity,Image } from 'react-native';
import { UserContext } from '../../../context/UserProvider';
import { useNavigation } from '@react-navigation/native';


export default  function AtendimentosEspera (props) {
  const { userContext } = useContext(UserContext);
  const navigation = useNavigation();

  function timeHasZero(time) {
    if (time < 10) return "0" + time;
    return time;
  }

  function nameInsert(att){
    if(att.pushname){
      return att.contato.pushname
    }else if(att.contato.Nome){
      return att.contato.Nome
    }else{
      return att.contato.telefone
    }
  }

  function countAndSlice(message) {
    if (!message) return ""
    let count = message.length
    if (count > 20) {
      message = message.slice(0, 20)
      message = message + "..."
    }
    return message
  }

  function handleSelectedAtendimento(){
    navigation.navigate("Atendimento");
  }


  return (
    <View style={styles.container}>
      {
        props.atendimentos.map((att,i) => {
          let contact = att.contato;
          let lastHist = contact.historico[contact.historico.length - 1];
          let waitingTime = new Date(lastHist?.data);
          let formatedDate = timeHasZero(waitingTime.getDate()) + "/" + (timeHasZero(waitingTime.getMonth()+ 1)) + "/" + timeHasZero(waitingTime.getFullYear());
          let formatedTime = timeHasZero(waitingTime.getHours()) + ":" + timeHasZero(waitingTime.getMinutes());
          let redirectedGrp = userContext?.pref.services.voxbot.atendentes.find(grp => grp._id === contact.grupo);
          let attend = userContext?.pref.users.find(user => user._id === lastHist?.user)?.nome;
          if (!attend) attend= " Pelo Robô"
          else attend = " Por " + attend
          
          return(
          <TouchableOpacity style={styles.contactBox} key={i} onPress={()=>handleSelectedAtendimento()}>
            {
              att.foto ? <Image style={styles.image} source={{uri: att.foto}}/> : <Image style={styles.image} source={require('../../../assets/avatar2.png')}/>
            }
            <View style={styles.contactInfo}>
              <Text style={styles.buttonText}>{nameInsert(att)}</Text>
              <Text style={{color:"#142a4c",fontSize:12}}>{countAndSlice(contact.lastMessage?.message)}</Text>
              {
                lastHist ? <Text style={{color:"#142a4c",fontSize:8}}>{formatedDate} às {formatedTime} {attend}</Text> : null
              }
              {
                waitingTime && redirectedGrp ? <Text style={{color:"#142a4c",fontSize:10}}>Redirecionado para {redirectedGrp.nome} às {formatedTime} de {formatedDate} {attend}</Text> : null
              }
            </View>
          </TouchableOpacity>
        )})
      }
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      width:"100%",
      flex: 1,
      backgroundColor: '#FFF',
      color: '#111',
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 100,
      marginLeft:10,
      marginTop:10,
    },
    contactBox: {
      width:"100%",
      height:80,
      display:"flex",
      alignItems:"flex-start",
      justifyContent:"flex-start",
      flexDirection:"row",
      color:"#142a4c",
      backgroundColor:"#F8F8F8",
      padding:10,
    },
    buttonText:{
      color:"#142a4c",
      fontSize:16,
      fontWeight:"bold",
      marginTop:10,
    },
    contactInfo:{
      width:"100%",
      height:100,
      marginLeft:20,
    }

});