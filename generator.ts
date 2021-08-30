import express from "express";
import _, { indexOf, join, replace, template } from "lodash";
let input = {
  name: "Users",
  columns: [
    {
        name: "id",
        type: "number",
      },
      {
        name: "name",
        type: "string",
      },
      {
        name: "date_of_birth",
        type: "date",
      },
      {
        name: "address",
        type: "string",
      },
      {
        name: "phone_number",
        type: "number",
      },
      {
        name: "version",
        type: "number",
      },
      {
        name: "created_on",
        type: "date",
      },
      {
        name: "modified_on",
        type: "date",
      },
      {
        name: "is_active",
        type: "boolean",
      }
  ],
};

/* model */
var properties: Array<string> = [];
_.forEach(input.columns, (v) => {
  var property: string = "";

  switch (v.type) {
    case "string":
      property = `${v.name}:string | null = null;`;
      break;
    case "number":
      if (v.name == "id") property = `${v.name}:number = 0;`;
      else property = `${v.name}:number | null = null;`;
      break;
    case "date":
      property = `${v.name}:Date | null = null;`;
      break;
    case "boolean":
      property = `${v.name}:boolean = false;`;

    default:
      break;
  }
  properties.push(property);
});

// version_name: string | null = null;

let model_template: string = `
  export class ${input.name} extends Base{
    ${properties.join("\n")}
  }
  export class ${input.name}Wrapper extends @name{
  
  }
  `;
let modelname = input.name;
let modelpropertylist = `${properties.join("\n")}`;
let model = _.replace(model_template, /@name/g, modelname);
model = _.replace(model, /@propertylist/g, modelpropertylist);

// console.log(model);

// let _model = `export class ${input.name} from base{
//   ${model_template}
// }`
// console.log(_model)

// ***************************************************************************************************************
/* service */
/* select query */
let table_name_path =input.name.toLowerCase()


let file_path_service_template: string = `
import _ from "lodash";
import { Pool, PoolClient } from "pg";
import { using } from "../../../../global/utils";
import { @tablename, @tablenameWrapper } from "../models/@tablepath.model";
import { BaseService } from "./base.service";`

let table_name = input.name;

let file_path_service_entity_template = _.replace(file_path_service_template,
  /@tablename/g,
  table_name);

  let table_name_path_temp = _.replace(file_path_service_entity_template,
    /@tablepath/g,
    table_name_path)
let sql_select_query_template = `
      sql_select : string = \`
      SELECT @columnlist
      FROM @tablename @alias
      @condition;
      \`;
    `;
let selectquerytablename = input.name;
let selectqueryalias = _.filter(input.name.split(""), (v) => {
  return v == v.toUpperCase();
})
  .join()
  .toLowerCase();
let selectquerycolumnlist = _.map(input.columns, (v, i) => {
  return `${i == 0 ? "" : ", "}${selectqueryalias}.${v.name}`;
}).join("");
let sql_select_query = _.replace(
  sql_select_query_template,
  /@tablename/g,
  selectquerytablename
);
sql_select_query = _.replace(sql_select_query, /@alias/g, selectqueryalias);
sql_select_query = _.replace(
  sql_select_query,
  /@columnlist/,
  selectquerycolumnlist
);

// select method
let select_method_template = `  public async select(
  _req: @tablename
): Promise<Array<@tablename>> {
  var result: Array<@tablename> = [];
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
}`;

let selectmodelname = modelname;

let select_method = _.replace(
  select_method_template,
  /@tablename/g,
  selectmodelname
);

/* select transaction */
let select_transaction_template: string = `
  public async selectTransaction(
      _client: PoolClient,
      _req: @modelname
    ): Promise<Array<@modelname>> {
      var result: Array<@modelname> = [];
      try {
        var query: string = this.sql_select;
        var condition_list: Array<string> = [];
        if (_req.id > 0) {
          condition_list.push(\`u.id = \${_req.id}\`);
        }
        if (condition_list.length > 0) {
          query = query.replace(
            /@condition/g,
            \`WHERE \${condition_list.join(" and ")}\`
          );
        } else {
          query = query.replace(/@condition/g, "");
        }
        var { rows } = await _client.query(query);
        if (rows.length > 0) {
          _.forEach(rows, (v) => {
            var temp: @modelname = new @modelname();
            @propertyassignmentlist
            result.push(temp);
          });
        }
      } catch (error) {
        throw error;
      }
      return result;
    }
  `;
