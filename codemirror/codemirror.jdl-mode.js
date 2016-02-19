CodeMirror.defineMode('jdl', function() {
  return {
    startState: function() { return { inSymbol: false } },
    token: function(stream, state) {
      if (stream.sol()){
        stream.eatSpace()
        if (stream.peek() === '#'){
          stream.skipToEnd()
          return 'meta'
        }
        if (stream.match('//') || stream.peek() === '/' || stream.peek() === '*'){
          stream.skipToEnd()
          return 'comment'
        }
        if (stream.match(/^(entity|enum|relationship|paginate|dto|service)/g)){
            stream.skipTo(' ')
            return 'keyword'
        }

      }

      var delimiters = '{}|'.split('')
      var operator = '>+-:;'.split('')
      var all = [].concat(delimiters, operator)
      var ch;
      if (stream.match(/(\s*)([A-Z])/g)){
          while ((ch = stream.next()) != null)
			  if (ch == " " && stream.peek() == "{"){
				return "def";
			  }
      }

      if (delimiters.some(function (c){ return stream.eat(c) }))
        return 'bracket'
      if (operator.some(function (c){ return stream.eat(c) }))
        return 'operator'
      stream.eatWhile(function (c){ return all.indexOf(c) === -1 })
      return null;
    }
  };
});
var keywords = ['entity', 'enum', 'relationship',
    'OneToOne', 'OneToMany', 'ManyToOne', 'ManyToMany',
    'required', 'minlength', 'maxlength', 'pattern',
    'with', 'all', 'except', 'to',
    'paginate', 'pagination', 'pager', 'infinite-scroll',
    'dto', 'mapstruct',
    'service', 'serviceClass', 'serviceImpl',
    'String', 'Integer', 'Long', 'BigDecimal', 'Float', 'Double', 'Boolean', 'LocalDate', 'ZonedDateTime', 'Blob', 'AnyBlob', 'ImageBlob'];
CodeMirror.commands.autocomplete = function(cm) {
    cm.showHint({hint: CodeMirror.hint.anyword, list: keywords});
}
