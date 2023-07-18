import React, { useContext, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { AttendanceContext } from '../../../context/AttendanceProvider';
//import { Icon } from '@rneui/themed';
//import NovoAtendimento from './novoAtendimento';

export default function MeusAtendimentos(props) {
  const { setSelectedAtendimento } = useContext(AttendanceContext);
  // const [novoAtendimento, setNovoAtendimento] = useState(false);

  function countAndSlice(message) {
    if (!message) return ""
    let count = message.length
    if (count > 20) {
      message = message.slice(0, 20)
      message = message + "..."
    }
    return message
  }

  function nameInsert(att) {
    if (att.pushname) {
      return att.pushname
    } else if (att.nome) {
      return att.nome
    } else {
      return att.telefone
    }
  }

  function timeHasZero(time) {
    if (time < 10) return "0" + time;
    return time;
  }

  function handleSelectedAtendimento(att) {
    setSelectedAtendimento(att);
  }


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Meus Atendimentos</Text>
      {/* {
      novoAtendimento ? <NovoAtendimento setNovoAtendimento={setNovoAtendimento}/> : 
      <View >
        <TouchableOpacity style={styles.buttonBox} onPress={()=>setNovoAtendimento(true)}>
          <Icon name="add-sharp" type="ionicon" size={25} color={"#142a4c"} />
          <Text style={styles.buttonText}>Novo Atendimento</Text>
        </TouchableOpacity> */}

      {
        props.atendimentos.map((att) => {
          let lastMsgTime
          let formatedDate
          let formatedTime
          if (att.lastMessage) {
            lastMsgTime = new Date(att.lastMessage.createdAt);
            formatedDate = timeHasZero(lastMsgTime.getDate()) + "/" + (timeHasZero(lastMsgTime.getMonth() + 1)) + "/" + timeHasZero(lastMsgTime.getFullYear());
            formatedTime = timeHasZero(lastMsgTime.getHours()) + ":" + timeHasZero(lastMsgTime.getMinutes());
          }

          return (
            <TouchableOpacity style={styles.contactBox} key={att._id} onPress={() => handleSelectedAtendimento(att)}>
              {
                att.foto ? <Image source={{ uri: att.foto }} style={styles.image} /> : <Image source={require('../../../assets/avatar2.png')} style={styles.image} />
              }
              <View style={styles.contactInfo}>
                <Text style={styles.buttonText}>{nameInsert(att)}</Text>
                <Text style={{ color: "#142a4c", fontSize: 12 }}>{countAndSlice(att.lastMessage?.message)}</Text>
                <Text style={{ color: "#142a4c", fontSize: 12 }}>{formatedDate} {formatedTime}</Text>
              </View>
            </TouchableOpacity>
          )
        }
        )
      }

      {
        props.atendimentos.length === 0 ? <Text style={{ color: "#142a4c", fontSize: 12, textAlign: "center" }}>Nenhum atendimento encontrado</Text> : null
      }
    </View>
    //}

    //</View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: '#FFF',
    color: '#111',
    alignItems: "center",
  },
  buttonBox: {
    width: "100%",
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 10,
  },
  buttonText: {
    color: "#142a4c",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginLeft: 10,
    marginTop: 10,
  },
  contactBox: {
    width: "100%",
    height: 80,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "row",
    color: "#142a4c",
    padding: 10,
  },
  contactInfo: {
    width: "100%",
    height: 100,
    marginLeft: 20,
  },
  text: {
    color: "#142a4c",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginLeft: 10,
    width: "50%",
    borderBottomWidth: 1,
    borderColor: "#9ac31c",
    textAlign: "center"
  },

});