const collections = [
  {
      approvalStatus: "NOT_STARTED",
      publishComplete: false,
      isEncrypted: false,
      collectionOwner: "hello",
      timeseriesImportFiles: [],
      id: "anothercollection-91bc818cff240fa546c84b0cc4c3d32f0667de3068832485e254c17655d5b4ad",
      name: "Another collection",
      type: "manual",
      teams: [],
  },
  {
      approvalStatus: "IN_PROGRESS",
      publishComplete: false,
      isEncrypted: false,
      collectionOwner: "PUBLISHING_SUPPORT",
      timeseriesImportFiles: [],
      id: "asdasdasd-04917444856fa9ade290b8847dee1f24e7726d71e1a7378c2557d949b6a6968c",
      name: "asdasdasd",
      type: "manual",
      teams: [],
  },
  {
      approvalStatus: "IN_PROGRESS",
      publishComplete: false,
      isEncrypted: false,
      collectionOwner: "PUBLISHING_SUPPORT",
      timeseriesImportFiles: [],
      id: "test-collection-12345",
      name: "Test collection",
      type: "manual",
      teams: ["cpi", "cpih"],
  },
  {
      approvalStatus: "ERROR",
      publishComplete: false,
      isEncrypted: false,
      collectionOwner: "PUBLISHING_SUPPORT",
      timeseriesImportFiles: [],
      id: "different-collection-12345",
      name: "Test",
      type: "manual",
      teams: ["Team 2"],
  },
  {
      approvalStatus: "COMPLETE",
      publishComplete: false,
      isEncrypted: false,
      collectionOwner: "PUBLISHING_SUPPORT",
      timeseriesImportFiles: [],
      id: "test-sau39393uyqha8aw8y3n3",
      name: "Complete collection",
      type: "manual",
      teams: ["Team 2"],
  },
];

const items = [
  {
      id: "1",
      selectableBox: {
          firstColumn: "Collection 1",
          secondColumn: "[test]",
      },
      status: {},
  },
  {
      id: "2",
      selectableBox: {
          firstColumn: "Collection 2",
          secondColumn: "Friday",
      },
      status: {},
  },
  {
      id: "3",
      selectableBox: {
          firstColumn: "Collection 3",
          secondColumn: "[manual collection]",
      },
      status: {},
  },
];

const emptyCollection = [];
const newCollection = {};

// CommonJS style export via Node no Babel-node
module.exports = {
  newCollection,
  collections,
  emptyCollection,
  items
};
