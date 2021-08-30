
import _ from "lodash";
import { Pool, PoolClient } from "pg";
import { using } from "../../../../global/utils";
import { product, productWrapper } from "../models/product.model";
import { BaseService } from "./base.service";

   export class productService extends BaseService {
  
  
      sql_select : string = `
      SELECT .id, .name, .date_of_manufacturing, .address, .contact_number, .version, .created_on, .modified_on, .is_active
      FROM product 
      @condition;
      `;
    
  
sql_insert: string = `
INSERT INTO product(id, name, date_of_manufacturing, address, contact_number, version, created_on, modified_on, is_active)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;  
`;

  sql_update: string = `
    UPDATE product
    SET   name = $2, date_of_manufacturing = $3, address = $4, contact_number = $5, version = $6, created_on = $7, modified_on = $8, is_active = $9
    WHERE id = $1
    RETURNING *;
  `;
  
    sql_delete: string =
` DELETE FROM public.product
   WHERE id = $1
   RETURNING *; `

    public async select(
  _req: product
): Promise<Array<product>> {
  var result: Array<product> = [];
  try {
    await using(this.db.getDisposablePool(), async (pool) => {
      var client = await pool.connect();
      if (client != null) {
        result = await this.selectTransaction(client, _req);
      }
    });
  } catch (error) {
    throw error;
  }
  return result;
}
  
  public async selectTransaction(
      _client: PoolClient,
      _req: product
    ): Promise<Array<product>> {
      var result: Array<product> = [];
      try {
        var query: string = this.sql_select;
        var condition_list: Array<string> = [];
        if (_req.id > 0) {
          condition_list.push(`u.id = ${_req.id}`);
        }
        if (condition_list.length > 0) {
          query = query.replace(
            /@condition/g,
            `WHERE ${condition_list.join(" and ")}`
          );
        } else {
          query = query.replace(/@condition/g, "");
        }
        var { rows } = await _client.query(query);
        if (rows.length > 0) {
          _.forEach(rows, (v) => {
            var temp: product = new product();
           temp.id = v.id != null ? parseInt(v.id) : 0;
temp.name = v.name;
temp.date_of_manufacturing = v.date_of_manufacturing;
temp.address = v.address;
temp.contact_number = v.contact_number != null ? parseInt(v.contact_number) : null;
temp.version = v.version != null ? parseInt(v.version) : null;
temp.created_on = v.created_on;
temp.modified_on = v.modified_on;
temp.is_active = v.is_active;
            result.push(temp);
          });
        }
      } catch (error) {
        throw error;
      }
      return result;
    }
  
    public async insert(_req: product): Promise<product> {
  try {
    await using(this.db.getDisposablePool(), async (pool) => {
      var client = await pool.connect();
      if (client != null) {
        await this.insertTransaction(client, _req);
      }
    });
  } catch (error) {
    throw error;
  }
  return _req;
}
  
public async insertTransaction(
    _client: PoolClient,
    _req: product
  ): Promise<void> {
    try {
      _req.created_on = new Date();
      _req.is_active = true;
      _req.version = 1;

      var { rows } = await _client.query(this.sql_insert, [
        _req.id,
_req.name,
_req.date_of_manufacturing,
_req.address,
_req.contact_number,
_req.version,
_req.created_on,
_req.modified_on,
_req.is_active
       
      ]);
      if (rows.length > 0) {
        var row = rows[0];
        _req.id = row.id != null ? parseInt(row.id) : 0;
      }
    } catch (error) {
      throw error;
    }
  }
    public async update(_req: product): Promise<product> {
  try {
    await using(this.db.getDisposablePool(), async (pool) => {
      var client = await pool.connect();
      if (client != null) {
        await this.updateTransaction(client, _req);
      }
    });
  } catch (error) {
    throw error;
  }
  return _req;
}
  public async updateTransaction(
    _client: PoolClient,
    _req: product
  ): Promise<void> {
    try {
      _req.modified_on = new Date();

      var { rows } = await _client.query(this.sql_update, [
      _req.id,
_req.name,
_req.date_of_manufacturing,
_req.address,
_req.contact_number,
_req.version,
_req.created_on,
_req.modified_on,
_req.is_active
      ]);
      if (rows.length > 0) {
        var row = rows[0];
        _req.id = row.id != null ? parseInt(row.id) : 0;
        _req.version = row.version != null ? parseInt(row.version) : 0;
      }
    } catch (error) {
      throw error;
    }
  }
  public async delete(_req: product): Promise<product> {
  try {
    await using(this.db.getDisposablePool(), async (pool) => {
      var client = await pool.connect();
      if (client != null) {
        await this.deleteTransaction(client, _req);
      }
    });
  } catch (error) {
    throw error;
  }
  return _req;
}
  public async deleteTransaction(
    _client: PoolClient,
    _req: product
  ): Promise<void> {
    try {
      _req.modified_on = new Date();

      var { rows } = await _client.query(this.sql_update, [
      _req.id,
_req.name,
_req.date_of_manufacturing,
_req.address,
_req.contact_number,
_req.version,
_req.created_on,
_req.modified_on,
_req.is_active
      ]);
      if (rows.length > 0) {
        var row = rows[0];
        _req.id = row.id != null ? parseInt(row.id) : 0;
        _req.version = row.version != null ? parseInt(row.version) : 0;
      }
    } catch (error) {
      throw error;
    }
  }
}
