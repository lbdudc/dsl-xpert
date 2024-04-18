// Import Mongoose model
import ModelSchema from '../schemas/Model.js';
import OpenAI from "openai";

const OPENAI_KEY = process.env.OPENAI_API_KEY;

export default class ModelController {

    static async create(req, res) {
        const { name, definition, description, developer, modelType, temperature, seed } = req.body;

        try {
            const model = new ModelSchema({ name, definition, description, developer, modelType, temperature, seed });
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
        const { name, definition, description, developer, modelType, temperature, seed } = req.body;

        try {
            const model = await ModelSchema.findByIdAndUpdate(
                {
                    _id: id
                },
                {
                    name,
                    definition,
                    description,
                    developer,
                    modelType,
                    temperature,
                    seed
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

    static async createChat(req, res) {
        try {
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
        
              // SensorGrammar
              {
                role: "user",
                content:
                  'I need you to use this grammar for a set of instructions that I will be giving you:\n\nroot ::= parse\nparse ::= sentence+\nsentence ::= createStatement\ncreateStatement ::= "CREATE " (createProduct | createRange | createDimension | createSensor)\ncreateProduct ::= "PRODUCT " identifier " USING " srid ";\\n\\n"\ncreateRange ::= "RANGE " identifier " (\\n" rangeProperty (",\\n" rangeProperty)* "\\n)" ";\\n\\n"\nrangeProperty ::= rangeNumber (" TO " rangeNumber)? " AS " text (" COLOR " hexColor)? | " DEFAULT " "AS " text (" COLOR " hexColor)?\nrangeNumber ::= identifier | floatNumber | intNumber | "INFINITY" | "-INFINITY"\ncreateDimension ::= createSpatialDimension | createCategoricalDimension\ncreateSpatialDimension ::= "SPATIAL DIMENSION " identifier " (\\n" "\\tgeometry" ":" (type | " Geometry") "\\n)" createDimensionProperties createParentDimension? ";\\n\\n"\ncreateCategoricalDimension ::= "CATEGORICAL DIMENSION " identifier " (\\n" "FIELD" ":" identifier ")" ";\\n\\n"\ncreateParentDimension ::= " WITH PARENT " "(\\n" identifier (",\\n" identifier)* "\\n)"\ncreateDimensionProperties ::= " WITH PROPERTIES " "(\\n" dimPropertyDefinition (",\\n" dimPropertyDefinition)* "\\n)"\ndimPropertyDefinition ::= "\\t" identifier type\ncreateSensor ::= "SENSOR " identifier " (\\n" "\\tinterval" ": " intNumber ",\\n" "\\tdatasource" ": " dataSource ",\\n" "\\tgeometry" ":" type "\\n)" createSensorProperties createSensorMeasurementData (addSpatialDimensionToSensor)* (addCategoricalDimensionToSensor)? (addBBXToSensor)? ";\\n\\n"\ncreateSensorProperties ::= " WITH PROPERTIES " "(\\n" sensorPropertyDefinition (",\\n" sensorPropertyDefinition)* "\\n)"\nsensorPropertyDefinition ::= "\\t" identifier type\ncreateSensorMeasurementData ::= " WITH MEASUREMENT DATA " "(\\n" createMeasurementProperty (",\\n" createMeasurementProperty)* "\\n)"\ncreateMeasurementProperty ::= "\\t" identifier type (" UNITS " text)? (" ICON " text)? (" RANGE " identifier)?\naddSpatialDimensionToSensor ::= " WITH SPATIAL DIMENSIONS " identifier "(\\n" "\\t" identifier (",\\n" "\\t" identifier)* "\\n)"\naddCategoricalDimensionToSensor ::= " WITH CATEGORICAL DIMENSIONS " "(\\n" "\\t" identifier (" RANGE " identifier)? (",\\n" "\\t" identifier (" RANGE " identifier)?)* "\\n)"\naddBBXToSensor ::= " WITH BBOX " "(" ("[")? coordinate ("]")? ", " intNumber")"\nsrid ::= intNumber\nidentifier ::= text\ntext ::= [a-zA-Z] [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]?\nquotedText ::= "\\"" text "\\""\nws ::= ([ \\t\\n] ws)?\ntype ::= " Long" | " Boolean" | " Float" | " Integer" | " Double" | " Localdate" | " String" | " Datetime" | " Linestring" | " Multilinestring" | " Polygon" | " Multipolygon" | " Point" | " Multipoint"\ndataSource ::= "postgres" | "elasticsearch"\nhexColor ::= "#" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]\ndigit ::= [0-9]\ndigits ::= digit+\nintNumber ::= digits\nfloatNumber ::= (digits? ".")? digits\nnegativeFloat ::= ("-")? floatNumber\ncoordinate ::= negativeFloat ", " negativeFloat\n\nCould you acknowledge that you understand what I want you to do in my following prompts?\nJust say "yes" or "no". I do not want you to do any additional work by now.',
              },
              { role: "assistant", content: "Yes." },
              {
                role: "user",
                content:
                  'In addition to prior grammar, these are some examples of what I expect you to do, separated by <s> and [INST] to highlight the instruction:\n<s>[INST] Create a product called intecmar with an srid of 4326. [/INST]\nCREATE PRODUCT intecmar USING 4326; </s>\n\n<s>[INST] Create a spatial dimension called Municipality with a Geometry geometry and a property called cMun, which is an Integer. [/INST]\nCREATE SPATIAL DIMENSION Municipality (\n\tgeometry: Geometry\n) WITH PROPERTIES (\n\tcMun Integer\n); </s>\n\n<s>[INST] Create a categorical dimension called Depth with a field called depth. [/INST]\nCREATE CATEGORICAL DIMENSION Depth (\n\tfield: depth\n); </s>\n\n<s>[INST] Create a range called MagnitudRange with the following definitions: 0-3 for surface, 4.75-5.25 for 5m, 9.75-10.25 for 10m, 14.75-15.25 for 15m and 19.75-20.25 for 20m. [/INST]\nCREATE RANGE MagnitudRange (\n\t0 TO 3 AS "surface",\n\t4.75 TO 5.25 AS "5m",\n\t9.75 TO 10.25 AS "10m",\n\t14.75 TO 15.25 AS "15m",\n\t19.75 TO 20.25 AS "20m"\n); </s>\n\n<s>[INST] Create a sensor called StationObservation with a 300 interval, an elasticsearch datasource and a Point geometry. It also has several different properties called as follows, with their datatype between parenthesis: maxDepth (Float), code (String), name (String), descripcion (String), startTime (DateTime) and endTime (DateTime). It also has the following measurement data names, along with their datatypes, units, icon and range between parenthesis (note that many of them may lack the range and the icon information): temperature_ITS90 (Double, "�C�", "thermometer-low", TempRange), salinity (Double, "PSU"), pressure (Double, "dbar", "speedometer"), ph (Double, "pH", "ph"), oxygen (Double, "mg/l", "gas-cylinder"), transmittance (Double, "m"), irradiance (Double, "W/m2"), uv_flourescence (Double, "mg/m3"), density (Double, "kg/m3") and conductivity (Double, "S/m"). It also has one spatial dimension called Estuary, which includes the Estuary dimension. It also has one categorical dimension called Depth with a range called DepthRange. [/INST]\nCREATE SENSOR StationObservation (\n\tinterval: 300,\n\tdatasource: elasticsearch,\n\tgeometry: Point\n) WITH PROPERTIES (\n\tmaxDepth Float,\n\tcode String,\n\tname String,\n\tdescripcion String,\n\tstartTime DateTime,\n\tendTime DateTime\n) WITH MEASUREMENT DATA (\n\ttemperature_ITS90 Double UNITS "�C" ICON "thermometer-low" RANGE TempRange,\n\tsalinity Double UNITS "PSU",\n\tpressure Double UNITS "dbar" ICON "speedometer",\n\tph Double UNITS "pH" ICON "ph",\n\toxygen Double UNITS "mg/l" ICON "gas-cylinder",\n\ttransmittance Double UNITS "m",\n\tirradiance Double UNITS "W/m2",\n\tuv_flourescence Double UNITS "mg/m3",\n\tdensity Double UNITS "kg/m3",\n\tconductivity Double UNITS "S/m"\n) WITH SPATIAL DIMENSIONS Estuary (\n\tEstuary\n) WITH CATEGORICAL DIMENSIONS (\n\tDepth RANGE DepthRange\n); </s>\nCould you acknowledge that you understand what I want you to do in my following prompts?\nJust say "yes" or "no". I do not want you to do any additional work by now.',
              },
              { role: "assistant", content: "Yes." },
        
              // BIDIGrammar
              /*{
                role: "user",
                content:
                'I need you to use this grammar for a set of instructions that I will be giving you:\n\nroot ::= parse\nparse ::= sentence+ \";\"\nsentence ::= alterStatement | attributeToTableStatement | createStatement | dropStatement | generateScript | mapStatement | insertStatement | updateStatement\nalterStatement ::= \"ALTER TABLE \" identifier (addColumn | addConstraint | addForeignKey | dropColumn)\ncreateStatement ::= \"CREATE \" (createProduct | createConnectionTo | createConnectionFrom | createEntity | createSchema)\ndropStatement ::= \"DROP \" (dropConnection | dropSchema | dropTable)\ngenerateScript ::= \"GENERATE SCRIPT \" identifier \";\"\ninsertStatement ::= \"INSERT INTO \" identifier \"(\" identifier (\",\" identifier)* \")\\n\\t\" (valueStatement | selectStatement) \";\"\nvalueStatement ::= \"=\" value (\",\" value)*\nmapStatement ::= \"MAP \" (mapAllStatement | mapSimpleStatement)\nmapAllStatement ::= \"ALL PROPERTIES \" identifier \" TO \" identifier \" (\" (columnMapping (\",\" (columnMapping | saveRelation))* \"\\n\\t\" ((foreignKeyRelation (\",\" foreignKeyRelation)*)? \"\\n\\t\" (getStatement)?)?)? \";\"\nmapSimpleStatement ::= identifier (\",\" identifier)* \" TO \" identifier \" (\" columnMapping (\",\" (columnMapping | saveRelation))* \"\\n\\t\" (\"WHERE (\" identifier \"=\" identifier (\" AND \" identifier \"=\" identifier)*)? \"\\n\\t\" ((foreignKeyRelation (\",\" foreignKeyRelation)*)? \"\\n\\t\" (getStatement)?)?) \";\"\ncolumnMapping ::= (identifier | \"NULL\" | sqlStatement) (type)? \" TO \" identifier (foreignKeyStatement)?\nsqlStatement ::= \"SQL: \" quotedText\nsaveRelation ::= \"SAVE RELATION \" identifier \".\" identifier \" AS \" identifier type (\" = \" identifier \".\" identifier \" type\")?\nkeepingStatement ::= \"KEEPING (\" identifier \".\" identifier type \" = \" identifier \".\" identifier type \")\"\nforeignKeyStatement ::= \"FOREIGN KEY \" identifier \" (\" identifier \")\"\nforeignKeyRelation ::= \"FOREIGN KEY \" identifier \".\" identifier \" REFERENCES \" identifier \".\" identifier\ngetStatement ::= \"GET \" identifier \" FROM \" identifier \".\" identifier \" WHEN \" identifier \"=\" identifier\nattributeToTableStatement ::= \"ATTRIBUTE \" identifier \" (\" identifier \") TO TABLE \" identifier \" (\" columnMapping (\",\" (columnMapping | saveRelation))* \") \" foreignKeyRelation \";\"\nupdateStatement ::= \"UPDATE \" identifier (setStatement | foreignKeyUpdate) \";\"\nsetStatement ::= \"SET \" column \" = (\" identifier (\",\" identifier)* \"\\n\\tFROM \" identifier (\".\" identifier \"=\" identifier \".\" identifier \".IDENTIFIER\")? \"\\n\\t\" (\"WHERE \" identifier \"=\" identifier \".\" identifier)? \")\"\nforeignKeyUpdate ::= \"FOREIGN KEY \" identifier \" REFERENCES \" identifier \" (\" identifier \")\"\naddColumn ::= \"ADD \" property \";\"\naddConstraint ::= \"ADD CONSTRAINT \" identifier\naddForeignKey ::= \"ADD FOREIGN KEY (\" identifier \") REFERENCES \" identifier \";\"\ncreateProduct ::= \"PRODUCT \" identifier \";\"\ncreateConnectionTo ::= \"CONNECTION TO \" connectionData \";\"\ncreateConnectionFrom ::= \"CONNECTION FROM \" connectionData \";\"\nconnectionData ::= \"(DBNAME \" identifier \", HOST \" identifier \", PORT \" intNumber \", USER \" identifier \", PASSWORD \" identifier \", SCHEMA \" identifier \")\"\ncreateEntity ::= \"ENTITY \" identifier \" (\" property (\",\" property)* \");\"\ncreateSchema ::= \"SCHEMA \" identifier (\" AUTHORIZATION \" identifier)? \";\"\ndropColumn ::= \"DROP \" identifier \";\"\ndropConnection ::= \"CONNECTION;\"\ndropSchema ::= \"SCHEMA \" identifier \";\"\ndropTable ::= \"TABLE \" identifier \";\"\nselectStatement ::= \"SELECT \" identifier (\",\" identifier)* \"\\n\\tFROM \" identifier (\".\" identifier \"=\" identifier \".\" identifier)? \"\\n\\t\" (\"WHERE \" identifier \"=\" identifier \".\" identifier)?\ncolumn ::= identifier\nvalue ::= identifier\nproperty ::= propertyDefinition | relationshipDefinition\npropertyDefinition ::= identifier type (\" IDENTIFIER\" | \" DISPLAYSTRING\" | \" REQUIRED\" | \" UNIQUE\" | \" NOT NULL\")*\nrelationshipDefinition ::= ownedRelationshipDefinition | mappedRelationshipDefinition\nmappedRelationshipDefinition ::= identifier \" \" identifier \" RELATIONSHIP MAPPEDBY \" identifier\nownedRelationshipDefinition ::= identifier \" \" identifier \" RELATIONSHIP (\" cardinality \",\" cardinality \") \" (\"BIDIRECTIONAL\")?\ncardinality ::= \"0..1\" | \"1..1\" | \"0..*\" | \"1..*\"\nsrid ::= intNumber\nidentifier ::= text\ntext ::= [a-zA-Z] [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]?\nhost_identifier ::= idNode (\".\" idNode)*?\nidNode ::= [a-zA-Z_][a-zA-Z0-9]*\npassword ::= stringLiteral stringLiteral*?\nstringLiteral ::= \"a\"..\"z\" | \"A\"..\"Z\" | \"0\"..\"9\" | \":\" | \".\" | \"&\" | \"/\" | \"\\\\\" | \";\" | \"+\" | \"$\" | \"%\" | \"@\" | \"|\" | \"¿\" | \"?\"\nquotedText ::= \"\\\"\" text \"\\\"\"\ntype ::= \" Bigint\" | \" Binary (\" intNumber \")\" | \" Boolean\" | \" Char (\" intNumber \")\" | \" Character (\" intNumber \")\" | \" Charactervarying (\" intNumber \")\" | \" Date\" | \" Datetime\" | \" Decimal\" | \" Double\" | \" Float\" | \" Int\" | \" Integer\" | \" Localdate\" | \" Long\" | \" Point\" | \" Polygon\" | \" String\" | \" Text (\" intNumber \")\" | \" Time\" | \" Timestamp\" | \" Varchar (\" intNumber \")\" | \" Year\"\nhexColor ::= \"#\" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]\ndigit ::= [0-9]\ndigits ::= digit+\nintNumber ::= digits\nfloatNumber ::= (digits? \".\")? digits\n\nCould you acknowledge that you understand what I want you to do in my following prompts?\nJust say "yes" or "no". I do not want you to do any additional work by now.',
              },
              { role: "assistant", content: "Yes." },
              {
                role: "user",
                content:
                'In addition to prior grammar, these are some examples of what I expect you to do, separated by <s> and [INST] to highlight the instruction:\n<s>[INST] Create a connection to (\"dsl_models\", \"chronos\", 5432, \"dramos\", \"target\") [/INST]\nCREATE CONNECTION TO (dbname dsl_models, host chronos, port 5432, user dramos, pwd dramos, schema target); </s>\n\n<s>[INST] Map obra to work, with the following properties: data_envio to creation_date, false to draft, observacions to observations, true to revised, titulo to tile, topo to type. Also, save the relation obra.id_obra as id_obra (character 25) which equals work.id (bigint). [/INST]\nMAP obra TO work (\n\tdata_envio TO creation_date, \n\tfalse TO draft, \n\tobservacions TO observations, \n\ttrue TO revised, \n\ttitulo TO title, \n\ttipo TO type,  \n\tSAVE RELATION obra.id_obra AS id_obra character(25) EQUALS work.id bigint\n); </s>\n\n<s>[INST] Attribute autor(foto) to \"files\" table, with the following properties: foto to file_download_uri, foto to file_name and foto to file_type. Also, save a relation \"id\" as \"autor_id\" (character 25). [/INST]\nATTRIBUTE autor(foto) TO TABLE files (\n\tfoto TO file_download_uri,\n\tfoto TO file_name,\n\tfoto TO file_type,\n\tSAVE RELATION id AS autor_id character(25)\n); </s>\n\n<s>[INST] Update \"authority\" and \"files_id\" with the following changes: id from files.autor_id equals aux.authority.autor_id where authority_id = authority.id.[/INST]\nUPDATE authority SET files_id = ( \n\tid FROM files.autor_id = aux.authority.autor_id \n\tWHERE authority_id = authority.id); </s>\n\n<s>[INST] Decompose \"autor\" using \"authority\" and \"contact\". For authority: nome_real to name, sexo to gender, dia_nac to birthdate, ano_mor to deathdate, seculo to century, narrativa to genre, localidade to region. Also, save a relation autor.id as autor_id (character 25) which equals authority.id (bigint). Then, for contact: localidade to city, email to email, mobil to phone, cp to postal_code, provincia to province, rua to street, inter_web to web. Also, save a relation \"autor.id\" as \"autor_id\" (character 25) which equals contact.id (bigint). Finally, add a foreign key authority.contact which references contact.id. [/INST]\nDECOMPOSE autor USING authority, contact (\n\tTABLE authority:\n\t\tnome_real TO name,\n\t\tsexo TO gender,\n\t\tdia_nac TO birthdate,\n\t\tano_mor TO deathdate,\n\t\tseculo TO century,\n\t\tnarrativa TO genre,\n\t\tlocalidade TO region,\n\t\tSAVE RELATION autor.id AS autor_id character(25) EQUALS authority.id bigint\n\tTABLE contact:\n\t\tlocalidade TO city,\n\t\temail TO email,\n\t\tmobil TO phone,\n\t\tcp TO postal_code, \n\t\tprovincia TO province,\n\t\trua TO street,\n\t\tinter_web TO web,\n\t\tSAVE RELATION autor.id AS autor_id character(25) EQUALS contact.id bigint\n) FOREIGN KEY authority.contact REFERENCES contact.id; </s>\nCould you acknowledge that you understand what I want you to do in my following prompts?\nJust say "yes" or "no". I do not want you to do any additional work by now.',
              },
              { role: "assistant", content: "Yes." },*/
        
              // GISGrammar
              /*{
                role: "user",
                content:
                'I need you to use this grammar for a set of instructions that I will be giving you:\n\nroot ::= parse\nparse ::= sentence+\nsentence ::= createStatement | useGIS | generateGIS | setDeployment\ncreateStatement ::= \"CREATE \" (createGIS | createEntity | createLayer)\ncreateGIS ::= \"GIS \" identifier \" USING \" srid \";\"\ncreateEntity ::= \"ENTITY \" identifier \"(\\n\\t\" property (\", \" property)* \"\\n);\"\ncreateLayer ::= createTileLayer | createGeoJSONLayer | createWmsStyle | createWmsLayer | createMap | createSortableMap\ncreateTileLayer ::= \"TILE LAYER \" identifier (\" AS \" text)? \"(\\n\\tURL \" text \"\\n);\"\ncreateGeoJSONLayer  ::= \"GEOJSON LAYER \" identifier (\" AS \" text)? \"(\\n\\t\" identifier (\" EDITABLE\")? \",\\n\\tFILLCOLOR \" hexColor \",\\n\\tSTROKECOLOR \" hexColor \",\\n\\tFILLOPACITY \" floatNumber \",\\n\\tSTROKEOPACITY \" floatNumber \"\\n);\"\ncreateWmsStyle ::= \"WMS STYLE \" identifier \"(\\n\\tSTYLELAYERDESCRIPTOR \" text \"\\n);\"\ncreateWmsLayer ::= \"WMS LAYER \" identifier (\" AS \" text)? \"(\\n\\t\" wmsSublayer (\", \" wmsSubLayer)* \"\\n);\"\nwmsSubLayer ::= identifier identifier\ncreateSortableMap ::= \"SORTABLE \" createMap\ncreateMap ::= \"MAP \" identifier (\" AS \" text)? \"(\\n\\t\" mapLayer (\", \" mapLayer)* \"\\n);\"\nmapLayer ::= identifier (\" IS_BASE_LAYER\")? (\" HIDDEN)?\nuseGIS ::= \"USE GIS \" identifier \";\"\ngenerateGIS ::= \"GENERATE GIS \" identifier \";\"\nsetDeployment ::= \"SET DEPLOYMENT (\\n\\t\" deploymentProperty (\", \" deploymentProperty)* \"\\n);\"\ndeploymentProperty ::= text text\nproperty ::= propertyDefinition | relationshipDefinition\npropertyDefinition ::= identifier type (\" IDENTIFIER\" | \" DISPLAY_STRING\" | \" REQUIRED\" | \" UNIQUE\")*\nrelationshipDefinition ::= ownedRelationshipDefinition | mappedRelationshipDefinition\nmappedRelationshipDefinition ::= identifier identifier \" RELATIONSHIP MAPPED_BY \" identifier\nownedRelationshipDefinition ::= identifier identifier \"RELATIONSHIP (\" cardinality \", \" cardinality \") BIDIRECTIONAL\"?\ncardinality ::= \"0..1\" | \"1..1\" | \"0..*\" | \"1..*\"\nsrid ::= intNumber\nintNumber ::= digits\nidentifier ::= text\ntext ::= [a-zA-Z] [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]? [a-zA-Z]?\nhexColor ::= \"#\" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]\ntype ::= \" Long\" | \" Boolean\" | \" Integer\" | \" Double\" | \" Localdate\" | \" String\" | \" Linestring\" | \" Multilinestring\" | \" Polygon\" | \" Multipolygon\" | \" Point\" | \" Multipoint\"\ndigit ::= [0-9]\ndigits ::= digit+\nintNumber ::= digits\nfloatNumber ::= (digits? \".\")? digits\n\nCould you acknowledge that you understand what I want you to do in my following prompts?\nJust say "yes" or "no". I do not want you to do any additional work by now.',
              },
              { role: "assistant", content: "Yes." },
              {
                role: "user",
                content:
                'In addition to prior grammar, these are some examples of what I expect you to do, separated by <s> and [INST] to highlight the instruction:\n<s>[INST] Create a GIS called \"complete_example\" with an srid of 4326. [/INST]\nCREATE GIS complete_example USING 4326; </s>\n<s>[INST] Create an entity called \"Storage\" with the following properties: id (Long IDENTIFIER), name (String DISPLAY_STRING), capacity (Double), material (String), state (String), owner (String), manager (String) and location (Point). It also add an entity called \"municipality\" (Municipality) with a relationship (0..*, 1..1). [/INST]\nCREATE ENTITY Storage (\n\tid Long IDENTIFIER,\n\tname String DISPLAY_STRING,\n\tcapacity Double,\n\tmaterial String,\n\tstate String,\n\towner String,\n\tmanager String,\n\tlocation Point,\n\tmunicipality Municipality RELATIONSHIP(0..*, 1..1)\n); </s>\n<s>[INST] Create a wms style called \"roadLayerStyle\" with a descriptor including \"/home/acoritnas/sld/road-sld.xml\". [/INST]\nCREATE WMS STYLE roadLayerStyle (\n\tstyleLayerDescriptor \"/home/acortinas/sld/road-sld.xml\"\n); </s>\n<s>[INST] Create a geojson layer called \"purificationLayer\", but referred as \"Purification\", with the following properties: Purification (EDITABLE), fillColor (#243452), strokeColor (#eeeeee3), fillOpacity (0.8) and strokeOpacity (0.9). [/INST]\nCREATE GEOJSON LAYER purificationLayer AS \"Purification\" (\n\tPurification EDITABLE,\n\tfillColor #243452,\n\tstrokeColor #eeeee3,\n\tfillOpacity 0.8,\n\tstrokeOpacity 0.9\n); </s>\n<s>[INST] Create a map called \"demography\", but referred as \"Demography\", with the following properties: base (IS_BASE_LAYER), municipalityLayer, buildingLayer (HIDDEN), roadBackgroundLayer and demographyLayer. [/INST]\nCREATE MAP demography AS \"Demography\" (\n\tbase IS_BASE_LAYER,\n\tmunicipalityLayer,\n\tbuildingLayer HIDDEN,\n\troadBackgroundLayer,\n\tdemographyLayer\n); </s>\nCould you acknowledge that you understand what I want you to do in my following prompts?\nJust say "yes" or "no". I do not want you to do any additional work by now.',
              },
              { role: "assistant", content: "Yes." },*/
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
                model: "gpt-3.5-turbo",
                temperature: 0.2,
                seed: 6,
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




