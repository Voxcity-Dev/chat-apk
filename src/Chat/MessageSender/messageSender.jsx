import React, { useState, useContext,useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { UserContext } from '../../../context/UserProvider';
import { ContactContext } from '../../../context/ContacProvider';
import { GroupContext } from '../../../context/GroupProvider';
import { AttendanceContext } from '../../../context/AttendanceProvider';
import AudioRecorder from './audioRecorder';
import FileInput from './fileInput';
import apiUser from '../../../apiUser';
import { Icon } from '@rneui/themed';

export default function MessageSender(props) {
  const { socket } = useContext(UserContext);
  const { selectedContact } = useContext(ContactContext);
  const { selectedGroup } = useContext(GroupContext);
  const { selectedAtendimento } = useContext(AttendanceContext);
  const [contact, setContact] = useState({});
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [files, setFiles] = useState([])
  const [audio, setAudio] = useState(null);


    useEffect(() => {
      if(selectedContact && props.tipo === "private"){
          let newCont = selectedContact ? { ...selectedContact } : {};
          setContact(newCont);
      }
    }, [selectedContact]);

    useEffect(() => {
      if(selectedGroup && props.tipo === "group"){
        let newCont = selectedGroup ? { ...selectedGroup } : {};
        setContact(newCont);
      }
    }, [selectedGroup]);

    useEffect(() => {
      if(selectedAtendimento && props.tipo === "att"){
        let newCont = selectedAtendimento ? { ...selectedAtendimento } : {};
        setContact(newCont);
      }
    }, [selectedAtendimento]);

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
      if (files.length > 0) return true
      if (audio) return true
      return false
    }

    function sendMessage(e) {
      e.preventDefault();
      if (!messageExist()) return;
      
      let data = {};
      let deepCloneContact = JSON.parse(JSON.stringify(contact));
      delete deepCloneContact.allMessages;
      if (props.tipo === "private") data = { message, audio, files, to: deepCloneContact._id }
      if (props.tipo === "group") data = { message, audio, files, to: deepCloneContact }
      if(props.tipo === "att") data = { message, audio, files, to: deepCloneContact }
      
      let formData = new FormData();
      formData.append('message', message);
      formData.append('to', deepCloneContact._id);
      formData.append('type', props.tipo);
    
      if (props.tipo === "group") {
        formData.append('users', deepCloneContact.usuarios);
      }
      
      if (props.tipo === "att") {
        formData.append('telefone', deepCloneContact.telefone);
        formData.append('bot', deepCloneContact.bot);
      }

      if (audio) {
        let audioConfig = {
          uri: audio,
          type: 'audio/m4a',
          name: 'usuario.m4a',
        };
        formData.append('audio', audioConfig);
        if (props.tipo !== "att") {
          apiUser.post('/upload/audio', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }).then(resp => {
            setFiles({});
            setMessage("");
            setAudio(null);
          }).catch(err => console.log(err));

        } else {
          apiUser.post('/whats/upload/audio', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }).then(resp => {
            setFiles({});
            setMessage("");
            setAudio(null);
          }).catch(err => console.log(err));
        }
      } else if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let fileConfig = {
            uri: files[i].uri,
            type: files[i].mimeType,
            name: files[i].name || 'file',
          }
          formData.append('files', fileConfig);
        }
        if (props.tipo === "att") {
          formData.append('telefone', deepCloneContact.telefone);
          formData.append('bot', deepCloneContact.bot);
        }
        if (props.tipo !== "att") {
          apiUser.post('/upload/messageFiles',formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }).then(resp => {
            setFiles([]); // Alterado para um array vazio
            setMessage("");
          }).catch(err => console.log(err));
        } else {
          apiUser.post('/whats/upload/files', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }).then(resp => {
            setFiles([]); // Alterado para um array vazio
            setMessage("");
          }).catch(err => console.log(err));
        }

      } else {
        console.log("enviando mensagem")
        socket.emit("send " + props.tipo, data);
      }
      
      setMessage("");
      setFiles({});
      setAudio(null);
    }
    

  

  return (

      
    <View style={{ flexDirection: 'row', alignItems: 'center',width:"100%",justifyContent:"space-evenly"}}>
      <TextInput style={styles.textInput} placeholder="Digite uma mensagem" value={message} onChangeText={(text)=>changeMessage(text)}/>
      <View style={styles.iconsView}>
        <TouchableOpacity style={styles.iconsStyle} onPress={(e)=> sendMessage(e)} >
          <Icon name="send-sharp" type="ionicon" size={25} color={"#9ac31c"} />
        </TouchableOpacity>

        <FileInput files={files} setFiles={setFiles} />

        <AudioRecorder audio={audio} setAudio={setAudio} />
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
    width:"70%",
    borderColor: '#142a4c',
    borderTopWidth: 1,
  },
  messageList: {
    flexGrow: 1,
  },
  iconsView:{
    width:"30%",
    height:40,
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    borderColor: '#142a4c',
    borderTopWidth: 1,
    borderLeftWidth: 1,
   },
  iconsStyle:{
    marginHorizontal:5,
  }
});
