const express = require('express')
const route = new express.Router()
const Tasks = require('../models/task')
const auth = require('../middleware/auth')

const createTasks = async (req, res) => {
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
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
        await req.user.populate('tasks').execPopulate()
        res.send(tasks)
    }catch(err) {
        res.status(500).send()
    }
}

route.get('/tasks',auth, fetchAllTasks)

const fetchSpecificTask = async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Tasks.findOne({_id, owner: req.user._id })
        if(!task) return res.status(404).send()
        res.send(task)
    } catch(err) {
        res.status(500).send(err)
    }
}

route.get('/tasks/:id', auth, fetchSpecificTask)

const updateTasks = async (req, res) => {
    const updateParam = Object.keys(req.body)
    const validParams = ['description', 'completed']
    const validOperation = updateParam.every((update) => validParams.includes(update))
    if(!validOperation) {
        return res.status(404).send({'error': 'invalid updates'})
    }
    const _id = req.params.id
    try {
        const task = await Tasks.findOne({_id, owner: req.user._id})
        if(!task) {
            return res.status(404).send('No task found')
         }
        updateParam.forEach(update => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
}

route.patch('/tasks/:id', auth,  updateTasks)

const deleteTask = async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Tasks.findOneAndDelete({_id, owner: req.user._id})
        if(!task) {
            return res.status(404).send('No task found')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
}

route.delete('/tasks/:id', auth, deleteTask)

module.exports = route