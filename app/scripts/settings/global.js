var settings = {
    'ccEndpoint': {
        'protocol': 'http://',
        'domain': 'localhost',
        'port': ':8000',
        'prefix': '/'
    }
};

settings.ccEndpoint.url =   settings.ccEndpoint.protocol + 
							settings.ccEndpoint.domain +
							settings.ccEndpoint.port +
							settings.ccEndpoint.prefix;
