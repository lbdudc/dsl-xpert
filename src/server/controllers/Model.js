// Import Mongoose model
import ModelSchema from '../schemas/Model.js';
import OpenAI from "openai";

const OPENAI_KEY = process.env.OPENAI_API_KEY;

export default class ModelController {

    static async create(req, res) {
        try {
            const model = new ModelSchema(req.body);
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
                res.status(404).send({ message: `Model with name ${name} not found` });
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

        try {
            const model = await ModelSchema.findByIdAndUpdate(
                {
                    _id: id
                },
                req.body,
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

    static async createChat(req, res) {
        try {
            const { id } = req.params;
            let model = null
            model = await ModelSchema.findOne({
                _id: id
            });
            if (!model) {
                res.status(404).send({ message: `Model with id ${id} not found` });
            }
            const { modelType, temperature, seed, definition } = model;

            // Initialize the variables and the context for correct model inference
            const openai = new OpenAI({
                apiKey: OPENAI_KEY,
            });
            let nTokens = 0;
            const initialContext = [
                {
                    role: "system",
                    content:
                        "You are a helpful assistant that will provide answers converting our instructions using the grammar vocabulary and the examples that we will give you in the next input.",
                },
                {
                    role: "user",
                    content:
                        'I need you to use this grammar for a set of instructions that I will be giving you:\n\n' + definition + '\n\nCould you acknowledge that you understand what I want you to do in my following prompts?\nJust say "yes" or "no". I do not want you to do any additional work by now.',
                },
                { role: "assistant", content: "Yes." },
                {
                    role: "user",
                    content:
                        'In addition to prior grammar, these are some examples of what I expect you to do, separated by <s> and [INST] to highlight the instruction:\n<s>[INST] Create a product called intecmar with an srid of 4326. [/INST]\nCREATE PRODUCT intecmar USING 4326; </s>\n\n<s>[INST] Create a spatial dimension called Municipality with a Geometry geometry and a property called cMun, which is an Integer. [/INST]\nCREATE SPATIAL DIMENSION Municipality (\n\tgeometry: Geometry\n) WITH PROPERTIES (\n\tcMun Integer\n); </s>\n\n<s>[INST] Create a categorical dimension called Depth with a field called depth. [/INST]\nCREATE CATEGORICAL DIMENSION Depth (\n\tfield: depth\n); </s>\n\n<s>[INST] Create a range called MagnitudRange with the following definitions: 0-3 for surface, 4.75-5.25 for 5m, 9.75-10.25 for 10m, 14.75-15.25 for 15m and 19.75-20.25 for 20m. [/INST]\nCREATE RANGE MagnitudRange (\n\t0 TO 3 AS "surface",\n\t4.75 TO 5.25 AS "5m",\n\t9.75 TO 10.25 AS "10m",\n\t14.75 TO 15.25 AS "15m",\n\t19.75 TO 20.25 AS "20m"\n); </s>\n\n<s>[INST] Create a sensor called StationObservation with a 300 interval, an elasticsearch datasource and a Point geometry. It also has several different properties called as follows, with their datatype between parenthesis: maxDepth (Float), code (String), name (String), descripcion (String), startTime (DateTime) and endTime (DateTime). It also has the following measurement data names, along with their datatypes, units, icon and range between parenthesis (note that many of them may lack the range and the icon information): temperature_ITS90 (Double, "�C�", "thermometer-low", TempRange), salinity (Double, "PSU"), pressure (Double, "dbar", "speedometer"), ph (Double, "pH", "ph"), oxygen (Double, "mg/l", "gas-cylinder"), transmittance (Double, "m"), irradiance (Double, "W/m2"), uv_flourescence (Double, "mg/m3"), density (Double, "kg/m3") and conductivity (Double, "S/m"). It also has one spatial dimension called Estuary, which includes the Estuary dimension. It also has one categorical dimension called Depth with a range called DepthRange. [/INST]\nCREATE SENSOR StationObservation (\n\tinterval: 300,\n\tdatasource: elasticsearch,\n\tgeometry: Point\n) WITH PROPERTIES (\n\tmaxDepth Float,\n\tcode String,\n\tname String,\n\tdescripcion String,\n\tstartTime DateTime,\n\tendTime DateTime\n) WITH MEASUREMENT DATA (\n\ttemperature_ITS90 Double UNITS "�C" ICON "thermometer-low" RANGE TempRange,\n\tsalinity Double UNITS "PSU",\n\tpressure Double UNITS "dbar" ICON "speedometer",\n\tph Double UNITS "pH" ICON "ph",\n\toxygen Double UNITS "mg/l" ICON "gas-cylinder",\n\ttransmittance Double UNITS "m",\n\tirradiance Double UNITS "W/m2",\n\tuv_flourescence Double UNITS "mg/m3",\n\tdensity Double UNITS "kg/m3",\n\tconductivity Double UNITS "S/m"\n) WITH SPATIAL DIMENSIONS Estuary (\n\tEstuary\n) WITH CATEGORICAL DIMENSIONS (\n\tDepth RANGE DepthRange\n); </s>\nCould you acknowledge that you understand what I want you to do in my following prompts?\nJust say "yes" or "no". I do not want you to do any additional work by now.',
                },
                { role: "assistant", content: "Yes." },
            ];
            let messagesHistory = initialContext;

            // Format user input and add to the conversation
            const userInput = { role: "user", content: req.body.message };
            messagesHistory.push(userInput);

            // Connect with OpenAI API
            let modelResponse = "";
            const doPetition = async () => {
                const stream = await openai.chat.completions.create({
                    messages: messagesHistory,
                    model: modelType,
                    temperature: temperature,
                    seed: seed,
                });

                // Get model output and consumed tokens
                modelResponse = stream.choices[0].message.content;
                nTokens = stream.usage.total_tokens;

                // Format model output and add to the conversation
                const modelOutput = { role: "assistant", content: modelResponse };
                messagesHistory.push(modelOutput);

                res.send(
                    JSON.stringify({
                        messagesHistory: messagesHistory,
                        nTokens: nTokens,
                    })
                );
            };
            doPetition();
        } catch (error) {
            console.error(error);
            res.status(500).send("Error sending data to OpenAI API");
        }
    }

}




