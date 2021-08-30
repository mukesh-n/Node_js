import { Environment } from "./environment";
import { IDisposable } from "./idisposal";
import * as _ from "lodash";
import pg, { Pool, PoolClient } from "pg";

export class DisposablePool implements IDisposable {
  static global_pool: Pool | null = null;
  client: pg.PoolClient | null = null;
  constructor() {
    if (DisposablePool.global_pool == null) {
      var environment: Environment = Environment.getInstance();
      DisposablePool.global_pool = new Pool({
        user: environment.SQL_SERVER_USER,
        host: environment.SQL_SERVER,
        database: environment.SQL_SERVER_DATABASE,
        password: environment.SQL_SERVER_PASSWORD,
        port: environment.SQL_SERVER_PORT,
      });
    }
  }
  async connect(): Promise<PoolClient | null> {
    try {
      if (DisposablePool.global_pool != null)
        this.client = await DisposablePool.global_pool.connect();
    } catch (e) {
      var error = e;
      throw error;
    }
    return this.client;
  }
  async dispose(): Promise<void> {
    try {
      if (this.client) {
        this.client.release();
      }
    } catch (e) {
      var error = e;
      throw error;
    }
  }
}

export class DB {
  constructor() {}
  getDisposablePool(): DisposablePool {
    return new DisposablePool();
  }
}
