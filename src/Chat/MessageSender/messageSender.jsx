import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { UserContext } from '../../../context/UserProvider';
import AudioRecorder from './audioRecorder';
import FileInput from './fileInput';
import AudioPlayer from './audioPlayer';
import apiUser from '../../../apiUser';
import { Icon } from '@rneui/themed';

export default function MessageSender(props) {
  const { socket, contacts } = useContext(UserContext);
  const [contact, setContact] = useState({});
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [files, setFiles] = useState([]);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    let newContact = {...props.contato};
    setContact(newContact);
  }, [props.contato]);


  function changeMessage(text) {
    let newMessage = text;
    setMessage(newMessage);
    if (props.tipo === 'privado' && !typing) {
      socket.emit('typing', { to: contact._id });
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
      }, 3000);
    }
  }

  function clearMessage() {
    setMessage('');
    setFiles([]);
    setAudio(null);
  }

  function messageExist() {
    if (message.trim().length > 0) return true;
    if (files.length > 0) return true;
    if (audio) return true;
    return false;
  }

  function prepareMessageData() {
    let data = {};
    let deepCloneContact = JSON.parse(JSON.stringify(contact));
    delete deepCloneContact.allMessages;
    let expoToken = deepCloneContact.expoToken ? deepCloneContact.expoToken : '';
    if (props.tipo === 'private')
      data = { message, audio, files, to: deepCloneContact._id, expoToken: expoToken };
    let tokens = [];
    if (props.tipo === 'group') {
      deepCloneContact.usuarios.forEach(user => {
        contacts.forEach(contact => {
          if (contact._id === user) {
            if (contact.expoToken) tokens.push(contact.expoToken);
          }
        });
      });
      data = { message, audio, files, to: deepCloneContact, expoTokens: tokens };
    }
    if (props.tipo === 'att') data = { message, audio, files, to: deepCloneContact };
  
    return { data, deepCloneContact, expoToken, tokens };
  }
  
  function uploadAudio(formData, tipo) {
    if (tipo !== 'att') {
      return apiUser.post('/upload/audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      return apiUser.post('/whats/upload/audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  }
  
  function uploadFiles(formData, tipo) {
    if (tipo !== 'att') {
      return apiUser.post('/upload/messageFiles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      return apiUser.post('/whats/upload/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  }
  
  function sendMessage(e) {
    e.preventDefault();
    if (!messageExist()) return;
  
    const { data, deepCloneContact, expoToken, tokens } = prepareMessageData();
  
    let formData = new FormData();
    formData.append('message', message);
    formData.append('to', deepCloneContact._id);
    formData.append('type', props.tipo);
    formData.append('expoToken', expoToken);
  
    if (props.tipo === 'group') {
      formData.append('users', deepCloneContact.usuarios);
      formData.append('expoTokens', tokens);
    }
  
    if (props.tipo === 'att') {
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
      uploadAudio(formData, props.tipo)
        .then(resp => {
          setFiles({});
          setMessage('');
          setAudio(null);
        })
        .catch(err => console.log(err));
    } else if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        let fileConfig = {
          uri: files[i].uri,
          type: files[i].mimeType,
          name: files[i].name || 'file',
        };
        formData.append('files', fileConfig);
      }
      uploadFiles(formData, props.tipo)
        .then(resp => {
          setFiles([]); // Alterado para um array vazio
          setMessage('');
        })
        .catch(err => console.log(err));
    } else {
      socket.emit('send ' + props.tipo, data);
    }
  
    clearMessage();
  }
  

  return (
    <View style={styles.container}>
      {
        audio ? (
          <AudioPlayer style={styles.inputContainer}audio={audio} setAudio={setAudio} />
        ) : (
          <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Digite uma mensagem"
            value={message}
            onChangeText={text => changeMessage(text)}
          />
  
          <View style={styles.fileInputContainer}>
            <FileInput files={files} setFiles={setFiles} clearMessage={clearMessage}/>
          </View>
  
          {/* <View style={styles.fileInputContainer}>
            <Icon name="camera-sharp" type="ionicon" size={25} color={'#9ac31c'} />
          </View> */}
  
        </View>
        )
      }

      <View>

        {
          message.length > 0 || files.length > 0 || audio ?
              <View style={styles.boxSendButton}>
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Icon name="send-sharp" type="ionicon" color={'#9ac31c'} />
              </TouchableOpacity>
            </View>
            :
            (
            <View style={styles.audioRecorderContainer}>
              <AudioRecorder audio={audio} setAudio={setAudio} />
            </View>
          )
        }
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'flex-end',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f6f6f6',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
  },
  fileInputContainer: {
    marginLeft: 10,
  },
  audioRecorderContainer: {
    marginLeft: 10,
    backgroundColor: '#142a4c',
    padding: 5,
    borderRadius: 50,
  },
  sendButton: {
    marginLeft: 10,
  },
  boxSendButton:{
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#142a4c',
    borderRadius: 50,
  }
});