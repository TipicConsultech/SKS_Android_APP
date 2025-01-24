import React, { useState } from "react";
import {
  Provider,
  Stack,
  Button,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  Text,
  TextInput,
} from "@react-native-material/core";
import { router } from "expo-router";
import { ScrollView } from "react-native";

const NewCustomer = () => {
  const [visible, setVisible] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPersonMo, setContactPersonMo] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    if (
      customerName.trim() === '' ||
      address.trim() === '' ||
      contactPerson.trim() === '' ||
      contactPersonMo.trim() === '' ||
      email.trim() === ''
    ) {
      setError('All fields are required!');
    } else if (!/^\d{10}$/.test(contactPersonMo)) {
      setError('Mobile number must be 10 digits only.');
    } else if (!validateEmail(email)) {
      setError('Invalid email format.');
    } else {
      setError('');
      router.push('/service_info');
      setCustomerName('');
      setAddress('');
      setContactPerson('');
      setContactPersonMo('');
      setEmail('');
    }
  };

  return (
    <>
      <Button
        title="New Customer"
        style={{ margin: 60 }}
        onPress={() => setVisible(true)}
      />
      <Dialog
        style={{ borderRadius: 20 }}
        visible={visible}
        onDismiss={() => setVisible(false)}
      >
        <ScrollView>
          <DialogHeader title="New Customer" style={{ alignSelf: 'center' }} />
          {error ? (
            <Text style={{ alignSelf: 'center', color: 'red' }}>{error}</Text>
          ) : null}
          <DialogContent>
            <Stack spacing={2}>
              <TextInput
                variant="outlined"
                label="Customer name"
                style={{ margin: 15 }}
                value={customerName}
                onChangeText={setCustomerName}
              />
              <TextInput
                variant="outlined"
                label="Address"
                style={{ margin: 15 }}
                value={address}
                onChangeText={setAddress}
              />
              <TextInput
                variant="outlined"
                label="Contact person"
                style={{ margin: 15 }}
                value={contactPerson}
                onChangeText={setContactPerson}
              />
              <TextInput
                variant="outlined"
                label="Contact person Mobile"
                style={{ margin: 15 }}
                value={contactPersonMo}
                onChangeText={setContactPersonMo}
                keyboardType="numeric"
              />
              <TextInput
                variant="outlined"
                label="Email"
                style={{ margin: 15 }}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              title="Cancel"
              compact
              variant="text"
              color="red"
              onPress={() => setVisible(false)}
              style={{ color: 'white' }}
            />
            <Button
              title="Save"
              compact
              variant="text"
              color="black"
              onPress={handleSubmit}
              style={{ color: 'white' }}
            />
          </DialogActions>
        </ScrollView>
      </Dialog>
    </>
  );
};

const AppProvider = () => (
  <Provider style={{ flex: 1 }}>
    <NewCustomer />
  </Provider>
);

export default AppProvider;
