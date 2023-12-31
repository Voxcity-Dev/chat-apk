import React ,{ useContext,  useEffect,  useState } from 'react'
import { StyleSheet, View,  TouchableOpacity,Text} from 'react-native';
import NavigationBar from '../navBar';
import { Icon } from '@rneui/themed';
import Atendimentos from '../../Atendimento';
import { AttendanceContext } from '../../../context/AttendanceProvider';

export default function Atendimento() {
  const { selectedAtendimento,myWaitingAtt,attendances } = useContext(AttendanceContext);
  const [type, setType] = useState("meus");
  const [ waiting, setWaiting ] = useState();
  const [ atendimentosPotencial, setAtendimentosPotencial ] = useState();

  useEffect(() => {
    let newWaiting = myWaitingAtt.length
    setWaiting(newWaiting);
  }, [myWaitingAtt]);

  useEffect(() => {
    let newAttendances = attendances.filter((att) =>{
      return !att.waiting && !att.atendente && att.historico[att.historico.length - 1]?.action !== 'Finalizado' && new Date(att.lastMessage?.createdAt).getTime() > new Date(Date.now() - (1000 * 60 * 60 * 24)).getTime()
    });
    setAtendimentosPotencial(newAttendances.length);
  }, [attendances]);

  function selectAtendimento(type){
    setType(type);
  }

  return (
    <View style={styles.container}>

      {
        !selectedAtendimento ? 
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonBox} onPress={() => selectAtendimento("meus")}>
            <Icon name="person-sharp" type="ionicon" size={25} color={type === "meus" ? "#142a4c" : "#9ac31c" } />
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonBox} onPress={() => selectAtendimento("espera")}>
            <Icon name="time-sharp" type="ionicon" size={25} color={type === "espera" ? "#142a4c" : "#9ac31c" } />
            {waiting > 0 ? <Text style={styles.notification}>{waiting}</Text> : null}
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonBox} onPress={() => selectAtendimento("potencial")}>
            <Icon name="people-sharp" type="ionicon" size={25} color={type === "potencial" ? "#142a4c" : "#9ac31c" } />
            {atendimentosPotencial > 0 ? <Text style={styles.notification}>{atendimentosPotencial}</Text> : null}
          </TouchableOpacity>
        </View> : null
      }

      <Atendimentos type={type}/>

      {
        !selectedAtendimento ? <NavigationBar currentPage='Atendimento'/> : null
      }
        
    </View>

  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
      alignItems: 'center',
      justifyContent: 'flex-start',
      color: '#111',
    },
    buttonContainer:{
      width:"100%",
      height:50,
      display:"flex",
      alignItems:"center",
      justifyContent:"space-between",
      flexDirection:"row",
      backgroundColor:"#F8f8f8",
      padding:10,
    },
    buttonBox:{
      width:"33.3%",
      display:"flex",
      alignItems:"center",
      flexDirection:"row",
      justifyContent:"center",
      backgroundColor:"#F8f8f8",
    },
      notification: {
      backgroundColor: 'red',
      color: '#FFF',
      borderRadius: 25,
      width: 10,
      height: 10,
      textAlign: 'center',
      fontSize: 8,
  },
  });

