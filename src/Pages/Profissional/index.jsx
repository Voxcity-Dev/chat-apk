import React ,{ useContext, useEffect, useState }from 'react'
import { StyleSheet, View, Text} from 'react-native';
import NavigationBar from '../navBar';
import { UserContext } from '../../../context/UserProvider';
import { Button } from '@rneui/base';

export default function Profissional() {
    const {deslogar} = useContext(UserContext);


  return (
    <View style={styles.container}>
      <Text>Profissional</Text>
      <Button style={styles.btnSair} onPress={deslogar}>Sair</Button>
      <NavigationBar currentPage='Profissional'/>
    </View>

  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: '#FFF',
        gap:20,
    },  
    btnSair:{
        width:"95%",
        height:40,
        color:"#FFF",
        backgroundColor:"#142a4c",
        padding:10,
        alignItems:"center",
        marginTop:10,
    },
  });


