const express = require('express')
const route = new express.Router()
const Tasks = require('../models/task')
const auth = require('../middleware/auth')

const createTasks = async (req, res) => {
    const task = new Tasks({
        ...req.body,
        author: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch(err) {
        res.status(400).send(err)
    }
 }

route.post('/tasks', auth, createTasks)

const fetchAllTasks = async (req, res) => {
    try {
       const tasks = await Tasks.find({})
       res.send(tasks)
    }catch(err) {
        res.status(500).send()
    }
}

route.get('/tasks', fetchAllTasks)

const fetchSpecificTask = async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Tasks.findById(_id)
        console.log(task)
        if(!task) return res.status(404).send()
        res.send(task)
    } catch(err) {
        res.status(500).send(err)
    }
}

route.get('/tasks/:id', fetchSpecificTask)

const updateTasks = async (req, res) => {
    const updateParam = Object.keys(req.body)
    const validParams = ['description', 'completed']
    const validOperation = updateParam.every((update) => validParams.includes(update))

    if(!validOperation) {
        return res.status(404).send({'error': 'invalid updates'})
    }
    const _id = req.params.id
    try {
        const task = await Tasks.findById(_id)
        updateParam.forEach(update => task[update] = req.body[update])
        await task.save()

        if(!task) {
           return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
}

route.patch('/tasks/:id', updateTasks)

const deleteTask = async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Tasks.findByIdAndDelete(_id)
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
}

route.delete('/tasks/:id', deleteTask)

module.exports = route