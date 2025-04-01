import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  listName: string;
}

export default function DeleteConfirmationModal({
  visible,
  onClose,
  onConfirm,
  listName,
}: DeleteConfirmationModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      padding: 20,
    },
    modalContent: {
      backgroundColor: isDark ? Colors.dark.background.primary : Colors.light.background.primary,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: isDark ? Colors.dark.error.background : Colors.light.error.background,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
      textAlign: 'center',
      marginBottom: 12,
    },
    message: {
      fontSize: 16,
      color: isDark ? Colors.dark.text.muted : Colors.light.text.muted,
      marginBottom: 24,
      textAlign: 'center',
      lineHeight: 22,
    },
    listName: {
      color: isDark ? Colors.dark.error.primary : Colors.light.error.primary,
      fontWeight: '600',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    button: {
      flex: 1,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    cancelButton: {
      backgroundColor: isDark ? Colors.dark.background.secondary : Colors.light.background.secondary,
    },
    deleteButton: {
      backgroundColor: isDark ? Colors.dark.error.primary : Colors.light.error.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: isDark ? Colors.dark.text.primary : Colors.light.text.primary,
    },
    deleteButtonText: {
      color: Colors.light.text.inverse,
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
          <View style={styles.iconContainer}>
            <Ionicons 
              name="trash-outline" 
              size={32} 
              color={isDark ? Colors.dark.error.primary : Colors.light.error.primary}
            />
          </View>
          <Text style={styles.title}>Excluir lista</Text>
          <Text style={styles.message}>
            Tem certeza que deseja excluir a lista{'\n'}
            <Text style={styles.listName}>"{listName}"</Text>?{'\n'}
            Esta ação não pode ser desfeita.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={onConfirm}
            >
              <Text style={[styles.buttonText, styles.deleteButtonText]}>
                Excluir
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
} 