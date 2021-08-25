require('../src/db/mongoose')
const Task = require('../src/models/task')

const removeAndGetSpecificTaskList = async () => {
    await Task.findByIdAndDelete('61162a30d7b81716eb35406a')
    const tasks = await Task.find({completed: false})
    return tasks
}

removeAndGetSpecificTaskList().then((res) => console.log(res))
.catch(e => console.log(e))