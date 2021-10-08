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
  log.trace(`reading data for airport ${iata}`);
  const client = await getClient;
  const data = await client.get(iata);

  if (data) {
    try {
      return Airport.fromJSON(JSON.parse(data));
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
  const data = airport.toJSON();
  const client = await getClient;
  log.trace(`writing player to cache: %j`, data);
  return client.put(airport.iata, JSON.stringify(data));
}
