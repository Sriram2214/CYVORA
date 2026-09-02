import { useState, useEffect, useCallback } from 'react';
import { ThreatEvent, SeverityLevel } from '../types/threat';
import { CYVORA_ATTACK_CLASSES } from '../data/attackClasses';
import { getAttackClassSeverity } from '../utils/severity';

const SAMPLE_SOURCE_IPS = [
  '192.168.10.50',
  '192.168.10.51',
  '172.16.0.1',
  '172.16.0.105',
  '10.0.0.15',
  '205.174.165.73',
  '18.218.115.60',
  '192.168.1.104',
];

const SAMPLE_DEST_IPS = [
  '192.168.10.3',
  '192.168.10.8',
  '172.16.0.2',
  '192.168.10.14',
  '192.168.10.25',
];

export const generateMockThreatEvent = (index: number = 0): ThreatEvent => {
  // Weighted selection: mostly benign, with periodic standard attacks and rare attacks
  const rand = Math.random();
  let attackClass = 'BENIGN';
  let isAttack = false;

  if (rand < 0.65) {
    attackClass = 'BENIGN';
    isAttack = false;
  } else if (rand < 0.75) {
    attackClass = 'PortScan';
    isAttack = true;
  } else if (rand < 0.83) {
    attackClass = 'DoS Hulk';
    isAttack = true;
  } else if (rand < 0.89) {
    attackClass = 'DDoS';
    isAttack = true;
  } else if (rand < 0.93) {
    attackClass = 'SSH-Patator';
    isAttack = true;
  } else if (rand < 0.96) {
    attackClass = 'Web Attack – Brute Force';
    isAttack = true;
  } else if (rand < 0.98) {
    attackClass = 'Web Attack – XSS';
    isAttack = true;
  } else if (rand < 0.99) {
    attackClass = 'Web Attack – Sql Injection';
    isAttack = true;
  } else if (rand < 0.996) {
    attackClass = 'Infiltration';
    isAttack = true;
  } else {
    attackClass = 'Heartbleed';
    isAttack = true;
  }

  const foundInfo = CYVORA_ATTACK_CLASSES.find((c) => c.name === attackClass);
  const severity: SeverityLevel = isAttack ? (foundInfo?.severity || getAttackClassSeverity(attackClass)) : 'LOW';

  const port = foundInfo?.typicalPorts ? foundInfo.typicalPorts[Math.floor(Math.random() * foundInfo.typicalPorts.length)] : 80;
  const confidence = isAttack ? 0.90 + Math.random() * 0.098 : 0.98 + Math.random() * 0.019;

  let protocol: ThreatEvent['protocol'] = 'TCP';
  if (port === 53) protocol = 'DNS';
  else if (port === 80) protocol = 'HTTP';
  else if (port === 443 || port === 444) protocol = 'HTTPS';
  else if (port === 22) protocol = 'SSH';
  else if (port === 21) protocol = 'FTP';

  return {
    id: `evt-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toLocaleTimeString(),
    sourceIp: SAMPLE_SOURCE_IPS[Math.floor(Math.random() * SAMPLE_SOURCE_IPS.length)],
    destinationIp: SAMPLE_DEST_IPS[Math.floor(Math.random() * SAMPLE_DEST_IPS.length)],
    port,
    protocol,
    prediction: attackClass,
    confidence,
    severity,
    status: isAttack ? (severity === 'CRITICAL' ? 'BLOCKED' : 'ACTIVE') : 'ANALYZING',
    isAttack,
    flowDurationUs: Math.floor(Math.random() * 50000) + 100,
    packetCount: Math.floor(Math.random() * 20) + 2,
    byteCount: Math.floor(Math.random() * 10000) + 200,
    isSimulated: true,
  };
};

export const useThreatStream = (initialCount: number = 15, intervalMs: number = 2500) => {
  const [events, setEvents] = useState<ThreatEvent[]>(() => {
    return Array.from({ length: initialCount }, (_, i) => generateMockThreatEvent(i));
  });
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterAttack, setFilterAttack] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const addNewEvent = useCallback((customEvent?: ThreatEvent) => {
    const event = customEvent || generateMockThreatEvent();
    setEvents((prev) => [event, ...prev.slice(0, 199)]); // Keep latest 200 events
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      addNewEvent();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPaused, intervalMs, addNewEvent]);

  // Filtered event list
  const filteredEvents = events.filter((e) => {
    if (filterSeverity !== 'ALL' && e.severity !== filterSeverity) return false;
    if (filterAttack !== 'ALL' && e.prediction !== filterAttack) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.sourceIp.toLowerCase().includes(q) ||
        e.destinationIp.toLowerCase().includes(q) ||
        e.prediction.toLowerCase().includes(q) ||
        e.port.toString().includes(q) ||
        e.protocol.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate live statistics
  const totalFlows = events.length;
  const threatsDetected = events.filter((e) => e.isAttack).length;
  const benignTraffic = totalFlows - threatsDetected;
  const detectionRate = totalFlows > 0 ? (threatsDetected / totalFlows) * 100 : 0;
  const avgConfidence = totalFlows > 0 ? (events.reduce((acc, cur) => acc + cur.confidence, 0) / totalFlows) * 100 : 0;

  return {
    events: filteredEvents,
    rawEvents: events,
    isPaused,
    setIsPaused,
    togglePause: () => setIsPaused((p) => !p),
    filterSeverity,
    setFilterSeverity,
    filterAttack,
    setFilterAttack,
    searchQuery,
    setSearchQuery,
    addNewEvent,
    clearEvents,
    stats: {
      totalFlows: totalFlows + 48210, // Base baseline count for rich SOC view
      threatsDetected: threatsDetected + 2314,
      benignTraffic: benignTraffic + 45896,
      detectionRate: detectionRate || 4.8,
      avgConfidence: avgConfidence || 99.4,
    },
  };
};
