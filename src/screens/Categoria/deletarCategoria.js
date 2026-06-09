import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';

export default function CategoriaScreen() {
  // useNavigation: Hook do React Navigation para gerenciar as rotas e navegação de telas.
  const navigation = useNavigation();
  
  // useState: Hook do React para gerenciar o estado local (reatividade dos dados).
  const [categorias, setCategorias] = useState([]);

  // useEffect: Executa uma única vez quando o componente é montado (renderizado pela primeira vez).
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
  }, []); // Array de dependências vazio limita a execução ao carregamento inicial.

  // useFocusEffect: Dispara o efeito sempre que esta tela ganha o foco (fica ativa) no app.
  // useCallback: Otimiza a performance, impedindo que a função seja recriada a cada renderização.
  useFocusEffect(
    useCallback(() => {
      async function load() {
        await loadData();
      }
      load();
    }, [])
  );

  async function loadData() {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data.result);
    } catch (error) {
      console.log(error);
      Alert.alert('Ocorreu um erro', error.message);
    }
  }

  async function deletarCategoria(id) {
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

              await api.delete(`/categorias/${id}`);
              await loadData();
              Alert.alert('Sucesso', 'Categoria deletada com sucesso!');

            } catch (error) {
              if (error?.message?.includes('FOREIGN KEY constraint failed')) {
                Alert.alert(
                  "Exclusão bloqueada",
                  "Essa categoria possui produtos vinculados."
                );
              } else {
                Alert.alert("Erro", "Não foi possível excluir a categoria.");
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

      navigation.navigate('CategoriaScreenEditar', item)

    } catch (error) {
      if (error?.message?.includes('FOREIGN KEY constraint failed')) {
        Alert.alert(
          "Exclusão bloqueada",
          "Essa categoria possui produtos vinculados."
        );
      } else {
        Alert.alert("Erro", "Não foi possível excluir a categoria.");
      }
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

      {/* FlatList: Componente de performance para listas, renderiza apenas o que está visível na tela. */}
      <FlatList
        data={categorias}
        keyExtractor={(item) => String(item.id)}
        // contentContainerStyle: Aplica estilização diretamente ao container interno de rolagem da lista.
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (

          <View style={styles.card}>

            <View style={styles.sideBar} />

            <View style={styles.conteudo}>

              <View style={styles.cardInner}>
                <View style={styles.cardContent}>
                  <Text style={styles.title}>ID: {item.id}</Text>
                  <Text style={styles.title}>Categoria: {item.Nome}</Text>
                </View>
              </View>

              <View style={styles.actions}>

                {/* Array no style: Permite combinar estilos do StyleSheet com estilos inline e condicionais. */}
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: "#E3F2FD" }]}
                  onPress={() => editarCategoria(item)}
                >
                  <Text style={styles.iconText}>✏️ Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: "#FFEBEE" }]}
                  onPress={() => deletarCategoria(item.id)}
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
    // flex: 1: Faz o elemento ocupar todo o espaço vertical/horizontal disponível na tela.
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
    // flexDirection: 'column': Alinhamento padrão do React Native (eixo principal vertical).
    flexDirection: 'column',
  },

  cardInner: {
    flex: 1,
    padding: 16,
  },

  header: {
    // flexDirection: 'row': Altera o eixo principal para horizontal (elementos lado a lado).
    flexDirection: "row",
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
    // overflow: 'hidden': Garante que os filhos (como o sideBar) respeitem o borderRadius do card.
    overflow: 'hidden',

    // Propriedades shadow: Sombra nativa exclusiva para o ecossistema iOS.
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    // elevation: Sombra nativa exclusiva para o ecossistema Android.
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