(function () {

    var mainKeywords = ['entity', 'enum', 'relationship', 'paginate', 'dto', 'service'],
    relationshipKws = ['OneToOne', 'OneToMany', 'ManyToOne', 'ManyToMany'],
    validationKws = ['required', 'minlength', 'maxlength', 'pattern'],
    generalKws = ['with', 'all', 'except', 'to'],
    paginationKws = ['pagination', 'pager', 'infinite-scroll'],
    dtoKws = ['mapstruct'],
    serviceKws = ['serviceClass', 'serviceImpl'],
    typeKws = ['String', 'Integer', 'Long', 'BigDecimal', 'Float', 'Double', 'Boolean', 'LocalDate', 'ZonedDateTime', 'Blob', 'AnyBlob', 'ImageBlob'];

    CodeMirror.defineMode('jdl', function() {
        var words = {};
        function define(style, list) {
            for(var i = 0; i < list.length; i++) {
                words[list[i]] = style;
            }
        };

        // relationships
        define('relationship', relationshipKws);

        // Keywords
        define('keyword', mainKeywords);

        // types
        define('attribute', typeKws);

        // types
        define('qualifier', validationKws);

        // types
        define('special', generalKws.concat(paginationKws, serviceKws, dtoKws));

        function tokenBase(stream, state) {
            /*if (!stream.sol() && stream.match(/(\s*)([A-Z])/g)){
                return tokenEntity(stream)
            }*/
            if (stream.eatSpace()) return null;

            var sol = stream.sol();
            var ch = stream.next();
            var delimiters = '{ } |'.split(' ')

            if (ch === '\\') {
                stream.next();
                return null;
            }

            if (sol && ch === '#') {
                stream.skipToEnd();
                return 'meta'; // 'directives'
            }

            if (stream.match('//') || ch === '/' || ch === '*'){
                stream.skipToEnd()
                return 'comment'
            }

            if (ch === '+' || ch === '=') {
                return 'operator';
            }
            if (ch === '-') {
                stream.eat('-');
                stream.eatWhile(/\w/);
                return 'attribute';
            }
            if (delimiters.some(function (c){ return stream.eat(c) }))
                return 'bracket'

            stream.eatWhile(/[\w-]/);
            var cur = stream.current();
            if (stream.peek() === '=' && /\w+/.test(cur)) return 'def';
            if(words.hasOwnProperty(cur)) return words[cur];

            if (/[A-Z]/.test(ch)) {
                stream.eatWhile(/[a-z_]/);
                if(stream.eol() || !/\s[\{\,]/.test(stream.peek())) {
                    return 'def';
                }
            }

            return null
        }

        function tokenEntity(stream) {
            var ch;
            while ((ch = stream.next()) != null)
                if (ch == " " && stream.peek() == "{"){
                    return "def";
                }

        }

        function tokenize(stream, state) {
            return (state.tokens[0] || tokenBase) (stream, state);
        };

        return {
            startState: function() {return {tokens:[]};},
            token: function(stream, state) {
                return tokenize(stream, state);
            },
            lineComment: '//',
            fold: "brace"
        };

    });
    var keywords = mainKeywords.concat(typeKws, relationshipKws, validationKws, generalKws, paginationKws, dtoKws, serviceKws);
    CodeMirror.commands.autocomplete = function(cm) {
        cm.showHint({hint: CodeMirror.hint.anyword, list: keywords});
    }
})();
