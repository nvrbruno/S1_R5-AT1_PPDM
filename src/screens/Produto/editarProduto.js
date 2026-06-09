import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import api from '../../api/api';

export default function ProdutoScreenEditar() {
  // useRoute: Hook que intercepta e extrai os parâmetros enviados por meio da rota de navegação.
  const route = useRoute();
  const navigation = useNavigation();

  const [idProduto, setIdProduto] = useState(null);
  const [idCategoria, setIdCategoria] = useState('');
  const [nomeProduto, setNomeProduto] = useState('');
  const [valorProduto, setValorProduto] = useState('');

  // useEffect: Disparado dinamicamente assim que a propriedade route.params sofre alguma alteração.
  useEffect(() => {
    console.log('Dados recebidos:', route.params);

    if (route.params) {
      setIdProduto(route.params.idProduto);
      setIdCategoria(String(route.params.idCategoria ?? ''));
      setNomeProduto(route.params.nomeProduto ?? '');
      setValorProduto(String(route.params.valorProduto ?? ''));
    }
  }, [route.params]); // Dependência direta: garante a sincronização caso os dados da rota mudem.

  async function salvar() {
    if (!nomeProduto || nomeProduto.trim().length < 3) {
      Alert.alert('Atenção', 'Digite um nome válido');
      return;
    }

    if (!valorProduto || isNaN(valorProduto)) {
      Alert.alert('Atenção', 'Digite um valor válido');
      return;
    }

    if (!idCategoria || isNaN(idCategoria)) {
      Alert.alert('Atenção', 'Digite um ID de categoria válido');
      return;
    }

    try {
      await api.put(`/produtos/${idProduto}`, {
        idCategoria: Number(idCategoria),
        nomeProduto,
        valorProduto: Number(valorProduto),
      });

      Alert.alert('Sucesso', 'Produto updated com sucesso!');
      // navigation.goBack(): Desempilha a tela atual e retorna o usuário à tela que disparou a chamada.
      navigation.goBack();
    } catch (error) {
      console.log('Erro:', error.response?.data);

      Alert.alert(
        'Erro',
        error?.response?.data?.message ||
          'Não foi possível atualizar o produto.'
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Produto</Text>

      <StatusBar style="auto" />
      
      <Text style={styles.label}>ID do Produto</Text>
      <TextInput
        placeholder="Ex: 1"
        value={idProduto ? String(idProduto) : ''}
        onChangeText={(text) => setIdProduto(Number(text))}
        // keyboardType="numeric": Modifica o comportamento do teclado nativo do sistema para exibir apenas números.
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>ID da Categoria</Text>
      <TextInput
        placeholder="Ex: 2"
        value={idCategoria}
        onChangeText={setIdCategoria}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Nome do Produto</Text>
      <TextInput
        placeholder="Digite o nome do produto"
        value={nomeProduto}
        onChangeText={setNomeProduto}
        style={styles.input}
      />

      <Text style={styles.label}>Valor do Produto</Text>
      <TextInput
        placeholder="Ex: 20.50"
        value={valorProduto}
        onChangeText={setValorProduto}
        keyboardType="numeric"
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
          <Text style={{ color: '#fff' }}>
            Salvar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1: Permite que o container base preencha de forma integral os limites da tela do celular.
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center': Centraliza todos os blocos de texto e inputs no eixo horizontal.
    alignItems: 'center',
    paddingTop: 20,
  },

  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  debugBox: {
    width: '95%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },

  label: {
    width: '95%',
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
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
    // flexDirection: 'row': Altera o fluxo empilhado (coluna) para alinhar os botões em linha (horizontal).
    flexDirection: 'row',
    // justifyContent: 'flex-end': Força o agrupamento dos botões para o limite direito do container.
    justifyContent: 'flex-end',
    width: '95%',
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