import React from 'react'
import { View,StyleSheet,Text } from 'react-native';
import PrivadoList from './Privado/index';
import GrupoList from './Grupo/index';

export default function Contatos(props) {
  let pages = {
    privado: <PrivadoList style={{width:"100%"}}/>,
  }

  return (
    <View style={styles.container}>
      {
        props.tipo === 'privado' ? <PrivadoList style={{width:"100%"}}/> : props.tipo === 'grupo' ? <GrupoList style={{width:"100%"}}/> : <Text>Erro</Text>
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
        color: '#FFF',
        gap:20,
    }
});