const express = require('express')
const route = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

const createTasks = async (req, res) => {
    const task = new Task({
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
    const match = {}
    const sort = {}
    const skip = parseInt((req.query.page - 1) * req.query.limit)

    if(req.query.completed) {
        match.completed = req.query.completed
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] =  parts[1] === 'desc' ? -1 : 1
    }

    try {
        //const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip,
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(err) {
        res.status(500).send('Invalid Request')
    }
}

route.get('/tasks',auth, fetchAllTasks)

const fetchSpecificTask = async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner: req.user._id })
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
        const task = await Task.findOne({_id, owner: req.user._id})
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
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
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