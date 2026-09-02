export interface PredictionRequest {
  features: Record<string, number | string>;
}

export interface PredictionResult {
  prediction: string;
  prediction_id: number;
  confidence: number | null;
  is_attack: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  model_version: string;
}

export interface PredictionResponse {
  success: boolean;
  result: PredictionResult;
  error?: string;
}

export interface ModelInfoResponse {
  model_version: string;
  model_type: string;
  feature_count: number | null;
  model_loaded: boolean;
}

export interface ApiStatusResponse {
  api: string;
  status: string;
  backend: string;
  model: string;
  prediction_engine: string;
}

export interface HealthResponse {
  status: string;
  service: string;
}
