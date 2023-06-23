import React from 'react'
import { View,StyleSheet,Text } from 'react-native';

export default  function AtendimentosPotencial () {
  return (
   <View style={styles.container}>
        <Text>Atendimentos Potencial</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#111',
      gap:20,
    }

});