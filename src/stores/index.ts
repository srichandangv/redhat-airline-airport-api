import { DATAGRID_AIRPORT_DATA_STORE, NODE_ENV } from '../config';
import getDataGridClientForCacheNamed from '../datagrid/client';
import { Airport } from '../entity/airport';
import log from '../log';

const getClient = getDataGridClientForCacheNamed(DATAGRID_AIRPORT_DATA_STORE);

/**
 * Returns an instance of a Airport from the cache, or undefined if the airport
 * was not found in the cache
 * @param iata
 */
export async function getAirportInCache(
  iata: string
): Promise<Airport | undefined> {
  log.debug(`getAirportInCache for ${iata}`);

  let data = undefined;
  try {
    log.debug(`getAirportInCache, getClient for ${iata}`);
    const client = await getClient;
    data = await client.get(iata);
    log.debug(`getAirportInCache, cache data for ${iata}: ` + data);
  } catch (ex) {
    log.error("couldn't get the client:" + ex);
    return undefined;
  }

  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      log.warn(
        `found airport data for "${iata}", but failed to parse to JSON: %j`,
        data
      );
      return undefined;
    }
  } else {
    return undefined;
  }
}

/**
 * Insert/Update the airport entry in the cache
 * @param airport
 */
export async function upsertAirportInCache(airport: Airport) {
  log.debug(`upsertAirportInCache for ${airport.iata}`);
  const data = JSON.stringify(airport);
  log.debug(`with data : ` + data);

  try {
    const client = await getClient;
    return client.put(airport.iata, data);
  } catch (ex) {
    log.error("couldn't get the client:" + ex);
  }
}
