import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AddTable = ({ setItemsTable, setNextBtnVisible }) => {
  const [isCardVisible, setIsCardVisible] = useState(true); // Manage card visibility
  const [isEditing, setIsEditing] = useState('1'); // Start editing the first row
  const [items, setItems] = useState([{ id: '1', description: '', quantity: '', remark: 'Replaced' }]);

  const remarkOptions = ['Replaced', 'To Be Replaced'];

  // Add a new empty item
  const handleAddNew = () => {
    const id = (items.length + 1).toString();
    setItems([...items, { id, description: '', quantity: '', remark: 'Replaced' }]);
    setIsEditing(id); // Set the new item to be editable immediately
  };

  // Update item when a value is changed in the table
  const handleChange = (field, value, id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);

    // Only set itemsTable if all items have valid description and quantity
    const allValid = updatedItems.every((item) => item.description && item.quantity);
    if (allValid) {
      setItemsTable(updatedItems);
      setNextBtnVisible(true);
    } else {
      setItemsTable([]); // Clear the table when there’s an invalid row
      setNextBtnVisible(false);
    }
  };

  // Delete an item
  const handleDeleteItem = (itemId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Smooth animation on delete
    const filteredItems = items.filter((item) => item.id !== itemId);

    // Reassign IDs to maintain sequential order
    const updatedItems = filteredItems.map((item, index) => ({
      ...item,
      id: (index + 1).toString(), // Reassign IDs starting from 1
    }));

    setItems(updatedItems);

    // Update itemsTable after deletion
    const allValid = updatedItems.every((item) => item.description && item.quantity);
    setItemsTable(allValid ? updatedItems : []);

    // Update isEditing to focus on the first available row or reset it
    if (updatedItems.length > 0) {
      setIsEditing(updatedItems[0].id); // Focus on the first available row
    } else {
      setIsEditing(null); // No row is being edited
    }
  };

  // Check if any item has empty fields (description or quantity)
  const hasEmptyFields = () => {
    const lastItem = items[items.length - 1];
    return !lastItem || !lastItem.description || !lastItem.quantity;
  };

  // Check if the row has data
  const hasData = (item) => {
    return item.description || item.quantity;
  };

  const renderItem = ({ item, index }) => (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      layout={Layout.springify()}
      style={styles.row}
    >
      {/* ID (non-editable) */}
      <Text style={styles.cellid}>{item.id}</Text>

      {/* Description */}
      <TextInput
        style={styles.cellInput}
        value={item.description}
        onChangeText={(text) => handleChange('description', text, item.id)}
        editable={isEditing === item.id}
        placeholder="Description"
      />

      {/* Quantity */}
      <TextInput
        style={styles.cellInput}
        value={item.quantity}
        onChangeText={(text) => handleChange('quantity', text, item.id)}
        editable={isEditing === item.id}
        placeholder="Quantity"
        keyboardType="numeric"
      />

      {/* Remark field with pre-defined options */}
      <TouchableOpacity
        style={styles.remarkButton}
        onPress={() =>
          handleChange('remark', item.remark === remarkOptions[0] ? remarkOptions[1] : remarkOptions[0], item.id)
        }
      >
        <Text style={styles.cellInput}>{item.remark || 'Replaced'}</Text>
      </TouchableOpacity>

      {/* Delete Button (Only show if the row has data or there are multiple rows) */}
      {hasData(item) && items.length > 1 && (
        <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>-</Text>
        </TouchableOpacity>
      )}

      {/* "+" Button to Add a New Item (Only on the last row when all fields are filled) */}
      {index === items.length - 1 && !hasEmptyFields() && (
        <TouchableOpacity onPress={handleAddNew} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Table View */}
      {isCardVisible && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          layout={Layout.springify()}
          style={styles.table}
        >
          <View style={styles.headerm}>
            <Text style={styles.headerId}>ID</Text>
            <Text style={styles.header}>Description</Text>
            <Text style={styles.header}>Quantity</Text>
            <Text style={styles.header}>Remark</Text>
          </View>
          <FlatList data={items} renderItem={renderItem} keyExtractor={(item) => item.id} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  table: {
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  headerm: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerId: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
  },
  header: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cellid: {
    marginRight: 10,
    fontSize: 13.5,
  },
  cellInput: {
    flex: 1,
    padding: 5,
    fontSize: 13.5,
  },
  remarkButton: {
    flex: 1,
    padding: 5,
  },
  deleteButton: {
    padding: 5,
  },
  deleteText: {
    color: 'red',
    fontSize: 30,
  },
  addButton: {
    padding: 0,
    marginLeft: 0,
  },
  addButtonText: {
    fontSize: 30,
    color: 'green',
  },
});

export default AddTable;
