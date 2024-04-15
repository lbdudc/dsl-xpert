// Import Mongoose model
import ModelSchema from '../schemas/Model.js';

export default class ModelController {

    static async create(req, res) {
        const { name, definition } = req.body;

        try {
            const model = new ModelSchema({ name, definition });
            await model.save();
            res.send(model);
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }

    static async findAll(req, res) {
        try {
            const models = await ModelSchema.find({});
            res.send(models);
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }

    // get model by name
    static async findOne(req, res) {
        const name = req.params.name;

        try {
            const model = await ModelSchema.findOne({
                name: name
            });
            if (!model) {
                res.status(404).send({ message: `Model with name ${id} not found` });
            } else {
                res.send(model);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }

    static async update(req, res) {
        const id = req.params.id;
        const { name, definition } = req.body;

        try {
            const model = await ModelSchema.findByIdAndUpdate(
                {
                    _id: id
                },
                {
                    name,
                    definition
                },
                {
                    new: true
                }
            );
            if (!model) {
                res.status(404).send({ message: `Model with id ${id} not found` });
            }
            res.send(model);
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }

    static async delete(req, res) {
        const id = req.params.id;
        try {
            const model = await ModelSchema.findByIdAndDelete(
                {
                    _id: id
                });
            if (!model) {
                res.status(404).send({ message: `Model with id ${id} not found` });
            }
            res.send(model);
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }

}




