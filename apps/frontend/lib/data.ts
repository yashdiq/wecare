import { Shift, VisitLog } from "./types";

// Mock historical visit logs
export const MOCK_VISIT_HISTORY: VisitLog[] = [
  {
    shiftId: 0,
    startLog: {
      timestamp: Date.now() - 86400000, // Yesterday
      location: {
        latitude: 39.78373,
        longitude: -89.65014,
        accuracy: 10,
        timestamp: Date.now() - 86400000,
      },
    },
    endLog: {
      timestamp: Date.now() - 86400000 + 7200000, // 2 hours after start
      location: {
        latitude: 39.78373,
        longitude: -89.65014,
        accuracy: 10,
        timestamp: Date.now() - 86400000 + 7200000,
      },
    },
    client: {
      name: "Jane Smith",
      address: "123 Main Street, Apt 4B, Springfield, IL 62701",
    },
  },
  {
    shiftId: 1,
    startLog: {
      timestamp: Date.now() - 172800000, // 2 days ago
      location: {
        latitude: 39.78373,
        longitude: -89.65014,
        accuracy: 10,
        timestamp: Date.now() - 172800000,
      },
    },
    endLog: {
      timestamp: Date.now() - 172800000 + 7200000,
      location: {
        latitude: 39.78373,
        longitude: -89.65014,
        accuracy: 10,
        timestamp: Date.now() - 172800000 + 7200000,
      },
    },
    client: {
      name: "Robert Johnson",
      address: "456 Oak Avenue, Springfield, IL 62702",
    },
  },
  {
    shiftId: 2,
    startLog: {
      timestamp: Date.now() - 259200000, // 3 days ago
      location: {
        latitude: 39.77563,
        longitude: -89.64814,
        accuracy: 10,
        timestamp: Date.now() - 259200000,
      },
    },
    endLog: {
      timestamp: Date.now() - 259200000 + 7200000,
      location: {
        latitude: 39.77563,
        longitude: -89.64814,
        accuracy: 10,
        timestamp: Date.now() - 259200000 + 7200000,
      },
    },
    client: {
      name: "Mary Williams",
      address: "789 Pine Street, Springfield, IL 62703",
    },
  },
  {
    shiftId: 3,
    startLog: {
      timestamp: Date.now() - 345600000, // 4 days ago
      location: {
        latitude: 39.76893,
        longitude: -89.63914,
        accuracy: 10,
        timestamp: Date.now() - 345600000,
      },
    },
    endLog: {
      timestamp: Date.now() - 345600000 + 7200000,
      location: {
        latitude: 39.76893,
        longitude: -89.63914,
        accuracy: 10,
        timestamp: Date.now() - 345600000 + 7200000,
      },
    },
    client: {
      name: "David Brown",
      address: "321 Elm Court, Springfield, IL 62704",
    },
  },
  {
    shiftId: 4,
    startLog: {
      timestamp: Date.now() - 432000000, // 5 days ago
      location: {
        latitude: 39.75923,
        longitude: -89.62814,
        accuracy: 10,
        timestamp: Date.now() - 432000000,
      },
    },
    endLog: {
      timestamp: Date.now() - 432000000 + 7200000,
      location: {
        latitude: 39.75923,
        longitude: -89.62814,
        accuracy: 10,
        timestamp: Date.now() - 432000000 + 7200000,
      },
    },
    client: {
      name: "Sarah Miller",
      address: "567 Maple Drive, Springfield, IL 62705",
    },
  },
];