let selecttransmodelname = modelname;
let selecttranspropertyassignmentlist = _.map(input.columns, (v) => {
  let propertyassignment = "";
  switch (v.type) {
    case "number":
      if (v.name == "id")
        propertyassignment = `temp.${v.name} = v.${v.name} != null ? parseInt(v.${v.name}) : 0;`;
      else
        propertyassignment = `temp.${v.name} = v.${v.name} != null ? parseInt(v.${v.name}) : null;`;
      break;
    case "string":
    case "boolean":
    case "date":
      propertyassignment = `temp.${v.name} = v.${v.name};`;
      break;
    default:
      break;
  }
  return propertyassignment;
}).join("\n");

let select_transaction = _.replace(
  select_transaction_template,
  /@modelname/g,
  selecttransmodelname
);
select_transaction = _.replace(
  select_transaction,
  / @propertyassignmentlist/,
  selecttranspropertyassignmentlist
);

// ****************************************************************************************************************
// insert query
let sql_insert_query_template = `
sql_insert: string = \`
INSERT INTO @tablename(@columnlist)
VALUES (@columnvalues)
RETURNING *;  
\`;
`;

// insert method

let insert_method_template: string = `  public async insert(_req: @tablename): Promise<@tablename> {
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
}`;

let insert_method = _.replace(
  insert_method_template,
  /@tablename/g,
  selectquerytablename
);

let insertquerytablename = input.name;

let insertqueryvalues: any = _.map(input.columns, (v, i) => {
  return `${"$" + (i + 1)}`;
}).join(", ");

let insertquerycolumnlist = _.map(input.columns, (v) => {
  return `${v.name}`;
}).join(", ");

let sql_insert_query = _.replace(
  sql_insert_query_template,
  /@tablename/g,
  insertquerytablename
);

sql_insert_query = _.replace(
  sql_insert_query,
  /@columnvalues/g,
  insertqueryvalues
);

sql_insert_query = _.replace(
  sql_insert_query,
  /@columnlist/g,
  insertquerycolumnlist
);

// insert transcation

let insert_transaction_template = `
public async insertTransaction(
    _client: PoolClient,
    _req: @modelname
  ): Promise<void> {
    try {
      _req.created_on = new Date();
      _req.is_active = true;
      _req.version = 1;

      var { rows } = await _client.query(this.sql_insert, [
        @parametername
       
      ]);
      if (rows.length > 0) {
        var row = rows[0];
        _req.id = row.id != null ? parseInt(row.id) : 0;
      }
    } catch (error) {
      throw error;
    }
  }`;

let parameternameassignmentlist: any = _.map(input.columns, (v) => {
  return `_req.${v.name}`;
}).join(",\n");

let inserttransmodelname = modelname;

let insert_transaction = _.replace(
  insert_transaction_template,
  /@modelname/g,
  inserttransmodelname
);

insert_transaction = _.replace(
  insert_transaction,
  /@parametername/g,
  parameternameassignmentlist
);

// ****************************************************************************************************************
// update query

let sql_update_query_template = `sql_update: string = \`
    UPDATE @tablename
    SET @tablevalues
    WHERE @tableid
    RETURNING *;
  \`;
  `;

let updatequerytablename = input.name;

let sql_update_query = _.replace(
  sql_update_query_template,
  /@tablename/,
  updatequerytablename
);

// update_method

let update_method_template: string = `  public async update(_req: @tablename): Promise<@tablename> {
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
}`;

let update_method = _.replace(
  update_method_template,
  /@tablename/g,
  updatequerytablename
);

let updatesetvalues: any = _.map(input.columns, (v, i) => {
  if (v.name == "id") {
    return " ";
  } else {
    return `${v.name}${" = $" + (i + 1)}${
      i == input.columns.length - 1 ? "" : ","
    }`;
  }
}).join(" ");

sql_update_query = _.replace(sql_update_query, /@tablevalues/, updatesetvalues);

let whereconditionquery = "id = $1";

sql_update_query = _.replace(sql_update_query, /@tableid/, whereconditionquery);

// update transaction

