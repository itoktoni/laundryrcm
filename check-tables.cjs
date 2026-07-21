const {createClient}=require('@libsql/client');
const db=createClient({
  url:'libsql://laundry-app-itoktoni.aws-ap-northeast-1.turso.io',
  authToken:'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODQ0NDQ5MTUsImlkIjoiMDE5Zjc0NDEtZjgwMS03N2Q4LThiNTUtODQwZGQyNWIzYTk2Iiwia2lkIjoiOE1yUThLTHVYbV9ZenE0emIyM1B6cU5yeDJVSzBrOWUxUjl1NjlnQmVUYyIsInJpZCI6IjY2YWVjMjkyLTE3OTgtNGZlNC1iZmNjLTllNjhiYjc4MTZiNiJ9.mib6Yfi0HyV_KN-3xsxckjj7a_8-CxYbesjkCC9yYiqjD-pCISSjsFJx6hBV0BkUJNV_lV3dXsmMkJrNvv88DQ'
});
db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").then(r=>{
  console.log('Tables:', r.rows.map(x=>x.name).join('\n  '));
}).catch(e=>console.error(e.message));