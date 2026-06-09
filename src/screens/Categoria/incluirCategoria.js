import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import api from '../../api/api';

export default function CategoriaScreenIncluir() {
  // useNavigation: Hook do React Navigation para gerenciar as rotas e histórico de telas.
  const navigation = useNavigation();

  const [nomeCategoria, setNomeCategoria] = useState('');
  const [descricaoCategoria, setDescricaoCategoria] = useState('');

  async function salvar() {
    if (
      !nomeCategoria ||
      nomeCategoria.trim().length < 3 ||
      nomeCategoria.trim().length > 45
    ) {
      Alert.alert('Atenção', 'Nome deve ter entre 3 e 45 caracteres');
      return;
    }

    if (
      !descricaoCategoria ||
      descricaoCategoria.trim().length < 10 ||
      descricaoCategoria.trim().length > 100
    ) {
      Alert.alert('Atenção', 'Descrição deve ter entre 10 e 100 caracteres');
      return;
    }

    const body = {
      nome: nomeCategoria.trim(),
      descricao: descricaoCategoria.trim(),
    };

    console.log('Body enviado:', body);

    try {
      const response = await api.post('/categorias', body);

      console.log('Sucesso:', response.data);

      Alert.alert('Sucesso', 'Categoria criada com sucesso!');

      // navigation.goBack: Remove a tela de inclusão da pilha e retorna o usuário à tela anterior.
      navigation.goBack();
    } catch (error) {
      console.log('Status:', error.response?.status);
      console.log('Erro:', error.response?.data);
      console.log('Mensagem:', error.message);

      Alert.alert(
        'Erro',
        error.response?.data?.message ||
          'Não foi possível criar a categoria.'
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Incluir Categoria</Text>

      <StatusBar style="auto" />

      <TextInput
        placeholder="Digite o nome da categoria"
        value={nomeCategoria}
        // onChangeText: Propriedade do RN que passa o texto digitado direto como string (dispensa o event.target.value da web).
        onChangeText={setNomeCategoria}
        style={styles.input}
      />

      <TextInput
        placeholder="Digite a descrição da categoria"
        value={descricaoCategoria}
        onChangeText={setDescricaoCategoria}
        style={styles.input}
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={salvar}
        >
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1: Expande o elemento para preencher toda a tela do dispositivo.
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center': Centraliza todos os componentes filhos na horizontal.
    alignItems: 'center',
  },

  titulo: {
    marginTop: 25,
    marginBottom: 25,
    fontSize: 20,
    fontWeight: 'bold',
  },

  input: {
    width: '95%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },

  actions: {
    // flexDirection: 'row': Alinha os botões lado a lado mudando o eixo principal para a horizontal.
    flexDirection: 'row',
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 5,
  },

  cancelButton: {
    backgroundColor: '#eee',
  },

  saveButton: {
    backgroundColor: '#4CAF50',
  },

  saveButtonText: {
    color: '#fff',
  },
});