let update_transaction_template = `public async updateTransaction(
    _client: PoolClient,
    _req: @tablename
  ): Promise<void> {
    try {
      _req.modified_on = new Date();

      var { rows } = await _client.query(this.sql_update, [
      @parameternames
      ]);
      if (rows.length > 0) {
        var row = rows[0];
        _req.id = row.id != null ? parseInt(row.id) : 0;
        _req.version = row.version != null ? parseInt(row.version) : 0;
      }
    } catch (error) {
      throw error;
    }
  }`;

let parameternamesassignmentlist: any = _.map(input.columns, (v) => {
  return `_req.${v.name}`;
}).join(",\n");

let update_transaction = _.replace(
  update_transaction_template,
  /@parameternames/g,
  parameternamesassignmentlist
);
update_transaction = _.replace(
  update_transaction,
  /@tablename/,
  updatequerytablename
);

// ****************************************************************************************************************
// delete query

let sql_delete_query_template = `  sql_delete: string =
\` DELETE FROM public.@tablename
   WHERE @deletecondition
   RETURNING *; \`
`;

let deletequerytablename = input.name;

let sql_delete_query = _.replace(
  sql_delete_query_template,
  /@tablename/,
  deletequerytablename
);

let whereconditionquerydelete = "id = $1";
sql_delete_query = _.replace(
  sql_delete_query,
  /@deletecondition/,
  whereconditionquerydelete
);

// delete method

let delete_method_template: string = `public async delete(_req: @tablename): Promise<@tablename> {
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
}`;

let delete_method = _.replace(
  delete_method_template,
  /@tablename/g,
  deletequerytablename
);

// delete transaction
let delete_transaction_template: string = `public async deleteTransaction(
    _client: PoolClient,
    _req: @tablename
  ): Promise<void> {
    try {
      _req.modified_on = new Date();

      var { rows } = await _client.query(this.sql_update, [
      @params
      ]);
      if (rows.length > 0) {
        var row = rows[0];
        _req.id = row.id != null ? parseInt(row.id) : 0;
        _req.version = row.version != null ? parseInt(row.version) : 0;
      }
    } catch (error) {
      throw error;
    }
  }`;

let paramsnamesassignmentlist: any = _.map(input.columns, (v) => {
  return `_req.${v.name}`;
}).join(",\n");

let delete_transaction = _.replace(
  delete_transaction_template,
  /@params/g,
  paramsnamesassignmentlist
);
delete_transaction = _.replace(
  delete_transaction,
  /@tablename/,
  deletequerytablename
);

export let service = `
class ${input.name}Service extends BaseService {
  ${sql_select_query}
  ${sql_insert_query}
  ${sql_update_query}
  ${sql_delete_query}
  ${select_method}
  ${select_transaction}
  ${insert_method}
  ${insert_transaction}
  ${update_method}
  ${update_transaction}
  ${delete_method}
  ${delete_transaction}
}
`;
// console.log(service);

/* controller */
// controller get
const router = express.Router();
let controllertablename: string = input.name;
let table_name_path_c = input.name.toLowerCase()

let file_path_controller_template = `import express from "express";
import { ActionRes } from "../../../../global/model/actionres.model";
import { @tablename, @tablenameWrapper } from "../models/@tablepath.model";
import { @tablenameService } from "../service/@tablepath.service";
const router = express.Router();`

let entity_file_path_controller_template = _.replace(file_path_controller_template,
  /@tablename/g,
  controllertablename
  );

 let table_name_path_controller = _.replace(entity_file_path_controller_template,
    /@tablepath/g,
    table_name_path_c )
/* entity controller */
let entity_controller_template: string = `router.get("/entity", async (req, res, next) => {
        try {
          var result: ActionRes<@tablename> = new ActionRes<@tablename>({
            item: new @tablename(),
          });
          next(result);
        } catch (error) {
          next(error);
        }
      });`;



let entityControllerTemplate = _.replace(
  entity_controller_template,
  /@tablename/g,
  controllertablename
);
// console.log(entityControllerTemplate)

/* get controller */

let get_controller_template: string = `router.post("/get", async (req, res, next) => {
  try {
    var result: ActionRes<Array<@tablename>> = new ActionRes<
      Array<@tablename>
    >();
    var service: @tablenameService = new @tablenameService();
    result.item = await service.select(req.body.item);
    next(result);
  } catch (error) {
    next(error);
  }
});`;

