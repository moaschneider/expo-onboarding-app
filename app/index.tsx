import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AddListModal } from './components/AddListModal';
import ListItemsModal from './components/ListItemsModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';

interface ListItem {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
}

interface ShoppingList {
  id: string;
  name: string;
  itemCount: number;
  createdAt: Date;
  category: 'groceries' | 'household' | 'personal' | 'other';
  items: ListItem[];
}

interface Category {
  id: ShoppingList['category'];
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const categories: Category[] = [
  { id: 'groceries', name: 'Mercado', icon: 'cart-outline' },
  { id: 'household', name: 'Casa', icon: 'home-outline' },
  { id: 'personal', name: 'Pessoal', icon: 'person-outline' },
  { id: 'other', name: 'Outros', icon: 'apps-outline' },
];

export default function HomeScreen() {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShoppingList['category'] | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isItemsModalVisible, setIsItemsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  // Load theme preference from storage on app start
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        } else {
          // If no saved preference, use system theme
          const systemTheme = useColorScheme();
          setIsDark(systemTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  const toggleTheme = useCallback(async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('themePreference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, [isDark]);

  const handleAddList = (name: string, category: ShoppingList['category']) => {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      category,
      itemCount: 0,
      createdAt: new Date(),
      items: [],
    };
    setLists(prev => [...prev, newList]);
  };

  const handleUpdateList = (updatedList: ShoppingList) => {
    setLists(prev => prev.map(list => 
      list.id === updatedList.id ? updatedList : list
    ));
    setSelectedList(updatedList);
  };

  const handleOpenList = (list: ShoppingList) => {
    setSelectedList(list);
    setIsItemsModalVisible(true);
  };

  const handleDeleteList = (listId: string) => {
    setLists(prev => prev.filter(list => list.id !== listId));
    setSelectedList(null);
  };

  const handleDeleteFromMain = (list: ShoppingList, event: any) => {
    event.stopPropagation();
    setSelectedList(list);
    setIsDeleteModalVisible(true);
  };

  const filteredLists = lists.filter(list => {
    const matchesSearch = list.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || list.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? Colors.dark.background.primary : Colors.light.background.primary,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? Colors.dark.border : Colors.light.border,
    },
    greeting: {
      fontSize: 14,
      color: isDark ? Colors.dark.text.muted : Colors.light.text.muted,
      marginBottom: 4,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? Colors.dark.background.secondary : Colors.light.background.secondary,
      borderRadius: 12,
      paddingHorizontal: 16,
      marginTop: 16,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
      fontSize: 16,
    },
    categoriesContainer: {
      marginTop: 24,
      marginBottom: 16,
    },
    categoriesTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
      marginBottom: 12,
    },
    categoriesList: {
      flexDirection: 'row',
      gap: 12,
    },
    categoryButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDark ? Colors.dark.background.secondary : Colors.light.background.secondary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    categoryButtonActive: {
      backgroundColor: isDark ? Colors.dark.accent.primary : Colors.light.accent.primary,
    },
    categoryText: {
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
      fontSize: 14,
    },
    categoryTextActive: {
      color: Colors.light.text.inverse,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyStateIcon: {
      width: 120,
      height: 120,
      backgroundColor: isDark ? Colors.dark.background.secondary : Colors.light.background.secondary,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    emptyStateText: {
      fontSize: 18,
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
      textAlign: 'center',
      marginBottom: 8,
      fontWeight: '600',
    },
    emptyStateSubtext: {
      fontSize: 16,
      color: isDark ? Colors.dark.text.muted : Colors.light.text.muted,
      textAlign: 'center',
      lineHeight: 24,
    },
    addButton: {
      position: 'absolute',
      right: 16,
      bottom: 16,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: Colors.dark.background.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    listContainer: {
      marginTop: 16,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? Colors.dark.background.secondary : Colors.light.background.secondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    listIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? Colors.dark.background.tertiary : Colors.light.background.tertiary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    listInfo: {
      flex: 1,
    },
    listName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
      marginBottom: 4,
    },
    listDetails: {
      fontSize: 14,
      color: isDark ? Colors.dark.text.muted : Colors.light.text.muted,
    },
    checkedItems: {
      fontSize: 14,
      color: isDark ? Colors.dark.accent.primary : Colors.light.accent.primary,
      marginTop: 4,
    },
    deleteButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? Colors.dark.background.tertiary : Colors.light.error.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 12,
    },
    themeToggle: {
      position: 'absolute',
      right: 16,
      bottom: 88,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: isDark ? Colors.dark.background.secondary : Colors.light.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: Colors.dark.background.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    icon: {
      color: isDark ? Colors.dark.icon : Colors.light.icon,
    },
    text: {
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Animated.Text 
          style={[
            styles.greeting,
            { opacity: fadeAnim }
          ]}
        >
          {greeting}
        </Animated.Text>
        <Text style={styles.title}>Minhas Listas</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar listas..."
            placeholderTextColor={isDark ? Colors.dark.text.muted : Colors.light.text.muted}
          />
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>Categorias</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesList}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              >
                <Ionicons 
                  name={category.icon} 
                  size={16} 
                  color={selectedCategory === category.id 
                    ? Colors.light.text.inverse 
                    : (isDark ? Colors.dark.text.muted : Colors.light.text.muted)
                  } 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {filteredLists.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Ionicons 
                name="list" 
                size={48} 
                color={isDark ? Colors.dark.text.muted : Colors.light.text.muted} 
              />
            </View>
            <Text style={styles.emptyStateText}>
              Nenhuma lista encontrada
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Crie uma nova lista usando o botão abaixo{'\n'}
              ou ajuste seus filtros de busca.
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredLists.map((list) => (
              <TouchableOpacity 
                key={list.id} 
                style={styles.listItem}
                onPress={() => handleOpenList(list)}
              >
                <View style={styles.listIcon}>
                  <Ionicons 
                    name={categories.find(c => c.id === list.category)?.icon || 'cart-outline'} 
                    size={24} 
                    color={isDark ? Colors.dark.text.primary : Colors.light.text.primary}
                  />
                </View>
                <View style={styles.listInfo}>
                  <Text style={styles.listName}>{list.name}</Text>
                  <Text style={styles.listDetails}>
                    {list.itemCount} {list.itemCount === 1 ? 'item' : 'itens'} • 
                    Criada em {list.createdAt.toLocaleDateString()}
                  </Text>
                  {list.items.some(item => item.checked) && (
                    <Text style={styles.checkedItems}>
                      {list.items.filter(item => item.checked).length} de {list.itemCount} itens marcados
                    </Text>
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={(e) => handleDeleteFromMain(list, e)}
                >
                  <Ionicons 
                    name="trash-outline" 
                    size={20} 
                    color={isDark ? Colors.dark.error.primary : Colors.light.error.primary}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.themeToggle}
        onPress={toggleTheme}
      >
        <Ionicons 
          name={isDark ? "sunny" : "moon"} 
          size={24} 
          color={isDark ? Colors.dark.text.primary : Colors.light.text.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Ionicons 
          name="add" 
          size={32} 
          color={Colors.light.text.inverse}
        />
      </TouchableOpacity>

      <AddListModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={handleAddList}
      />

      {selectedList && (
        <ListItemsModal
          visible={isItemsModalVisible}
          onClose={() => {
            setIsItemsModalVisible(false);
            setSelectedList(null);
          }}
          list={selectedList}
          onUpdateList={handleUpdateList}
          onDeleteList={() => {
            handleDeleteList(selectedList.id);
            setIsItemsModalVisible(false);
          }}
          isDark={isDark}
        />
      )}

      {selectedList && (
        <DeleteConfirmationModal
          visible={isDeleteModalVisible}
          onClose={() => {
            setIsDeleteModalVisible(false);
            setSelectedList(null);
          }}
          onConfirm={() => {
            handleDeleteList(selectedList.id);
            setIsDeleteModalVisible(false);
          }}
          listName={selectedList.name}
        />
      )}
    </SafeAreaView>
  );
} 