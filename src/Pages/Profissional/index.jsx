import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, BackHandler } from 'react-native';
import NavigationBar from '../navBar';
import { UserContext } from '../../../context/UserProvider';
import { ProfessionalContext } from '../../../context/ProfissionalProvider';
import AgendaSelecionada from '../../Agenda/agendaProfissional';

export default function Profissional() {
  const { user, pref } = useContext(UserContext);
  const { agendas } = useContext(ProfessionalContext);
  const [agendasProfissional, setAgendasProfissional] = useState([]);
  const [agendaSelecionada, setAgendaSelecionada] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', fecharAgenda);

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (user.profissional === true && agendas?.length > 0) {
      let newAgendaProfissional = agendas;
      newAgendaProfissional = agendas.filter(agenda => agenda.profissional === user._id);
      setAgendasProfissional(newAgendaProfissional);
    }
  }, [agendas, user]);

  function escolherAgenda(agenda) {
    setLoading(true);
    setTimeout(() => {
      setAgendaSelecionada(agenda);
      setLoading(false);
    }, 100); 
  }
  
  function fecharAgenda() {
    setLoading(true);

    setTimeout(() => {
      setAgendaSelecionada(null);
      setLoading(false);
    }, 100);
  }

  function acharEspecialidade(idEspecialidade) {
    let nomeEspecialidade = ''
    pref?.services?.agenda?.locais.forEach(local => {
      let especialidadeEncontrada = local?.especialidades.find((especialidade) => especialidade._id === idEspecialidade);
      if (especialidadeEncontrada) {
        nomeEspecialidade = especialidadeEncontrada?.nome;
      } else {
        return '';
      }
    });
    return nomeEspecialidade;
  }

  function acharLocal(idLocal) {
    let nomeLocal = ''
    pref?.services?.agenda?.locais.forEach(local => {
      if (local._id === idLocal) {
        nomeLocal = local.nome;
      } else {
        return '';
      }
    });
    return nomeLocal;
  }

  return (
    <View style={styles.container}>
      {
        agendaSelecionada ? (
          <TouchableOpacity onPress={() => fecharAgenda()} style={styles.btnSair}>
            {
              loading ? (
                <ActivityIndicator size="small" color="#9ac31c" />
              ) : (
                <Text style={{ color: '#FFF' }}>Fechar Agenda</Text>
              )
            }
          </TouchableOpacity>

        ) : (
          agendasProfissional?.map((agenda, index) => (
            <TouchableOpacity style={styles.btnSair} key={index} onPress={() => escolherAgenda(agenda)}>
              {
                loading ? (
                  <ActivityIndicator size="small" color="#9ac31c" />
                ) : (
                  <Text style={{ color: '#fff' }}>Agenda {acharEspecialidade(agenda.especialidade)}/{' '}{acharLocal(agenda.local)}</Text>
                )
              }
            </TouchableOpacity>
          ))
        )
      }

      {agendaSelecionada ? (
        <AgendaSelecionada agenda={agendaSelecionada} />
      ) :
        null}

      <NavigationBar currentPage='Profissional' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#FFF',
    gap: 20,
  },
  btnSair: {
    width: '95%',
    height: 40,
    color: '#FFF',
    backgroundColor: '#142a4c',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});
