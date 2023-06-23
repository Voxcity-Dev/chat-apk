import React ,{ useContext,  useState } from 'react'
import { StyleSheet, View,  TouchableOpacity} from 'react-native';
import NavigationBar from '../navBar';
import { Icon } from '@rneui/themed';
import Atendimentos from '../../Atendimento';
import { AttendanceContext } from '../../../context/AttendanceProvider';

export default function Atendimento() {
  const { selectedAtendimento } = useContext(AttendanceContext);
  const [type, setType] = useState("meus");

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
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonBox} onPress={() => selectAtendimento("potencial")}>
          <Icon name="people-sharp" type="ionicon" size={25} color={type === "potencial" ? "#142a4c" : "#9ac31c" } />
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
      marginTop:10,
    },
    buttonBox:{
      width:"33.3%",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      backgroundColor:"#F8f8f8",
    }
  });

