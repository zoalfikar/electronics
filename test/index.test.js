const controller = require('../appContent/controllers/controller/index')
const spyMysqlConect = jest.spyOn(controller, 'mysqlConect');
var i = 0;
spyMysqlConect.mockReturnValue("ali");
test("index select all", () => {
    controller.selectAll("tab", null, null)
    controller.selectAll("tab2", null, null)
    expect(spyMysqlConect.mock.calls[i][0].replace(/\s/g, '')).toEqual("select * ,DATE_FORMAT(created_at, '%p %h:%i:%s _ %a %Y/%m/%d') as created_at_formated , DATE_FORMAT(updated_at, '%p %h:%i:%s _ %a %Y/%m/%d') as updated_at_formated  from tab; ".replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls[i = i + 1][0].replace(/\s/g, '')).toEqual("select * ,DATE_FORMAT(created_at, '%p %h:%i:%s _ %a %Y/%m/%d') as created_at_formated , DATE_FORMAT(updated_at, '%p %h:%i:%s _ %a %Y/%m/%d') as updated_at_formated  from tab2; ".replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls.length).toBe(i + 1)
});
test("index insert", () => {
    controller.insert("table", { id: 1, name: "ali", description: "test" }, null)
    expect(spyMysqlConect.mock.calls[i = i + 1][0].replace(/\s/g, '')).toEqual("INSERT INTO table (id, name , description) VALUES (1,\"ali\", \"test\");".replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls.length).toBe(i + 1)
});
test("index update", () => {
    controller.update("table", { name: "ahmad", description: null }, { id: { o: '=', v: 1 } }, null)
    controller.update("table", { name: "jaffar", description: "test" }, { name: { o: 'is', v: null } }, null)
    expect(spyMysqlConect.mock.calls[i = i + 1][0].replace(/\s/g, '')).toEqual("update  table set name = \"ahmad\" , description = NULL where id = 1;".replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls[i = i + 1][0].replace(/\s/g, '')).toEqual("update  table set name = \"jaffar\" , description = \"test\"  where name is null;".replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls.length).toBe(i + 1)
});
test("index delete", () => {
    controller.delet("table", { id: { o: '=', v: 20 } }, null)
    expect(spyMysqlConect.mock.calls[i = i + 1][0].replace(/\s/g, '')).toEqual("DELETE FROM  table WHERE id = 20 ;".replace(/\s/g, ''));
    expect(spyMysqlConect.mock.calls.length).toBe(i + 1)
});