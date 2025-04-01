import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

interface ShoppingList {
  id: string;
  name: string;
  itemCount: number;
  createdAt: Date;
  category: 'groceries' | 'household' | 'personal' | 'other';
}

interface Category {
  id: ShoppingList['category'];
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface AddListModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, category: ShoppingList['category']) => void;
}

export function AddListModal({ visible, onClose, onAdd }: AddListModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ShoppingList['category']>('groceries');

  const categories: Category[] = [
    { id: 'groceries', name: 'Mercado', icon: 'cart-outline' },
    { id: 'household', name: 'Casa', icon: 'home-outline' },
    { id: 'personal', name: 'Pessoal', icon: 'person-outline' },
    { id: 'other', name: 'Outros', icon: 'apps-outline' },
  ];

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name.trim(), selectedCategory);
      setName('');
      onClose();
    }
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '90%',
      backgroundColor: isDark ? Colors.dark.background.primary : Colors.light.background.primary,
      borderRadius: 16,
      padding: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
    },
    closeButton: {
      padding: 4,
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
      marginBottom: 8,
    },
    input: {
      backgroundColor: isDark ? Colors.dark.background.secondary : Colors.light.background.secondary,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
    },
    categoriesContainer: {
      marginBottom: 20,
    },
    categoriesTitle: {
      fontSize: 16,
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
      marginBottom: 12,
    },
    categoriesList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    categoryButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
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
    submitButton: {
      backgroundColor: isDark ? Colors.dark.accent.primary : Colors.light.accent.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
    },
    submitButtonText: {
      color: Colors.light.text.inverse,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nova Lista</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons 
                name="close" 
                size={24} 
                color={isDark ? Colors.dark.text.primary : Colors.light.text.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nome da Lista</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Digite o nome da lista"
              placeholderTextColor={isDark ? Colors.dark.text.muted : Colors.light.text.muted}
              autoFocus
            />
          </View>

          <View style={styles.categoriesContainer}>
            <Text style={styles.categoriesTitle}>Categoria</Text>
            <View style={styles.categoriesList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Ionicons 
                    name={category.icon} 
                    size={16} 
                    color={selectedCategory === category.id 
                      ? Colors.light.text.inverse 
                      : (isDark ? Colors.dark.text.muted : Colors.light.text.muted)} 
                  />
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={!name.trim()}
          >
            <Text style={styles.submitButtonText}>Criar Lista</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}