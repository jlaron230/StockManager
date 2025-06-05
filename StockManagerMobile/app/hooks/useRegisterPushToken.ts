import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import axios from 'axios';

/**
 * @param userId ID de l'utilisateur connecté (ou null)
 */

export function useRegisterPushToken(userId?: number) {
  useEffect(() => {
    if (!userId) return;

    const register = async () => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.warn('Permission de notifications refusée.');
          return;
        }

        
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const token = tokenData.data;

        console.log("📲 Expo Push Token récupéré :", token);

        
        await axios.put(`http://192.168.1.121:5000/users/${userId}/token-mobil`, {
          fcm_token_mobil: token,
        });

        console.log("✅ Token mobile enregistré dans la BDD");
      } catch (error) {
        console.error("Erreur d'enregistrement du token mobile :", error);
      }
    };

    register();
  }, [userId]);
}
