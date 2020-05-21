export const configLocal = localforage => {
  if (window.localforage) return;
  localforage.config({
    driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
    name: "myApp",
    version: 1.0,
    size: 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName: "keyvaluepairs", // Should be alphanumeric, with underscores.
    description: "some description"
  });
};

 