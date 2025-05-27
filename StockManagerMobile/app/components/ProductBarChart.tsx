import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';
import { ChartData } from 'react-native-chart-kit/dist/HelperTypes';

type Category = {
  id_category: number;
  nom: string;
};

type Product = {
  id_product: number;
  nom: string;
  quantité_en_stock: number;
  seuil_minimal: number;
};


const screenWidth = Dimensions.get('window').width;

export default function ProductBarChart() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get('http://192.168.1.121:5000/categories').then((res) => {
      setCategories(res.data);
      setSelectedCategory(res.data[0]?.id_category?.toString() || null);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(`http://192.168.1.121:5000/products/category/${selectedCategory}`)
        .then((res) => {
          console.log('Produits reçus :', res.data);
          setProducts(res.data);
        });
    }
  }, [selectedCategory]);

  const validProducts = products.filter(p => p.nom && typeof p.quantité_en_stock === 'number');
  const chartData: ChartData = {
    labels: validProducts.map((p) => p.nom.slice(0, 12)),
    datasets: [
      {
        data: validProducts.map((p) => p.quantité_en_stock || 0)
      },
    ],
  };

  return (
    <View>
      <Text style={styles.subtitle}>Stock par catégorie</Text>

      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        {categories.map((cat) => (
          <Picker.Item
            label={cat.nom}
            value={cat.id_category.toString()}
            key={cat.id_category}
          />
        ))}
      </Picker>

      {products.length === 0 ? (
        <Text>Aucun produit à afficher</Text>
      ) : (
        <BarChart
          key={selectedCategory}
          data={chartData}
          width={screenWidth - 32}
          height={220}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            labelColor: () => '#000',
          }}
          style={styles.chart}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 12 },
  picker: { backgroundColor: '#f0f0f0', marginBottom: 20 },
  chart: { borderRadius: 8 },
});
