---
"@puyogg/puyoquest-db": patch
---

change default connection db name to puyoquest-db

RDS complains if you try to create a new Postgres instance with a `dbName` value of `db`