let getControllerTemplate = _.replace(
  get_controller_template,
  /@tablename/g,
  controllertablename
);

// console.log(getControllerTemplate)
// insert controller

let insert_contoller_template: string = `router.post("/insert", async (req, res, next) => {
        try {
          var result: ActionRes<@tablename> = new ActionRes<@tablename>();
          var service: @tablenameService = new @tablenameService();
          result.item = await service.insert(req.body.item);
          next(result);
        } catch (error) {
          next(error);
        }
      });`;

let insertControllerTemplate: string = _.replace(
  insert_contoller_template,
  /@tablename/g,
  controllertablename
);

// console.log(insertControllerTemplate);

// update controller

let update_controller_template: string = `router.post("/update", async (req, res, next) => {
        try {
          var result: ActionRes<@tablename> = new ActionRes<@tablename>();
          var service: @tablenameService = new @tablenameService();
          result.item = await service.update(req.body.item);
          next(result);
        } catch (error) {
          next(error);
        }
      });`;

let updatecontrollertemplate: string = _.replace(
  update_controller_template,
  /@tablename/g,
  controllertablename
);
// console.log(updatecontrollertemplate);

// delete controller

let delete_controller_template: string = `router.post("/delete", async (req, res, next) => {
        try {
          var result: ActionRes<@tablename> = new ActionRes<@tablename>();
          var service: @tablenameService = new @tablenameService();
          result.item = await service.delete(req.body.item);
          next(result);
        } catch (error) {
          next(error);
        }
      });
      export { router as @tablenameController}`;

let deleteControllerTemplate: string = _.replace(
  delete_controller_template,
  /@tablename/g,
  controllertablename
);

// console.log(deleteControllerTemplate)

let controller: string = `
const router = express.Router();
${entityControllerTemplate}
${getControllerTemplate}
${insertControllerTemplate}
${updatecontrollertemplate}
${deleteControllerTemplate}
`;

import * as fs from 'fs';
import * as path from 'path';

fs.writeFile(path.join(__dirname, `./src/app/modules/project/controller/${input.name.toLowerCase()}.controller.ts`), 
`${table_name_path_controller}
${entityControllerTemplate}
${getControllerTemplate}
${insertControllerTemplate}
${updatecontrollertemplate}
${deleteControllerTemplate}
`, (err) => {
        console.error(err);
        
    });

fs.writeFile(
  path.join(__dirname, `./src/app/modules/project/service/${input.name.toLowerCase()}.service.ts`),
  `${table_name_path_temp}

   export class ${input.name}Service extends BaseService {
  
  ${sql_select_query}
  ${sql_insert_query}
  ${sql_update_query}
  ${sql_delete_query}
  ${select_method}
  ${select_transaction}
  ${insert_method}
  ${insert_transaction}
  ${update_method}
  ${update_transaction}
  ${delete_method}
  ${delete_transaction}
}
`,
  (err) => {
    console.error(err);
  }
);

fs.writeFile(
  path.join(__dirname, `./src/app/modules/project/models/${input.name.toLowerCase()}.model.ts`),
  `import { Base } from "./base.model"
export class ${input.name} extends Base{
  ${properties.join("\n")}
}
export class ${input.name}Wrapper extends ${input.name}{

}
`,
  (err) => {
    console.log(err);
  }
);

// import _ from "lodash";
// import { Pool, PoolClient } from "pg";
// import { using } from "../../../../global/utils";
// import { Users, UserWrapper } from "../models/users.model";
// import { BaseService } from "./base.service";

// import express from "express";
// import { ActionRes } from "../../../../global/model/actionres.model";
// import { Users, UsersWrapper } from "../models/users.model";
// import { UsersService } from "../service/users.service";
// const router = express.Router();

// {
//   name: "id",
//   type: "number",
// },
// {
//   name: "name",
//   type: "string",
// },
// {
//   name: "date_of_birth",
//   type: "date",
// },
// {
//   name: "address",
//   type: "string",
// },
// {
//   name: "phone_number",
//   type: "number",
// },
// {
//   name: "version",
//   type: "number",
// },
// {
//   name: "created_on",
//   type: "date",
// },
// {
//   name: "modified_on",
//   type: "date",
// },
// {
//   name: "is_active",
//   type: "boolean",
// }
