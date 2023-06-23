import React, { useState, useContext,useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { UserContext } from '../../../context/UserProvider';
import { ContactContext } from '../../../context/ContacProvider';
import { GroupContext } from '../../../context/GroupProvider';
import { AttendanceContext } from '../../../context/AttendanceProvider';
import { Icon } from '@rneui/themed';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

export default function MessageSender(props) {
  const { socket } = useContext(UserContext);
  const { selectedContact } = useContext(ContactContext);
  const { selectedGroup } = useContext(GroupContext);
  const { selectedAtendimento } = useContext(AttendanceContext);
  const [contact, setContact] = useState({});
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [files, setFiles] = useState({})
  const [audio, setAudio] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');

    useEffect(() => {
      if(selectedContact && props.tipo === "private"){
          let newCont = selectedContact ? { ...selectedContact } : {};
          setContact(newCont);
      }
      if(selectedGroup && props.tipo === "group"){
          let newCont = selectedGroup ? { ...selectedGroup } : {};
          setContact(newCont);
      }
      if(selectedAtendimento && props.tipo === "att"){
          let newCont = selectedAtendimento ? { ...selectedAtendimento } : {};
          setContact(newCont);
      }
    }, [selectedContact]);

  function changeMessage(text) {
    let message = text
    let newMessage = message
    newMessage = message
    setMessage(newMessage)
        if(props.tipo=== "privado" && !typing){
            socket.emit("typing", {to:contact._id})
            setTyping(true)
            setTimeout(() => {
                setTyping(false)
            }, 3000);
        }
    }

    function messageExist() {
        if (message.trim().length > 0) return true
        // if (files.length > 0) return true
        // if (audio) return true
        return false
    }

    const startRecording = async () => {
      try {
        const path = await AudioRecorder.startRecording();
        console.log('Gravação iniciada:', path);
        setAudioPath(path);
        setRecording(true);
      } catch (error) {
        console.log('Erro ao iniciar a gravação:', error);
      }
    };
  
    const stopRecording = async () => {
      try {
        const path = await AudioRecorder.stopRecording();
        console.log('Gravação finalizada:', path);
        setRecording(false);
        setAudioPath(path);
      } catch (error) {
        console.log('Erro ao parar a gravação:', error);
      }
    };

    function sendMessage(e) {
      e.preventDefault()
      if (!messageExist()) return
      let data = {}
      let deepCloneContact = JSON.parse(JSON.stringify(contact))
      delete deepCloneContact.allMessages
      if (props.tipo === "private") data = { message, audio, files, to: deepCloneContact._id }
      if (props.tipo === "group") data = { message, audio, files, to: deepCloneContact }
      if(props.tipo === "att") data = { message, audio, files, to: deepCloneContact }
      let formData = new FormData();
      formData.append('type', props.tipo);
      if (props.tipo === "group") formData.append('users', deepCloneContact.usuarios)
      formData.append('message', message)
      formData.append('to',deepCloneContact._id)
      //prepare to send message and files e audio
      
      
      if (audio) {
        // formData.append('audio', audio);
        // if(props.msgType==="att"){
        //     formData.append('telefone', deepCloneContact.telefone)
        //     formData.append('bot', deepCloneContact.bot)
        // }
        // props.msgType !== "att" ? ApiUsers.post('/upload/audio', formData).then(resp => {
        //     setFiles({})
        //     setMessage("")
        // })
        // : ApiUsers.post('/whats/upload/audio', formData).then(resp => {
        //     setFiles({})
        //     setMessage("")
        // })
      }
      
      
      else if (files.length > 0) {
      //     for (let i = 0; i < files.length; i++) {
      //         formData.append('files', files[i])
      //     }
      //     if(props.msgType==="att"){
      //         formData.append('telefone', deepCloneContact.telefone)
      //         formData.append('bot', deepCloneContact.bot)
      //     }
      //     props.msgType !== "att" ? ApiUsers.post('/upload/messageFiles', formData).then(resp => {
      //         setFiles({})
      //         setMessage("")
      //     })
      //     : ApiUsers.post('/whats/upload/files', formData).then(resp => {
      //         setFiles({})
      //         setMessage("")
      //     })

      }
    
      else {
        socket.emit("send " + props.tipo, data)
      }
      setMessage("")
      setFiles({})
      setAudio(null)
  }



  return (

      
    <View style={{ flexDirection: 'row', alignItems: 'center',width:"100%"}}>
      <TextInput
        style={styles.textInput}
        placeholder="Digite uma mensagem"
        value={message}
        onChangeText={(text)=>changeMessage(text)}
      />
      <View style={styles.iconsView}>
        <TouchableOpacity style={styles.iconsStyle} onPress={(e)=> sendMessage(e)} >
            <Icon name="send-sharp" type="ionicon" size={25} color={"#9ac31c"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconsStyle} >
            <Icon name="mic-sharp" type="ionicon" size={25} color={"#9ac31c"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconsStyle} >
            <Icon name="attach-sharp" type="ionicon" size={25} color={"#9ac31c"} />
        </TouchableOpacity>
      </View>
    </View>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:"100%",
    position:"absolute",
    bottom:0,
  },
  textInput: {
    paddingHorizontal: 10,
    height: 40,
    width:"75%",
    borderColor: '#142a4c',
    borderTopWidth: 1,
  },
  messageList: {
    flexGrow: 1,
  },
  iconsView:{
    width:"25%",
    height:40,
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    borderColor: '#142a4c',
    borderTopWidth: 1,
    borderLeftWidth: 1,
   },
    iconsStyle:{
        marginHorizontal:5,
    }
});
