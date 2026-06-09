import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import api from '../../api/api';

export default function CategoriaScreenEditar() {
  // useRoute: Hook do React Navigation usado para capturar os parâmetros (dados) enviados de outra tela.
  const route = useRoute();
  const navigation = useNavigation();

  const [idCategoria, setIdCategoria] = useState(null);
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [descricaoCategoria, setDescricaoCategoria] = useState('');

  // useEffect: Executa o bloco sempre que houver alteração nos parâmetros da rota (route.params).
  useEffect(() => {
    if (route.params) {
      setIdCategoria(route.params.id);
      setNomeCategoria(route.params.nome ?? route.params.Nome ?? '');
      setDescricaoCategoria(route.params.descricao ?? '');
    }
  }, [route.params]); // Dependência explícita: monitora a chegada de dados de navegação.

  async function salvar() {
    if (!nomeCategoria || nomeCategoria.trim().length < 3 || nomeCategoria.trim().length > 45) {
      Alert.alert('Atenção', 'Nome deve ter entre 3 e 45 caracteres');
      return;
    }

    if (!descricaoCategoria || descricaoCategoria.trim().length < 10 || descricaoCategoria.trim().length > 100) {
      Alert.alert('Atenção', 'Descrição deve ter entre 10 e 100 caracteres');
      return;
    }

    if (!idCategoria || idCategoria <= 0) {
      Alert.alert('Atenção', 'Verifique o ID da categoria');
      return;
    }

    try {
      await api.put(`/categorias/${idCategoria}`, {
        nome: nomeCategoria,
        descricao: descricaoCategoria,
      });
      // navigation.goBack: Remove a tela atual da pilha e retorna o usuário para a tela anterior.
      navigation.goBack();
    } catch (error) {
      console.log('Erro:', error.response?.data);
      Alert.alert('Erro', 'Não foi possível atualizar a categoria.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Categoria</Text>
      <StatusBar style="auto" />

      <TextInput
        placeholder="ID da categoria"
        value={idCategoria ? String(idCategoria) : ''}
        onChangeText={(text) => setIdCategoria(Number(text))}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Digite o nome da categoria (3 a 45 caracteres)"
        value={nomeCategoria}
        onChangeText={setNomeCategoria}
        style={styles.input}
      />

      <TextInput
        placeholder="Digite a descrição (10 a 100 caracteres)"
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
          <Text style={{ color: '#fff' }}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center': Alinha todos os elementos filhos horizontalmente no centro do eixo cruzado.
    alignItems: 'center',
  },
  titulo: {
    marginTop: 25,
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    width: '95%',
  },
  actions: {
    // flexDirection: 'row': Alinha os botões "Cancelar" e "Salvar" lado a lado na horizontal.
    flexDirection: 'row',
    // justifyContent: 'flex-end': Empurra o grupo de botões totalmente para o canto direito da linha.
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
});