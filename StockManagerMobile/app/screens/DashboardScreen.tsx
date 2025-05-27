import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ProductBarChart from '../components/ProductBarChart';

type StockCritique = {
  id_product: number;
  nom: string;
  "quantité_en_stock": number;
  "seuil_minimal": number;
};


export default function DashboardScreen() {
  const { user } = useContext(AuthContext);
  const [stocksCritiques, setStocksCritiques] = useState<StockCritique[]>([]);


  useEffect(() => {
    const fetchCriticalStocks = async () => {
      try {
        const res = await axios.get('http://192.168.1.121:5000/stock/low');
        setStocksCritiques(res.data);
      } catch (err) {
        console.log('Erreur lors du chargement des stocks critiques', err);
      }
    };

    fetchCriticalStocks();
  }, []);

  return user ? (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue {user.prenom} ({user.role})</Text>

      <Text style={styles.subtitle}>Produits en stock critique :</Text>

      <FlatList
        data={stocksCritiques}
        keyExtractor={(item) => item.id_product.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>
                {item.nom} — Stock : {item["quantité_en_stock"]} / Seuil : {item["seuil_minimal"]}
        </Text>

        )}
      />
      <ProductBarChart />
    </View>
  ) : (
    <Text style={styles.title}>Chargement...</Text>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 20 },
  item: { fontSize: 16, marginVertical: 4 },
});
