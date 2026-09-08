export interface PredictionRequest {
  features: Record<string, number | string>;
  source_id?: string;
}

export interface ResponseEngineResult {
  response_action: 'ALLOW' | 'ALERT' | 'RATE_LIMIT' | 'BLOCK' | string;
  severity: string;
  confidence: number | null;
  confidence_aware?: boolean;
  timestamp?: string;
}

export interface PreventionEngineResult {
  enforced: boolean;
  action: 'ALLOW' | 'ALERT' | 'RATE_LIMIT' | 'BLOCK' | string;
  status: 'TRAFFIC_ALLOWED' | 'ALERT_TRIGGERED' | 'RATE_LIMITED' | 'TRAFFIC_BLOCKED' | 'TRAFFIC_MONITORED' | 'ATTACK_BLOCKED' | string;
  source_id?: string;
  message?: string;
  duration_seconds?: number;
  timestamp?: string;
}

export interface PredictionResult {
  prediction: string;
  prediction_id: number;
  confidence: number | null;
  is_attack: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  model_version: string;
  response_action?: string;
  prevention_action?: string;
  prevention_status?: string;
  enforced?: boolean;
  source_id?: string;
  attack_type?: string;
}

export interface PredictionResponse {
  success: boolean;
  result: PredictionResult;
  response?: ResponseEngineResult;
  prevention?: PreventionEngineResult;
  error?: string;
}

export interface PreventionStatusData {
  status: 'active' | 'inactive' | string;
  blocked_sources: number;
  rate_limited_sources: number;
  block_duration_seconds: number;
  rate_limit_duration_seconds: number;
  current_action?: 'ALLOW' | 'ALERT' | 'RATE_LIMIT' | 'BLOCK' | string;
  current_status?: 'TRAFFIC_ALLOWED' | 'ALERT_TRIGGERED' | 'RATE_LIMITED' | 'TRAFFIC_BLOCKED' | string;
  enforced?: boolean;
}

export interface PreventionStatusResponse {
  success: boolean;
  prevention: PreventionStatusData;
}

export interface ModelInfoResponse {
  model_version: string;
  model_type: string;
  feature_count: number | null;
  model_loaded: boolean;
  prevention_engine?: {
    status: string;
    enforcement: string;
    supported_actions: string[];
  };
}

export interface ApiStatusResponse {
  api: string;
  status: string;
  backend: string;
  model: string;
  prediction_engine: string;
  prevention_engine?: string;
  enforcement?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  model_version?: string;
  prevention_engine?: string;
}

