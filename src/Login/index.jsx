import React, { useState, useContext } from 'react';
import { StyleSheet, View,Image, TouchableOpacity,Text,ActivityIndicator } from 'react-native';
import { userContext } from '../../context/userContext';
import Conta from './inputs/conta';
import Email from './inputs/email';
import Senha from './inputs/senha';


export default function Login() {
  const {Logar,loading} = useContext(userContext);
  const [login, setLogin] = useState({conta: '', email: '', senha: ''})
  const allInputs = { 
    conta: <Conta captureText={captureText}/>,
    email: <Email captureText={captureText}/>,
    senha: <Senha captureText={captureText}/>,
  };

  function captureText(text, name) {
    setLogin({
      ...login,
      [name]: text,
    });
  }

  function handleLogin() {
    Logar(login.email, login.senha, login.conta);
  }

  
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/VOX-LOGO-Vertical.png')} style={{width: "50%", height:100}}/>
      {
        Object.keys(allInputs).map((key,index) => {
          return (
            <View key={index} style={{width:"100%"}}>
              {allInputs[key]}
            </View>
          );
        })
      }

      <TouchableOpacity style={styles.btnEntrar} onPress={handleLogin}>
        {loading ? <ActivityIndicator size="small" color="#9ac31c" /> : <Text style={{color:"#FFF"}}>Entrar</Text>}
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFF',
    gap:20,
  },
  btnEntrar:{
    width:"95%",
    height:40,
    color:"#FFF",
    backgroundColor:"#142a4c",
    padding:10,
    alignItems:"center",
    marginTop:10,
  },
});
