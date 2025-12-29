import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useEffect, useState } from "react";

const Rates = () => {
  const [rates, setRates] = useState({
    oneWayRate: "",
    roundTripRate: "",
    driverBata: "",
    minimumFare: "",
  });

  useEffect(() => {
    const fetchRates = async () => {
      const ref = doc(db, "rates", "default");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setRates(snap.data() as any);
      }
    };
    fetchRates();
  }, []);

  const saveRates = async () => {
    const ref = doc(db, "rates", "default");
    await updateDoc(ref, {
      ...rates,
      updatedAt: new Date(),
    });
    alert("Rates updated successfully");
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Rate Settings</h1>

      <input
        type="number"
        placeholder="One Way ₹/km"
        value={rates.oneWayRate}
        onChange={e => setRates({ ...rates, oneWayRate: e.target.value })}
        className="input"
      />

      <input
        type="number"
        placeholder="Round Trip ₹/km"
        value={rates.roundTripRate}
        onChange={e => setRates({ ...rates, roundTripRate: e.target.value })}
        className="input"
      />

      <input
        type="number"
        placeholder="Driver Bata (₹)"
        value={rates.driverBata}
        onChange={e => setRates({ ...rates, driverBata: e.target.value })}
        className="input"
      />

      <input
        type="number"
        placeholder="Minimum Fare (₹)"
        value={rates.minimumFare}
        onChange={e => setRates({ ...rates, minimumFare: e.target.value })}
        className="input"
      />

      <button
        onClick={saveRates}
        className="bg-yellow-400 px-6 py-2 mt-4 rounded font-bold"
      >
        Save Rates
      </button>
    </div>
  );
};

export default Rates;
