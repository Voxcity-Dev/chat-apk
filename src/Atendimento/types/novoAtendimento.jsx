import React,{useContext,useEffect,useState} from 'react'
import { View,StyleSheet,Text,  TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import { FlowBotContext } from '../../../context/FlowBotProvider';
import { AttendanceContext } from '../../../context/AttendanceProvider';

export default  function NovoAtendimento (props) {
    const flowBotContext = useContext(FlowBotContext);
    const attendanceContext = useContext(AttendanceContext);
    const [contacts, setContacts] = useState([]);
    const [bots, setBots] = useState([]);

    useEffect(() => {
        let newBots = flowBotContext.bots.filter((bot) => bot.status === "ativo");
        setBots(newBots);
    }, [flowBotContext.bots]);

    useEffect(() => {
        let newContacts = [...attendanceContext.attendances]
        setContacts(newContacts);
        // setContactsOnShow(newContacts);
    }, [attendanceContext.attendances]);

  return (
   <View style={styles.container} >
        <TouchableOpacity style={styles.buttonBox} onPress={()=>props.setNovoAtendimento(false)}>
            <Icon name='close-circle-outline' type='ionicon' color={"#142a4c"} />
            <Text style={styles.buttonText}>Cancelar Novo Atendimento</Text>
        </TouchableOpacity>
        
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
    buttonBox:{
        width:"100%",
        height:50,
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",
        backgroundColor:"#F8f8f8",
        padding:10,
    },
    buttonText:{
        color:"#142a4c",
        fontSize:16,
        fontWeight:"bold",
        marginLeft:10,
    }

});