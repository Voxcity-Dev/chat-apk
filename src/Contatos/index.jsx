import React from 'react'
import { View, StyleSheet } from 'react-native';
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
        props.tipo === 'private' ? pages.privado : pages.grupo
      }
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#FFF',
    gap: 20,
    marginBottom: 40,
  }
});