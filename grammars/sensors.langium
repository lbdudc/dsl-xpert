grammar SensorGrammar

entry Parse:
    sentences+=Sentence+
;

Sentence:
    CreateStatement | SetDeployment
;

CreateStatement:
    'CREATE' (
        CreateProduct |
        CreateSensorGroup |
        CreateRange |
        CreateDimension |
        CreateSensor
    )
;

CreateProduct:
    'PRODUCT' name=ID 'USING' srid=INT ';'
;

CreateSensorGroup:
    'SENSORGROUP' name=ID '(' sensors+=ID (',' sensors+=ID)* ')' ';'
;

CreateRange:
    'RANGE' name=ID '(' properties+=RangeProperty (',' properties+=RangeProperty)* ')' ';'
;

RangeProperty:
    (
        from=FLOAT_NUMBER ('TO' to=FLOAT_NUMBER)? 'AS' label=QuotedText ('COLOR' color=HexColor)?
    ) |
    (
        'DEFAULT' 'AS' label=QuotedText ('COLOR' color=HexColor)?
    )
;



CreateDimension:
    CreateSpatialDimension | CreateCategoricalDimension
;

CreateSpatialDimension:
    'SPATIAL' 'DIMENSION' name=ID '(' 'GEOMETRY' ':' type=TypeEnum ')' 
    DimensionProperties ParentDimension? ';'
;

CreateCategoricalDimension:
    'CATEGORICAL' 'DIMENSION' name=ID '(' 'FIELD' ':' field=ID ')' ';'
;

ParentDimension:
    'WITH' 'PARENT' '(' parents+=ID (',' parents+=ID)* ')'
;

DimensionProperties:
    'WITH' 'PROPERTIES' '(' properties+=DimPropertyDefinition (',' properties+=DimPropertyDefinition)* ')'
;

DimPropertyDefinition:
    name=ID type=TypeEnum ( 'DISPLAY_STRING' )*
;


CreateSensor:
    ('MOVING')? 'SENSOR' name=ID '(' 
        'INTERVAL' ':' interval=INT ',' 
        'GEOMETRY' ':' geometryType=TypeEnum
    ')' 
    SensorProperties 
    SensorMeasurementData 
    spatialGroups+=AddSpatialDimensionToSensor* 
    categoricalGroups+=AddCategoricalDimensionToSensor* 
    boundingBox=AddBBXToSensor?
    ';'
;

SensorProperties:
    'WITH' 'PROPERTIES' '(' properties+=SensorPropertyDefinition (',' properties+=SensorPropertyDefinition)* ')'
;

SensorPropertyDefinition:
    name=ID type=TypeEnum ( 'DISPLAY_STRING' | 'REQUIRED' | 'UNIQUE' )*
;

SensorMeasurementData:
    'WITH' 'MEASUREMENT' 'DATA' '(' measurements+=MeasurementProperty (',' measurements+=MeasurementProperty)* ')'
;

MeasurementProperty:
    name=ID type=TypeEnum ( 'UNITS' units=QuotedText )? ( 'ICON' icon=QuotedText )? ( 'RANGE' range=ID )?
;

AddSpatialDimensionToSensor:
    'WITH' 'SPATIAL' 'GROUP' name=ID '(' dims+=ID (',' dims+=ID)* ')'
;

AddCategoricalDimensionToSensor:
    'WITH' 'CATEGORICAL' 'GROUP' (name=ID)? '('
        dims+=CategoricalDim (',' dims+=CategoricalDim)*
    ')'
;

CategoricalDim:
    name=ID ('RANGE' range=ID)?
;

AddBBXToSensor:
    'WITH' 'BBOX' '('
        ('[')? x=FLOAT_NUMBER ',' y=FLOAT_NUMBER (']')? ',' zoom=INT
    ')'
;

SetDeployment:
    'SET' 'DEPLOYMENT' '(' properties+=DeploymentProperty (',' properties+=DeploymentProperty)* ')' ';'
;

DeploymentProperty:
    key=QuotedText value=QuotedText
;

// ----- Terminals -----
hidden terminal WS: /\s+/ ;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\// ;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/ ;
terminal QuotedText: /"[^"\r\n]*"/;
terminal HexColor: /#[0-9a-fA-F]{6}/;
terminal INT returns number: /[0-9]+/;
terminal FLOAT_NUMBER returns number: /(\d*\.)?\d+/ ;
terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;

TypeEnum returns string:
    'BOOLEAN'
    | 'FLOAT'
    | 'INTEGER'
    | 'DOUBLE'
    | 'LONG'
    | 'LOCALDATE'
    | 'STRING'
    | 'DATETIME'
    | 'LINESTRING'
    | 'MULTILINESTRING'
    | 'POLYGON'
    | 'MULTIPOLYGON'
    | 'POINT'
    | 'MULTIPOINT'
;