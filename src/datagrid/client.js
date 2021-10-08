"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const infinispan_1 = __importDefault(require("infinispan"));
const log_1 = __importDefault(require("../log"));
async function getClient(nodes, cacheName) {
    const client = await infinispan_1.default.client(nodes, {
        cacheName,
    });
    log_1.default.info(`connected to infinispan for "${cacheName}" cache`);
    const stats = await client.stats();
    log_1.default.info(`stats for "${cacheName}":\n`, JSON.stringify(stats, null, 2));
    return client;
}
async function getDataGridClientForCacheNamed(cacheName, eventHandler) {
    log_1.default.info(`creating infinispan client for cache named "${cacheName}"`);
    const nodes = [
        {
            host: config_1.DATAGRID_HOST,
            port: config_1.DATAGRID_HOTROD_PORT,
        },
    ];
    const client = await getClient(nodes, cacheName);
    if (eventHandler) {
        const listenerId = await client.addListener('create', (key) => eventHandler(client, 'create', key));
        await client.addListener('modify', (key) => eventHandler(client, 'modify', key), { listenerId });
    }
    return client;
}
exports.default = getDataGridClientForCacheNamed;
//# sourceMappingURL=client.js.map