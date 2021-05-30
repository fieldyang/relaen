let sql = 'select a,b from    t_user    t0 where ';
let r = /from\s+\w+/.exec(sql);

let tbl = r[0].replace(/from\s+/,'');
console.log("'" + tbl + "'");