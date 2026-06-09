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

export default function CategoriaScreen() {
  const navigation = useNavigation();
  const [categorias, setCategorias] = useState([]);

  // useEffect: Executa a primeira chamada à API no momento exato em que o componente é montado.
  useEffect(() => {
    try {
      const setup = async () => {
        await loadData();
      }
      setup();
    } catch (error) {
      console.log(error);
      Alert.alert('Ocorreu um erro');
    }
  }, []); // Dependência vazia restringe a execução ao carregamento inicial da tela.

  // useFocusEffect: Hook do React Navigation acionado automaticamente sempre que a tela ganha foco.
  // useCallback: Memoiza a função para impedir recriações desnecessárias em memória a cada render.
  useFocusEffect(
    useCallback(() => {
      async function load() {
        await loadData();
      }
      load();
    }, []) // Array de dependências controla quando o callback deve ser reavaliado.
  );

  async function loadData() {
    try {
      const response = await api.get('/categorias');
      console.log('Dados da API:', JSON.stringify(response.data.result[0]));
      setCategorias(response.data.result);
    } catch (error) {
      console.log(error);
      Alert.alert('Ocorreu um erro', error.message);
    }
  }

  async function deletarCategoria(id) {
    console.log('Deletando categoria com ID:', id);
    
    Alert.alert('Confirmação', 'Deseja realmente excluir esta categoria?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!id || id <= 0) {
                Alert.alert('Atenção', 'ID da categoria é inválido');
                return
              }

              console.log('Fazendo DELETE para:', `/categorias/${id}`);
              const response = await api.delete(`/categorias/${id}`);
              console.log('Resposta DELETE:', response);
              
              await loadData();
              Alert.alert('Sucesso', 'Categoria deletada com sucesso!');

            } catch (error) {
              console.log('Erro ao deletar:', error);
              console.log('Erro response:', error.response);
              
              // Tratamento de Erro Dinâmico: Intercepta restrições de banco de dados diretamente da resposta da API.
              if (error?.response?.data?.message?.includes('FOREIGN KEY')) {
                Alert.alert(
                  "Exclusão bloqueada",
                  "Essa categoria possui produtos vinculados."
                );
              } else {
                Alert.alert("Erro", error?.response?.data?.message || "Não foi possível excluir a categoria.");
              }
            }
          }
        }
      ]
    )
  }

  async function editarCategoria(item) {
    try {
      if (!item) {
        Alert.alert('Atenção', 'Selecione uma categoria para editar');
        return
      }

      // navigation.navigate: Empilha a tela de edição e envia o objeto de dados completo via params.
      navigation.navigate('CategoriaScreenEditar', item)

    } catch (error) {
      Alert.alert("Erro", "Não foi possível editar a categoria.");
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.titleScreen}>Gestão de categorias</Text>

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CategoriaScreenIncluir')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList: Otimiza a rolagem da tela reciclando componentes visuais e ignorando itens fora do viewport. */}
      <FlatList
        data={categorias}
        // keyExtractor: Atribui um identificador único de texto para cada célula rastreada pela lista do algoritmo do React.
        keyExtractor={(item) => String(item.Id)}
        // contentContainerStyle: Aplica formatações e espaçamentos diretamente no container de scroll interno.
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (

          <View style={styles.card}>

            <View style={styles.sideBar} />

            <View style={styles.conteudo}>

              <View style={styles.cardInner}>
                <View style={styles.cardContent}>
                  <Text style={styles.title}>ID: {item.Id}</Text>
                  <Text style={styles.title}>Categoria: {item.Nome}</Text>
                </View>
              </View>

              <View style={styles.actions}>

                {/* Array no style: Permite estender estilos nomeados do StyleSheet com declarações locais/condicionais. */}
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: "#E3F2FD" }]}
                  onPress={() => editarCategoria(item)}
                >
                  <Text style={styles.iconText}>✏️ Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: "#FFEBEE" }]}
                  onPress={() => deletarCategoria(item.Id)}
                >
                  <Text style={styles.iconText}>🗑️ Excluir</Text>
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
    // flex: 1: Permite que a View ocupe toda a área útil de visualização vertical do smartphone.
    flex: 1,
    backgroundColor: '#fff',
  },

  sideBar: {
    width: 6,
    backgroundColor: "#FF9800",
  },

  conteudo: {
    flex: 1,
    padding: 5,
    // flexDirection: 'column': Mantém a orientação de empilhamento padrão do ecossistema mobile (eixo vertical).
    flexDirection: 'column',
  },

  cardInner: {
    flex: 1,
    padding: 16,
  },

  header: {
    // flexDirection: "row": Muda a orientação do container para posicionar os filhos lado a lado na horizontal.
    flexDirection: "row",
    // justifyContent: "space-between": Distribui uniformemente os elementos, empurrando-os para as extremidades opostas.
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  titleScreen: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },

  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 25,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 20,
  },

  card: {
    flexDirection: 'row',
    width: '95%',
    backgroundColor: "#ffffff",
    borderRadius: 6,
    marginTop: 12,
    marginHorizontal: 10,
    // overflow: "hidden": Garante que componentes filhos curvos ou retos fiquem contidos no contorno do borderRadius do card.
    overflow: 'hidden',

    // shadowColor, shadowOpacity, shadowRadius, shadowOffset: Conjunto de APIs nativas de sombreamento para o iOS.
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    // elevation: API nativa de elevação espacial para renderização de sombra no ecossistema Android.
    elevation: 2,
  },

  cardContent: {
    marginBottom: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  actions: {
    flexDirection: "row",
  },

  iconButton: {
    // flex: 1: Força os botões a crescerem e dividirem de forma idêntica a largura horizontal remanescente.
    flex: 1,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    marginEnd: 5
  },

  iconText: {
    fontWeight: "600",
  }
});