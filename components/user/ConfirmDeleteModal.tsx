import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

interface ConfirmDeleteModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDeleteModal = ({ visible, onConfirm, onCancel }: ConfirmDeleteModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Are you sure?</Text>
          <Text style={styles.modalText}>Do you really want to delete your account? This action cannot be undone.</Text>
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onCancel} color="grey" />
            <Button title="Delete" onPress={onConfirm} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default ConfirmDeleteModal;
