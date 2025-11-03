// src/matrixClient.js
import * as sdk from "matrix-js-sdk";

let client = null;

export async function createMatrixClient(baseUrl, accessToken, userId) {
    if(client) return client;
    console.log("✅ Creating Matrix client...");
    console.log(baseUrl);
    const store = new sdk.IndexedDBStore({
        indexedDB: window.indexedDB,
        dbName: `matrix-${userId}`
    });
    await store.startup();
    client = sdk.createClient({
        baseUrl: "http://localhost:8008",
        accessToken,
        userId,
        store
    });   
    return client;
}
export function getMatrixClient() {
    return client;
}
export function resetMatrixClient() {
    client = null;
}