// Autocomplete.js
import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const Autocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchAddresses = async (text) => {
    setQuery(text);
    if (text.length > 2) {
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: text,
            format: 'json',
            addressdetails: 1,
            limit: 5,
            countrycodes: 'es',
          },
        });
        setResults(response.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelect = (item) => {
    const address = {
      street:`${item.address.road || item.address.pedestrian || item.address.cycleway || item.address.footway || item.address.path || ''}, ${item.address.house_number || ''}, ${item.address.city || item.address.town || ''}, ${item.address.country || ''}`,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    };
    setQuery(item.display_name);
    setResults([]);
    onSelect(address);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar dirección..."
        value={query}
        onChangeText={searchAddresses}
      />
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <Text style={styles.resultItem}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 4,
    marginBottom: 20,
    marginTop: 20,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Autocomplete;
