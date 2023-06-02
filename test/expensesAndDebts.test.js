// const t = require('../appContent/controllers/expensesAndDebts')
const t = require('../test0')
test("mock implementation", () => {

    return t.allDebts().then(data => {
        expect(data).toStrictEqual([JSON.parse(JSON.stringify({
            id: 3,
            name: 'z',
            phoneNumber: 1,
            totall: 1,
            description: null,
            inventoryId: null,
            paid: 0,
            created_at: "2023-05-31T16:11:06.000Z",
            updated_at: "2023-05-31T16:11:06.000Z",
            created_at_formated: 'PM 07:11:06 _ Wed 2023/05/31',
            updated_at_formated: 'PM 07:11:06 _ Wed 2023/05/31'
        }))]);
    });
});
const controller = require('../appContent/controllers/controller/index')
jest.mock('../appContent/controllers/controller/index')
test("mock implementation", () => {
    console.log(controller);
    expect(null).toBe(null);
});