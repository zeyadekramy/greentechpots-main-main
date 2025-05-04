// PlantMonitorService.js
import { useEffect } from "react";
import { usePot } from "./PotContext";
import { checkAndSendNotification } from "./NotificationService";

const SERVER_URL = "http://192.168.110.167:3000/device";

export const usePlantMonitor = () => {
  const { pots, setPots } = usePot();

  useEffect(() => {
    const pollPlants = async () => {
      for (const pot of pots) {
        if (!pot.uuid) continue;

        try {
          const res = await fetch(`${SERVER_URL}/${pot.uuid}`);
          const data = await res.json();

          // Send notification if needed
          if (data.status) {
            checkAndSendNotification(data.status, data.name);
          }

          // Update plant status globally
          setPots((prev) =>
            prev.map((p) => (p.uuid === pot.uuid ? { ...p, sensorData: data.sensorData, status: data.status } : p))
          );
        } catch (err) {
          console.error("Failed to fetch plant data:", err);
        }
      }
    };

    pollPlants(); // initial call
    const interval = setInterval(pollPlants, 10 * 1000); // every 10 seconds

    return () => clearInterval(interval);
  }, [pots]);
};

// Default export for the file
export default usePlantMonitor;
