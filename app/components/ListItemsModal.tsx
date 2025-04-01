import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Colors } from '../../constants/Colors';

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

interface ListItemsModalProps {
  visible: boolean;
  onClose: () => void;
  list: ShoppingList;
  onUpdateList: (updatedList: ShoppingList) => void;
  onDeleteList?: (listId: string) => void;
  isDark: boolean;
}

export default function ListItemsModal({ 
  visible, 
  onClose, 
  list, 
  onUpdateList,
  onDeleteList,
  isDark 
}: ListItemsModalProps) {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const newItem: ListItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        quantity: parseInt(newItemQuantity) || 1,
        checked: false,
      };

      const updatedList = {
        ...list,
        items: [...list.items, newItem],
        itemCount: list.items.length + 1,
      };

      onUpdateList(updatedList);
      setNewItemName('');
      setNewItemQuantity('1');
    }
  };

  const toggleItemCheck = (itemId: string) => {
    const updatedItems = list.items.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    onUpdateList({
      ...list,
      items: updatedItems,
    });
  };

  const removeItem = (itemId: string) => {
    const updatedItems = list.items.filter(item => item.id !== itemId);
    
    onUpdateList({
      ...list,
      items: updatedItems,
      itemCount: updatedItems.length,
    });
  };

  const handleDeleteList = () => {
    if (onDeleteList) {
      onDeleteList(list.id);
      onClose();
    }
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: isDark ? Colors.dark.background.primary : Colors.light.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? Colors.dark.border : Colors.light.border,
      backgroundColor: isDark ? Colors.dark.background.secondary : Colors.light.background.secondary,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    headerTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
      marginLeft: 12,
    },
    deleteButton: {
      marginLeft: 12,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? Colors.dark.error.background : Colors.light.error.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    addItemContainer: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
      backgroundColor: isDark ? Colors.dark.background.secondary : Colors.light.background.secondary,
      padding: 12,
      borderRadius: 12,
    },
    itemInput: {
      flex: 1,
      backgroundColor: isDark ? Colors.dark.background.tertiary : Colors.light.background.tertiary,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
    },
    quantityInput: {
      width: 60,
      backgroundColor: isDark ? Colors.dark.background.tertiary : Colors.light.background.tertiary,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
      textAlign: 'center',
    },
    addButton: {
      backgroundColor: isDark ? Colors.dark.accent.primary : Colors.light.accent.primary,
      borderRadius: 8,
      padding: 12,
      justifyContent: 'center',
    },
    itemsList: {
      flex: 1,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? Colors.dark.background.secondary : Colors.light.background.secondary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    itemInfo: {
      flex: 1,
      marginLeft: 12,
    },
    itemName: {
      fontSize: 16,
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
      textDecorationLine: 'none',
    },
    itemNameChecked: {
      textDecorationLine: 'line-through',
      color: isDark ? Colors.dark.text.muted : Colors.light.text.muted,
    },
    itemQuantity: {
      fontSize: 14,
      color: isDark ? Colors.dark.text.secondary : Colors.light.text.secondary,
      marginTop: 4,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyStateText: {
      fontSize: 16,
      color: isDark ? Colors.dark.text.muted : Colors.light.text.muted,
      textAlign: 'center',
      marginTop: 12,
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDark ? Colors.dark.text.primary : Colors.light.text.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{list.name}</Text>
          {onDeleteList && (
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => setIsDeleteModalVisible(true)}
            >
              <Ionicons 
                name="trash-outline" 
                size={20} 
                color={isDark ? Colors.dark.error.text : Colors.light.error.text}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.itemInput}
              value={newItemName}
              onChangeText={setNewItemName}
              placeholder="Adicionar item..."
              placeholderTextColor={isDark ? Colors.dark.text.muted : Colors.light.text.muted}
            />
            <TextInput
              style={styles.quantityInput}
              value={newItemQuantity}
              onChangeText={setNewItemQuantity}
              keyboardType="number-pad"
              placeholder="Qtd"
              placeholderTextColor={isDark ? Colors.dark.text.muted : Colors.light.text.muted}
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddItem}
              disabled={!newItemName.trim()}
            >
              <Ionicons 
                name="add" 
                size={24} 
                color={isDark ? Colors.dark.text.inverse : Colors.light.text.inverse}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.itemsList}>
            {list.items && list.items.length > 0 ? (
              list.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <TouchableOpacity onPress={() => toggleItemCheck(item.id)}>
                    <Ionicons 
                      name={item.checked ? "checkbox" : "square-outline"} 
                      size={24} 
                      color={isDark ? Colors.dark.accent.primary : Colors.light.accent.primary}
                    />
                  </TouchableOpacity>
                  <View style={styles.itemInfo}>
                    <Text style={[
                      styles.itemName,
                      item.checked && styles.itemNameChecked
                    ]}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemQuantity}>
                      Quantidade: {item.quantity}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Ionicons 
                      name="trash-outline" 
                      size={20} 
                      color={isDark ? Colors.dark.error.text : Colors.light.error.text}
                    />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons 
                  name="cart-outline" 
                  size={48} 
                  color={isDark ? Colors.dark.text.muted : Colors.light.text.muted}
                />
                <Text style={styles.emptyStateText}>
                  Nenhum item na lista ainda.{'\n'}
                  Adicione itens usando o campo acima.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        <DeleteConfirmationModal
          visible={isDeleteModalVisible}
          onClose={() => setIsDeleteModalVisible(false)}
          onConfirm={handleDeleteList}
          listName={list.name}
        />
      </View>
    </Modal>
  );
} 