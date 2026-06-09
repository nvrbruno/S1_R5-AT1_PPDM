import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';

export default function ProdutoScreen() {
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState([]);

  // useEffect: Dispara a busca inicial de dados assim que o componente é montado pela primeira vez.
  useEffect(() => {
    async function setup() {
      await loadData();
    }

    setup();
  }, []); // Dependência vazia garante uma única execução na inicialização da tela.

  // useFocusEffect: Hook do React Navigation disparado toda vez que a tela ganha foco (ex: ao voltar de outra tela).
  // useCallback: Memoiza a função interna para evitar recriações redundantes de memória a cada render.
  useFocusEffect(
    useCallback(() => {
      async function load() {
        await loadData();
      }

      load();
    }, []) // Evita loops infinitos de requisições travando a referência do efeito.
  );

  async function loadData() {
    try {
      const response = await api.get('/produtos');

      console.log('Produtos:', response.data);

      setProdutos(response.data.result);
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', error.message);
    }
  }

  async function deletarProduto(id) {
    Alert.alert(
      'Confirmação',
      'Deseja realmente excluir este produto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/produtos/${id}`);

              await loadData();

              Alert.alert(
                'Sucesso',
                'Produto excluído com sucesso!'
              );
            } catch (error) {
              console.log(error);

              Alert.alert(
                'Erro',
                error?.response?.data?.message ||
                  'Não foi possível excluir o produto.'
              );
            }
          },
        },
      ]
    );
  }

  function editarProduto(item) {
    navigation.navigate('ProdutoScreenEditar', item);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.titleScreen}>
          Gestão de produtos
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate('ProdutoScreenIncluir')
          }
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList: Componente de lista performático que recicla elementos visuais, renderizando apenas o que está visível. */}
      <FlatList
        data={produtos}
        // keyExtractor: Extrai uma string única para cada item da lista, otimizando o processo de re-renderização do React.
        keyExtractor={(item) => String(item.idProduto)}
        // contentContainerStyle: Aplica estilos diretamente ao container de rolagem interno da lista.
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.sideBar} />

            <View style={styles.conteudo}>
              <View style={styles.cardInner}>
                <View style={styles.cardContent}>
                  <Text style={styles.title}>
                    ID: {item.idProduto}
                  </Text>

                  <Text style={styles.title}>
                    Produto: {item.nomeProduto}
                  </Text>

                  <Text style={styles.title}>
                    Valor: R$ {item.valorProduto}
                  </Text>

                  <Text style={styles.title}>
                    Categoria ID: {item.idCategoria}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    { backgroundColor: '#E3F2FD' },
                  ]}
                  onPress={() => editarProduto(item)}
                >
                  <Text style={styles.iconText}>
                    ✏️ Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    { backgroundColor: '#FFEBEE' },
                  ]}
                  // Envia o objeto 'item' completo como parâmetro de rota para a tela de confirmação de exclusão.
                  onPress={() => navigation.navigate('ProdutoScreenExcluir', item)}
                >
                  <Text style={styles.iconText}>
                    🗑️ Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1: Permite que a View principal ocupe toda a dimensão vertical disponível no dispositivo.
    flex: 1,
    backgroundColor: '#fff',
  },

  sideBar: {
    width: 6,
    backgroundColor: '#FF9800',
  },

  conteudo: {
    flex: 1,
    padding: 5,
    // flexDirection: 'column': Empilha os blocos internos verticalmente (comportamento padrão do React Native).
    flexDirection: 'column',
  },

  cardInner: {
    flex: 1,
    padding: 16,
  },

  header: {
    // flexDirection: 'row': Alinha o título e o botão de "+" horizontalmente lado a lado.
    flexDirection: 'row',
    // justifyContent: 'space-between': Empurra os elementos do cabeçalho para as extremidades opostas.
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  titleScreen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 25,
  },

  addButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 20,
  },

  card: {
    flexDirection: 'row',
    width: '95%',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    marginTop: 12,
    marginHorizontal: 10,
    // overflow: 'hidden': Impede que elementos filhos ultrapassem os cantos arredondados estabelecidos pelo borderRadius.
    overflow: 'hidden',

    // shadowColor, shadowOpacity, shadowRadius, shadowOffset: Configurações nativas para renderização de sombras no iOS.
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    // elevation: Propriedade nativa para renderização de sombras físicas tridimensionais no ecossistema Android.
    elevation: 2,
  },

  cardContent: {
    marginBottom: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  actions: {
    flexDirection: 'row',
  },

  iconButton: {
    // flex: 1: Faz com que os botões de ação distribuam proporcionalmente a largura total horizontal interna do card.
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 5,
  },

  iconText: {
    fontWeight: '600',
  },
});