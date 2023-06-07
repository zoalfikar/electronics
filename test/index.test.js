const controller = require('../appContent/controllers/controller/index')
const spyMysqlConect = jest.spyOn(controller, 'mysqlConect');
var i = 0;
spyMysqlConect.mockReturnValue("ali");
test("index select all", () => {
    controller.selectAll("tab", null, null)
    controller.selectAll("tab2", null, null)
    expect(spyMysqlConect.mock.calls[i][0].toLowerCase().replace(/\s/g, '')).toEqual("select * ,DATE_FORMAT(created_at, '%p %h:%i:%s _ %a %Y/%m/%d') as created_at_formated , DATE_FORMAT(updated_at, '%p %h:%i:%s _ %a %Y/%m/%d') as updated_at_formated  from tab; ".toLowerCase().replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls[i = i + 1][0].toLowerCase().replace(/\s/g, '')).toEqual("select * ,DATE_FORMAT(created_at, '%p %h:%i:%s _ %a %Y/%m/%d') as created_at_formated , DATE_FORMAT(updated_at, '%p %h:%i:%s _ %a %Y/%m/%d') as updated_at_formated  from tab2; ".toLowerCase().replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls.length).toBe(i + 1)
});
test("index insert", () => {
    controller.insert("table", { id: 1, name: "ali", description: "test" }, null)
    expect(spyMysqlConect.mock.calls[i = i + 1][0].toLowerCase().replace(/\s/g, '')).toEqual("INSERT INTO table (id, name , description) VALUES (1,\"ali\", \"test\");".toLowerCase().replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls.length).toBe(i + 1)
});
test("index update", () => {
    controller.update("table", { name: "ahmad", description: null }, { id: { o: '=', v: 1 } }, null)
    controller.update("table", { name: "jaffar", description: "test" }, { name: { o: 'is', v: null } }, null)
    expect(spyMysqlConect.mock.calls[i = i + 1][0].toLowerCase().replace(/\s/g, '')).toEqual("update  table set name = \"ahmad\" , description = NULL where id = 1;".toLowerCase().replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls[i = i + 1][0].toLowerCase().replace(/\s/g, '')).toEqual("update  table set name = \"jaffar\" , description = \"test\"  where name is null;".toLowerCase().replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls.length).toBe(i + 1)
});
test("index delete", () => {
    controller.delet("table", { id: { o: '=', v: 20 } }, null)
    expect(spyMysqlConect.mock.calls[i = i + 1][0].toLowerCase().replace(/\s/g, '')).toEqual("DELETE FROM  table WHERE id = 20 ;".toLowerCase().replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls.length).toBe(i + 1)
});
test("index selectAllOrderedBy", () => {
    controller.selectAllOrderedBy("table", "column", "DESC", null)
    controller.selectAllOrderedBy("table", "column", "ASC", null)
    controller.selectAllOrderedBy("table", "column", null, null)
    expect(spyMysqlConect.mock.calls[i = i + 1][0].toLowerCase().replace(/\s/g, '')).toEqual("select * ,DATE_FORMAT(created_at, '%p %h:%i:%s _ %a %Y/%m/%d') as created_at_formated , DATE_FORMAT(updated_at, '%p %h:%i:%s _ %a %Y/%m/%d') as updated_at_formated  from table ORDER BY column DESC; ".toLowerCase().replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls[i = i + 1][0].toLowerCase().replace(/\s/g, '')).toEqual("select * ,DATE_FORMAT(created_at, '%p %h:%i:%s _ %a %Y/%m/%d') as created_at_formated , DATE_FORMAT(updated_at, '%p %h:%i:%s _ %a %Y/%m/%d') as updated_at_formated  from table ORDER BY column ASC; ".toLowerCase().replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls[i = i + 1][0].toLowerCase().replace(/\s/g, '')).toEqual("select * ,DATE_FORMAT(created_at, '%p %h:%i:%s _ %a %Y/%m/%d') as created_at_formated , DATE_FORMAT(updated_at, '%p %h:%i:%s _ %a %Y/%m/%d') as updated_at_formated  from table ORDER BY column ASC; ".toLowerCase().replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls.length).toBe(i + 1)
});
test("index select", () => {
    controller.select("table", { name: "ali" }, null, null)
    expect(spyMysqlConect.mock.calls[i = i + 1][0].toLowerCase().replace(/\s/g, '')).toEqual("select *   from table WHERE name = 'ali'  ; ".toLowerCase().replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls.length).toBe(i + 1)
});
test("index selectWhere", () => {
    controller.selectWhere("table", { name: { o: "=", v: "ali" }, salary: { o: ">=", v: 1000 }, desc: { o: 'is', v: null } }, null, null)
    controller.selectWhere("table", { name: { o: "=", v: "ali" }, salary: { o: ">=", v: 1000 }, desc: { o: 'is', v: null, r: "or" } }, null, null)
    expect(spyMysqlConect.mock.calls[i = i + 1][0].toLowerCase().replace(/\s/g, '')).toEqual("select *   from table WHERE name = \"ali\" AND salary >= 1000 AND desc is null  ; ".toLowerCase().replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls[i = i + 1][0].toLowerCase().replace(/\s/g, '')).toEqual("select *   from table WHERE name = \"ali\" AND salary >= 1000 or desc is null  ; ".toLowerCase().replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls.length).toBe(i + 1)
});
test("index columnSumWhere", () => {
    controller.columnSumWhere("table", "column", { name: { o: "=", v: "ali" }, salary: [{ o: ">=", v: 1000 }, { o: "<", v: 500, r: "OR" }] }, null, null)
    expect(spyMysqlConect.mock.calls[i = i + 1][0].toLowerCase().replace(/\s/g, '')).toEqual("select SUM(column)AS sum from table WHERE name = \"ali\" AND salary >= 1000 OR salary < 500  ; ".toLowerCase().replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls.length).toBe(i + 1)
});