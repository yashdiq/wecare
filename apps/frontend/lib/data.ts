import { Shift, VisitLog } from './types';

// Mock data for a caregiver's shift
export const MOCK_SHIFT: Shift = {
  id: '1234-5678-9012-3456',
  date: new Date().toISOString().split('T')[0], // Today's date
  startTime: '09:00',
  endTime: '11:00',
  client: {
    name: 'Jane Smith',
    address: '123 Main Street, Apt 4B, Springfield, IL 62701',
  },
};

// Mock historical visit logs
export const MOCK_VISIT_HISTORY: VisitLog[] = [
  {
    shiftId: '1234-5678-9012-3456',
    startLog: {
      timestamp: Date.now() - 86400000, // Yesterday
      location: {
        latitude: 39.78373,
        longitude: -89.65014,
        accuracy: 10,
        timestamp: Date.now() - 86400000
      }
    },
    endLog: {
      timestamp: Date.now() - 86400000 + 7200000, // 2 hours after start
      location: {
        latitude: 39.78373,
        longitude: -89.65014,
        accuracy: 10,
        timestamp: Date.now() - 86400000 + 7200000
      }
    },
    client: {
      name: 'Jane Smith',
      address: '123 Main Street, Apt 4B, Springfield, IL 62701',
    }
  },
  {
    shiftId: '2234-5678-9012-3456',
    startLog: {
      timestamp: Date.now() - 172800000, // 2 days ago
      location: {
        latitude: 39.78373,
        longitude: -89.65014,
        accuracy: 10,
        timestamp: Date.now() - 172800000
      }
    },
    endLog: {
      timestamp: Date.now() - 172800000 + 7200000,
      location: {
        latitude: 39.78373,
        longitude: -89.65014,
        accuracy: 10,
        timestamp: Date.now() - 172800000 + 7200000
      }
    },
    client: {
      name: 'Robert Johnson',
      address: '456 Oak Avenue, Springfield, IL 62702',
    }
  },
  {
    shiftId: '3234-5678-9012-3456',
    startLog: {
      timestamp: Date.now() - 259200000, // 3 days ago
      location: {
        latitude: 39.77563,
        longitude: -89.64814,
        accuracy: 10,
        timestamp: Date.now() - 259200000
      }
    },
    endLog: {
      timestamp: Date.now() - 259200000 + 7200000,
      location: {
        latitude: 39.77563,
        longitude: -89.64814,
        accuracy: 10,
        timestamp: Date.now() - 259200000 + 7200000
      }
    },
    client: {
      name: 'Mary Williams',
      address: '789 Pine Street, Springfield, IL 62703',
    }
  },
  {
    shiftId: '4234-5678-9012-3456',
    startLog: {
      timestamp: Date.now() - 345600000, // 4 days ago
      location: {
        latitude: 39.76893,
        longitude: -89.63914,
        accuracy: 10,
        timestamp: Date.now() - 345600000
      }
    },
    endLog: {
      timestamp: Date.now() - 345600000 + 7200000,
      location: {
        latitude: 39.76893,
        longitude: -89.63914,
        accuracy: 10,
        timestamp: Date.now() - 345600000 + 7200000
      }
    },
    client: {
      name: 'David Brown',
      address: '321 Elm Court, Springfield, IL 62704',
    }
  },
  {
    shiftId: '5234-5678-9012-3456',
    startLog: {
      timestamp: Date.now() - 432000000, // 5 days ago
      location: {
        latitude: 39.75923,
        longitude: -89.62814,
        accuracy: 10,
        timestamp: Date.now() - 432000000
      }
    },
    endLog: {
      timestamp: Date.now() - 432000000 + 7200000,
      location: {
        latitude: 39.75923,
        longitude: -89.62814,
        accuracy: 10,
        timestamp: Date.now() - 432000000 + 7200000
      }
    },
    client: {
      name: 'Sarah Miller',
      address: '567 Maple Drive, Springfield, IL 62705',
    }
  }
];