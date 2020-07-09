var nomnoml = nomnoml || {};
var JDLParser = module.exports;

nomnoml.parse = function (source){
	function onlyCompilables(line){
		var ok = line[0] !== '#'
		return ok ? line.replace(/\/\/[^\n\r]*/mg, '') : ''
	}
	var isDirective = function (line){ return line.text[0] === '#' }
	var lines = source.split('\n').map(function (s, i){
		return {text: s.trim(), index: i }
	})
	var pureDirectives = _.filter(lines, isDirective)
	var directives = _.zipObject(pureDirectives.map(function (line){
		try {
			var tokens =  line.text.substring(1).split(':')
			return [tokens[0].trim(), tokens[1].trim()]
		}
		catch (e) {
			throw new Error('line ' + (line.index + 1))
		}
	}))
	var pureDiagramCode = _.map(_.map(lines, 'text'), onlyCompilables).join('\n').trim()
	var ast = nomnoml.transformParseIntoSyntaxTree(nomnoml.intermediateParse(pureDiagramCode))
	ast.directives = directives
	return ast
}

nomnoml.intermediateParse = function (source){
	return nomnoml.convertToNomnoml(jdlCore.parse(source));
}

nomnoml.convertToNomnoml = function(JDLObj){
	var parts = [], enumParts = []
	var required = function (line){ return line.key === 'required' }
	var isRequired = function (validations) {
		return _.filter(validations, required).length > 0
	}
	var setEnumRelation = function (a, part) {
		var enumPart = _.filter(enumParts, function (e){
			return e.id === a.type
		});
		if(enumPart.length > 0){
			parts.push({
				assoc: '->',
				start: part,
				end: enumPart[0],
				startLabel: '',
				endLabel: ''
			})
		}
	}
	var getCardinality = function (cardinality) {
		switch (cardinality) {
			case 'one-to-many':
      case 'OneToMany':
				return '1-*'
      case 'OneToOne':
			case 'one-to-one':
				return '1-1'
      case 'ManyToOne':
			case 'many-to-one':
				return '*-1'
      case 'ManyToMany':
			case 'many-to-many':
				return '*-*'
			default:
				return '1-*'
		}
	}
	var setParts = function (entity, isEnum) {
		var attrs = []
		if(isEnum){
			_.each(entity.values, function (a) {
				attrs.push(a)
			})
		} else {
			_.each(entity.body, function (a) {
				attrs.push(a.name + ': ' + a.type + (isRequired(a.validations) ? '*' : ''))
			})
		}
		return {
			type: isEnum ? 'ENUM' : 'CLASS',
			id: entity.name,
			parts:[
				[entity.name],
				attrs
			]
		}
	}
	_.each(JDLObj.enums, function (p){
		if (p.name){ // is an enum
			var part = setParts(p, true)
			parts.push(part)
			enumParts.push(part)
		}
	})

	_.each(JDLObj.entities, function (p){
		if (p.name){ // is a classifier
			var part = setParts(p)
			parts.push(part)
			_.each(p.body, function (a) {
				setEnumRelation(a, part)
			})
		}
	})

	_.each(JDLObj.relationships, function (p){
		parts.push({
			assoc: '->',
			start: setParts(p.from),
			end: setParts(p.to),
			startLabel: p.from.injectedfield ? p.from.injectedfield : '',
			endLabel: (getCardinality(p.cardinality) + ' ' + (p.to.injectedfield ? p.to.injectedfield : ''))
		})
	})

	return parts;
}


nomnoml.transformParseIntoSyntaxTree = function (entity){

	var relationId = 0

	function transformCompartment(parts){
		var lines = []
		var rawClassifiers = []
		var relations = []
		_.each(parts, function (p){
			if (typeof p === 'string')
				lines.push(p)
			if (p.assoc){ // is a relation
				rawClassifiers.push(p.start)
				rawClassifiers.push(p.end)
				relations.push({
                    id: relationId++,
                    assoc: p.assoc,
                    start: p.start.parts[0][0],
                    end: p.end.parts[0][0],
                    startLabel: p.startLabel,
                    endLabel: p.endLabel
                })
            }
			if (p.parts){ // is a classifier
				rawClassifiers.push(p)
            }
		})
		var allClassifiers = _.map(rawClassifiers, transformItem)
		var noDuplicates = _.map(_.groupBy(allClassifiers, 'name'), function (cList){
			return _.max(cList, function (c){ return c.compartments.length })
		})

		return nomnoml.Compartment(lines, noDuplicates, relations)
	}

	function transformItem(entity){
		if (typeof entity === 'string')
			return entity
		if (_.isArray(entity))
			return transformCompartment(entity)
		if (entity.parts){
			var compartments = _.map(entity.parts, transformCompartment)
			return nomnoml.Classifier(entity.type, entity.id, compartments)
		}
		return undefined
	}

	return transformItem(entity)
}
