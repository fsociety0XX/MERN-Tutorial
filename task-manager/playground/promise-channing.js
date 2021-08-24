require('../src/db/mongoose')
const Tasks = require('../src/models/task')

const removeAndGetSpecificTaskList = async () => {
    await Tasks.findByIdAndDelete('61162a30d7b81716eb35406a')
    const tasks = await Tasks.find({completed: false})
    return tasks
}

removeAndGetSpecificTaskList().then((res) => console.log(res))
.catch(e => console.log(e))