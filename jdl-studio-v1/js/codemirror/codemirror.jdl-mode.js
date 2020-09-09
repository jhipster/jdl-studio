(function () {

    var mainKeywords = ['application', 'deployment', 'entity', 'enum', 'relationship', 'paginate', 'dto', 'service', 'skipClient', 'skipServer', 'search', 'angularSuffix', 'filter'],
    relationshipKws = ['OneToOne', 'OneToMany', 'ManyToOne', 'ManyToMany'],
    appInnerKws = ['config', 'entities'],
    validationKws = ['required', 'minlength', 'maxlength', 'min', 'max', 'minbytes', 'maxbytes', 'pattern', 'unique'],
    generalKws = ['with', 'all', 'except', 'to'],
    paginationKws = ['pagination', 'pager', 'infinite-scroll'],
    dtoKws = ['mapstruct'],
    serviceKws = ['serviceClass', 'serviceImpl'],
    searchKws = ['ElasticSearch'],
    apptypeKws = ['microservice', 'gateway', 'monolith', 'uaa', 'reactive', 'reactive-micro'],
    typeKws = ['String', 'Integer', 'Long', 'BigDecimal', 'Float', 'Double', 'Boolean', 'LocalDate', 'ZonedDateTime', 'Instant', 'Blob', 'AnyBlob', 'ImageBlob'];
    appKeysKws = [
      'baseName', 'applicationType', 'authenticationType', 'buildTool', 'cacheProvider', 'clientFramework', 'clientPackageManager',
      'databaseType', 'devDatabaseType', 'enableHibernateCache', 'enableSwaggerCodegen', 'enableTranslation', 'jhiPrefix',
      'languages', 'messageBroker', 'nativeLanguage', 'packageName', 'prodDatabaseType', 'searchEngine', 'serviceDiscoveryType',
      'skipClient', 'skipServer', 'serverPort', 'skipUserManagement', 'testFrameworks', 'uaaBaseName', 'useSass', 'clientTheme', 'websocket'
    ];
    deploymentKeysKws = [
      'deploymentType', 'gatewayType', 'monitoring', 'directoryPath', 'appsFolders', 'clusteredDbApps', 'consoleOptions',
      'serviceDiscoveryType', 'dockerRepositoryName', 'dockerPushCommand', 'kubernetesNamespace', 'kubernetesServiceType', 'ingressDomain',
      'istio', 'istioRoute', 'enableRancherLoadBalancing', 'openshiftNamespace', 'storageType'
    ];
    specialValueKws = [
      'en', 'no', 'true', 'sql', 'mongodb', 'couchbase', 'cassandra', 'h2Disk', 'h2Memory', 'mysql', 'mariadb', 'postgresql', 'oracle', 'mssql',
      'gatling', 'cucumber', 'protractor', 'angularX', 'react', 'eureka', 'consul', 'jwt', 'oauth2', 'session',
      'ehcache', 'hazelcast', 'infinispan', 'memcached', 'maven', 'gradle', 'docker-compose', 'kubernetes', 'openshift', 'rancher-compose',
      'zuul', 'traefik', 'prometheus', 'elk', 'curator', 'zipkin', 'LoadBalancer', 'NodePort', 'Ingress', 'manualInjection', 'autoInjection',
      'ephemeral', 'persistent', 'default'
    ];

    CodeMirror.defineMode('jdl', function() {
        var words = {};
        function define(style, list) {
            for(var i = 0; i < list.length; i++) {
                words[list[i]] = style;
            }
        };

        // relationships
        define('relationship', relationshipKws);
        // App inner keywords
        define('relationship', appInnerKws);

        // Keywords
        define('keyword', mainKeywords);

        // types
        define('attribute', appKeysKws);
        define('attribute', deploymentKeysKws);
        define('attribute', typeKws);

        // types
        define('qualifier', validationKws);

        // app types
        define('keyword', apptypeKws);

        // types
        define('special', generalKws.concat(paginationKws, serviceKws, dtoKws, searchKws, specialValueKws));

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

            var lastCh = stream.string.charAt(stream.start - 1);
            var startCh = stream.string.trim().charAt(0);
            if (stream.match('//') || (ch === '/')
                || (lastCh + ch === '/*')
                || (startCh === '*') ){
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

            if (/[A-Z*]/.test(ch) || (lastCh !== '/' && ch === '*')
                || (lastCh === '*' && ch !== '/')) {
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
    var keywords = mainKeywords.concat(typeKws, relationshipKws, validationKws, generalKws, paginationKws, dtoKws, serviceKws, apptypeKws, appKeysKws, deploymentKeysKws, specialValueKws);
    CodeMirror.commands.autocomplete = function(cm) {
        cm.showHint({hint: CodeMirror.hint.anyword, list: keywords});
    }
})();
