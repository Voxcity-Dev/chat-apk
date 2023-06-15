import React from 'react'
import { StyleSheet, View,TextInput } from 'react-native';
import { Icon } from '@rneui/themed';

export default function Conta (props){
  return (
    <View style={styles.bloco}>
        <Icon name='cafe-outline' type='ionicon'style={styles.icone}/>
        <TextInput placeholder="Escreva sua conta" style={styles.textInput} 
        onChangeText={(text) => props.captureText(text, 'conta')} 
        />
    </View>
  )
}

const styles = StyleSheet.create({
    textInput:{
     flex:1
    }
    ,container: {
      width: '98%',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      color: '#FFF',
      gap:5,
    }
    ,bloco:{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderWidth: 0.4,
      borderColor: '#142a4c',
      height: 40,
      borderRadius: 5,
      margin: 10,
    }
    ,icone:{
      margin: 5,
      padding: 3,
      resizeMode: 'stretch',
      alignItems: 'center',
  
    }
  });

