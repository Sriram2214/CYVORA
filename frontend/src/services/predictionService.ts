import { createApiClient } from './api';
import { PredictionRequest, PredictionResponse, PredictionResult } from '../types/api';
import { getAttackClassSeverity } from '../utils/severity';

export const predictThreat = async (
  features: Record<string, number | string>,
  forceSimulated: boolean = false
): Promise<{ result: PredictionResult; isSimulated: boolean }> => {
  if (forceSimulated) {
    const simulated = simulatePrediction(features);
    return { result: simulated, isSimulated: true };
  }

  try {
    const client = createApiClient();
    const payload: PredictionRequest = { features };
    const response = await client.post<PredictionResponse>('/predict', payload);

    if (response.data && response.data.success && response.data.result) {
      return {
        result: response.data.result,
        isSimulated: false,
      };
    }
    throw new Error('Invalid response structure from CYVORA backend');
  } catch (error) {
    console.warn('Backend unavailable or failed. Falling back to high-fidelity simulated prediction engine.', error);
    const simulated = simulatePrediction(features);
    return { result: simulated, isSimulated: true };
  }
};

export const simulatePrediction = (features: Record<string, number | string>): PredictionResult => {
  const destPort = Number(features['Destination Port'] || 80);
  const flowDuration = Number(features['Flow Duration'] || 10000);
  const bwdLength = Number(features['Total Length of Bwd Packets'] || 500);
  const fwdPackets = Number(features['Total Fwd Packets'] || 2);
  const initWinBwd = Number(features['Init_Win_bytes_backward'] || 235);

  let prediction = 'BENIGN';
  let confidence = 0.9982;
  let isAttack = false;

  // Feature rule-based heuristics mimicking CYVORA V4 RF tree splits
  if (destPort === 444 || (bwdLength > 5000000 && flowDuration > 50000000)) {
    prediction = 'Heartbleed';
    confidence = 0.9942;
    isAttack = true;
  } else if (destPort === 80 && flowDuration < 100 && fwdPackets <= 2 && Number(features['ACK Flag Count'] || 0) >= 1 && Number(features['URG Flag Count'] || 0) >= 1) {
    prediction = 'Web Attack – Sql Injection';
    confidence = 0.9684;
    isAttack = true;
  } else if (fwdPackets > 10 && flowDuration < 50000 && Number(features['Flow Packets/s'] || 0) > 1000) {
    prediction = 'DDoS';
    confidence = 0.9991;
    isAttack = true;
  } else if (destPort === 8080 && Number(features['SYN Flag Count'] || 0) >= 1 && Number(features['Total Backward Packets'] || 0) === 0) {
    prediction = 'PortScan';
    confidence = 0.9915;
    isAttack = true;
  } else if (destPort === 22 && flowDuration < 5000) {
    prediction = 'SSH-Patator';
    confidence = 0.9873;
    isAttack = true;
  } else if (destPort === 21) {
    prediction = 'FTP-Patator';
    confidence = 0.9934;
    isAttack = true;
  } else if (initWinBwd === 0 && Number(features['Fwd Header Length'] || 0) > 200) {
    prediction = 'Infiltration';
    confidence = 0.9125;
    isAttack = true;
  } else if (destPort === 80 && Number(features['Average Packet Size'] || 0) > 500 && flowDuration > 1000000) {
    prediction = 'DoS Hulk';
    confidence = 0.9968;
    isAttack = true;
  }

  const severity = isAttack ? getAttackClassSeverity(prediction) : 'LOW';

  return {
    prediction,
    prediction_id: isAttack ? 1 : 0,
    confidence,
    is_attack: isAttack,
    severity,
    model_version: 'V4',
  };
};
