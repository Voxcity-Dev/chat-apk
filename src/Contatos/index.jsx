import React from 'react'
import { View,StyleSheet } from 'react-native';
import PrivadoList from './Privado/index';
import GrupoList from './Grupo/index';

export default function Contatos(props) {
  let pages = {
    privado: <PrivadoList />,
    grupo: <GrupoList />,
  }

  return (
    <View style={styles.container}>
      {
        props.tipo === 'privado' ? pages.privado : pages.grupo
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