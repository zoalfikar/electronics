const mockIndex = require('../appContent/controllers/controller/index')
mockIndex.selectAll.mockImplementation(() => Promise.resolve("ALI"))