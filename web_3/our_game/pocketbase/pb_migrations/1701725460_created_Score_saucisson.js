/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "mxw6e57o07z7qc4",
    "created": "2023-12-04 21:31:00.711Z",
    "updated": "2023-12-04 21:31:00.711Z",
    "name": "Score_saucisson",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "123iyuyj",
        "name": "pseudo",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "7arnqzx1",
        "name": "score",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("mxw6e57o07z7qc4");

  return dao.deleteCollection(collection);
})
