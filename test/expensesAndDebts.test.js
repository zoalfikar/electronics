const controller = require('../appContent/controllers/controller/index')
jest.mock('../appContent/controllers/controller/index')
require('./mockIndex')

test("mock implementation", async() => {
    var result = await controller.selectAll()
    console.log(result);
    expect(result).toBe("ALI");
});