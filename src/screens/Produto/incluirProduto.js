import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ProdutoScreenIncluir() {
  const navigation = useNavigation();

  const [nomeProduto, setNomeProduto] = useState();
  const [valorProduto, setValorProduto] = useState();
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState(null);

  const produtoRep = new ProdutoRepository();
  const categoriaRep = new CategoriaRepository();

  // useEffect: Dispara a busca no banco assim que a árvore de componentes termina de ser montada na tela.
  useEffect(() => {
    try {
      const setup = async () => {
        // const result = await categoriaRep.findAll();
        setCategorias(result);
      }
      setup();
    } catch (error) {
      console.log(error);
      Alert.alert('Ocorreu um erro');
    }
  }, []); // Array de dependências vazio limita a execução ao carregamento inicial.

  function salvar() {
    if (!nomeProduto || nomeProduto.trim().length < 3) {
      Alert.alert('Atencão', 'Informe corretamente o nome do produto');
      return
    }

    if (!categoriaId) {
      Alert.alert('Atenção', 'Selecione uma categoria');
      return
    }

    if (!valorProduto || valorProduto <= 0) {
      Alert.alert('Atenção', 'Informe um valor');
      return;
    }

    // produtoRep.create(categoriaId, nomeProduto, valorProduto);
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Incluir Produto</Text>
      <StatusBar style="auto" />

      <TextInput
        placeholder="Digite o nome do produto"
        value={nomeProduto}
        onChangeText={setNomeProduto}
        style={styles.input}
      />

      <TextInput
        placeholder="Digite valor do produto"
        value={valorProduto}
        style={styles.input}
        // keyboardType="numeric": Força a abertura do teclado numérico nativo do dispositivo.
        keyboardType="numeric"
        onChangeText={(text) => {
          // Expressão regular (Regex) para higienizar a entrada em tempo real, aceitando apenas números e ponto.
          const cleaned = text.replace(/[^0-9.]/g, '');

          const parts = cleaned.split('.');
          if (parts.length > 2) return;

          setValorProduto(cleaned);
        }}
      />

      <View style={styles.pickerContainer}>
        {/* Picker: Elemento nativo de seleção (dropdown). No iOS abre uma folha de escolha; no Android, um modal ou dropdown. */}
        <Picker
          selectedValue={categoriaId}
          onValueChange={(itemValue) => setCategoriaId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label='Selecione uma categoria' value={null} />

          {/* Renderização dinâmica: Mapeia o array do estado para componentes de item estruturados. */}
          {categorias.map((cat) => (
            <Picker.Item
              key={cat.Id} // key: Propriedade obrigatória do React para otimização de renderização na lista.
              label={cat.NomeCategoria}
              value={cat.Id}
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textButton}>Cancelar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={salvar}
      >
        {/* Array no style: Permite mesclar a estilização base com uma propriedade dinâmica/inline. */}
        <Text style={[styles.textButton, { color: '#fff' }]}>Salvar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1: Faz a View principal expandir e preencher 100% do espaço vertical e horizontal da tela.
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center': Alinha todos os filhos no centro do eixo horizontal (eixo cruzado).
    alignItems: 'center',
  },

  titulo: {
    marginTop: 25,
    marginBottom: 25,
    fontSize: 16,
    fontWeight: 'bold'
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    width: '95%',
    height: 50
  },

  actions: {
    // flexDirection: "row": Altera a direção padrão (coluna) para organizar os subelementos em linha.
    flexDirection: "row",
    // justifyContent: "flex-end": Alinha os itens totalmente ao final do eixo principal (direita).
    justifyContent: "flex-end",
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
    width: '95%',
    height: 48,
    // alignItems & justifyContent 'center': Garantem que o conteúdo interno (o texto) fique centralizado no botão.
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },

  cancelButton: {
    backgroundColor: "#eee",
  },

  saveButton: {
    backgroundColor: "#4CAF50",
  },

  pickerContainer: {
    width: '95%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
  },

  textButton: {
    fontSize: 16
  }
});