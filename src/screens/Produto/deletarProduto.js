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

export default function ProdutoScreenExcluir() {
  // useRoute: Hook do React Navigation para acessar os parâmetros enviados à tela atual.
  const route = useRoute();
  const navigation = useNavigation();

  const [idProduto, setIdProduto] = useState('');
  const [nomeProduto, setNomeProduto] = useState('');

  // useEffect: Monitora a propriedade route.params para preencher os dados do produto assim que a tela carregar.
  useEffect(() => {
    if (route.params) {
      setIdProduto(String(route.params.idProduto ?? ''));
      setNomeProduto(route.params.nomeProduto ?? '');
    }
  }, [route.params]);

  async function excluir() {
    try {
      await api.delete(`/produtos/${idProduto}`);

      Alert.alert(
        'Sucesso',
        'Produto excluído com sucesso!',
        [
          {
            text: 'OK',
            // navigation.goBack(): Executa o retorno imediato para a tela anterior após a confirmação do usuário.
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.log('Erro:', error.response?.data);

      Alert.alert(
        'Erro',
        error?.response?.data?.message ||
        'Não foi possível excluir o produto.'
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Excluir Produto</Text>

      <StatusBar style="auto" />

      <Text style={styles.label}>ID do Produto</Text>
      <TextInput
        value={idProduto}
        // editable={false}: Atributo nativo do RN que bloqueia o foco e a edição, transformando o input em apenas leitura.
        editable={false}
        style={styles.input}
      />

      <Text style={styles.label}>Nome do Produto</Text>
      <TextInput
        value={nomeProduto}
        editable={false}
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
          style={[styles.button, styles.deleteButton]}
          onPress={() =>
            Alert.alert(
              'Confirmação',
              'Deseja realmente excluir este produto?',
              [
                {
                  text: 'Não',
                  style: 'cancel'
                },
                {
                  text: 'Sim',
                  style: 'destructive', // style 'destructive': Altera a cor do texto do botão para vermelho no iOS.
                  onPress: excluir
                }
              ]
            )
          }
        >
          <Text style={{ color: '#fff' }}>
            Excluir
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1: Força a View principal a preencher 100% da área útil vertical do dispositivo.
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center': Alinha todos os elementos filhos na horizontal ao centro (eixo cruzado).
    alignItems: 'center',
  },

  titulo: {
    marginTop: 25,
    marginBottom: 25,
    fontSize: 18,
    fontWeight: 'bold',
  },

  label: {
    width: '95%',
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    width: '95%',
    backgroundColor: '#f5f5f5',
  },

  actions: {
    // flexDirection: 'row': Cria o alinhamento lado a lado dos botões (eixo principal horizontal).
    flexDirection: 'row',
    // justifyContent: 'flex-end': Desloca os botões totalmente para a extremidade direita da linha.
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

  deleteButton: {
    backgroundColor: '#F44336',
  },
});