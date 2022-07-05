const maxLogFileSize = 1000000;
const numBackups = 3;

const layout = {
    "type" : "pattern",
    "pattern" : "%[[%d{ISO8601_WITH_TZ_OFFSET}] [%p] %c%] - %m",
};

module.exports = {
    "appenders": {
        "stdout" : {
            "type" : "stdout",
            "layout" : layout
        },
        "defaultFileErrors" : {
            "type" : "file",
            "filename" : "logs/default.errors.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "defaultFileDebug" : {
            "type" : "file",
            "filename" : "logs/default.debug.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "defaultErrorsFilter": {
            "type": "logLevelFilter",
            "level": "error",
            "appender": "defaultFileErrors"
        },
        "defaultStdFilter": {
            "type": "logLevelFilter",
            "level": "debug",
            "maxLevel" : "info",
            "appender": "defaultFileDebug"
        },
        "adminFileErrors" : {
            "type" : "file",
            "filename" : "logs/admin.errors.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "adminFileDebug" : {
            "type" : "file",
            "filename" : "logs/admin.debug.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "adminErrorsFilter": {
            "type": "logLevelFilter",
            "level": "error",
            "appender": "adminFileErrors"
        },
        "adminStdFilter": {
            "type": "logLevelFilter",
            "level": "debug",
            "maxLevel" : "info",
            "appender": "adminFileDebug"
        },
        "apiFileErrors" : {
            "type" : "file",
            "filename" : "logs/api.errors.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "apiFileDebug" : {
            "type" : "file",
            "filename" : "logs/api.debug.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "apiErrorsFilter": {
            "type": "logLevelFilter",
            "level": "error",
            "appender": "apiFileErrors"
        },
        "apiStdFilter": {
            "type": "logLevelFilter",
            "level": "debug",
            "maxLevel" : "info",
            "appender": "apiFileDebug"
        },
        "integrationFileErrors" : {
            "type" : "file",
            "filename" : "logs/integration.errors.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "integrationFileDebug" : {
            "type" : "file",
            "filename" : "logs/integration.debug.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "integrationErrorsFilter": {
            "type": "logLevelFilter",
            "level": "error",
            "appender": "integrationFileErrors"
        },
        "integrationStdFilter": {
            "type": "logLevelFilter",
            "level": "debug",
            "maxLevel" : "info",
            "appender": "integrationFileDebug"
        },
        "interfaceFileErrors" : {
            "type" : "file",
            "filename" : "logs/interface.errors.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "interfaceFileDebug" : {
            "type" : "file",
            "filename" : "logs/interface.debug.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "interfaceErrorsFilter": {
            "type": "logLevelFilter",
            "level": "error",
            "appender": "interfaceFileErrors"
        },
        "interfaceStdFilter": {
            "type": "logLevelFilter",
            "level": "debug",
            "maxLevel" : "info",
            "appender": "interfaceFileDebug"
        },
        "storageFileErrors" : {
            "type" : "file",
            "filename" : "logs/storage.errors.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "storageFileDebug" : {
            "type" : "file",
            "filename" : "logs/storage.debug.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "storageErrorsFilter": {
            "type": "logLevelFilter",
            "level": "error",
            "appender": "storageFileErrors"
        },
        "storageStdFilter": {
            "type": "logLevelFilter",
            "level": "debug",
            "maxLevel" : "info",
            "appender": "storageFileDebug"
        },
        "rulesFileErrors" : {
            "type" : "file",
            "filename" : "logs/rules.errors.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "rulesFileDebug" : {
            "type" : "file",
            "filename" : "logs/rules.debug.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "rulesErrorsFilter": {
            "type": "logLevelFilter",
            "level": "error",
            "appender": "rulesFileErrors"
        },
        "rulesStdFilter": {
            "type": "logLevelFilter",
            "level": "debug",
            "maxLevel" : "info",
            "appender": "rulesFileDebug"
        },
        "identityFileErrors" : {
            "type" : "file",
            "filename" : "logs/identity.errors.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "identityFileDebug" : {
            "type" : "file",
            "filename" : "logs/identity.debug.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "identityErrorsFilter": {
            "type": "logLevelFilter",
            "level": "error",
            "appender": "identityFileErrors"
        },
        "identityStdFilter": {
            "type": "logLevelFilter",
            "level": "debug",
            "maxLevel" : "info",
            "appender": "identityFileDebug"
        },
        "messagingFileErrors" : {
            "type" : "file",
            "filename" : "logs/messaging.errors.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "messagingFileDebug" : {
            "type" : "file",
            "filename" : "logs/messaging.debug.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "messagingErrorsFilter": {
            "type": "logLevelFilter",
            "level": "error",
            "appender": "messagingFileErrors"
        },
        "messagingStdFilter": {
            "type": "logLevelFilter",
            "level": "debug",
            "maxLevel" : "info",
            "appender": "messagingFileDebug"
        },
        "blobFileErrors" : {
            "type" : "file",
            "filename" : "logs/blob.errors.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "blobFileDebug" : {
            "type" : "file",
            "filename" : "logs/blob.debug.log",
            "maxLogSize" : maxLogFileSize,
            "numBackups" : numBackups,
            "layout" : layout
        },
        "blobErrorsFilter": {
            "type": "logLevelFilter",
            "level": "error",
            "appender": "blobFileErrors"
        },
        "blobStdFilter": {
            "type": "logLevelFilter",
            "level": "debug",
            "maxLevel" : "info",
            "appender": "blobFileDebug"
        },
    },
    "categories": {
        "default": {
            "appenders": [
                "stdout",
                "defaultStdFilter",
                "defaultErrorsFilter"
            ],
            "level": "DEBUG"
        },
        "admin": {
            "appenders": [
                "stdout",
                "adminStdFilter",
                "adminErrorsFilter"
            ],
            "level": "DEBUG"
        },
        "api": {
            "appenders": [
                "stdout",
                "apiStdFilter",
                "apiErrorsFilter"
            ],
            "level": "DEBUG"
        },
        "integration": {
            "appenders": [
                "stdout",
                "integrationStdFilter",
                "integrationErrorsFilter"
            ],
            "level": "DEBUG"
        },
        "storage": {
            "appenders": [
                "stdout",
                "storageStdFilter",
                "storageErrorsFilter"
            ],
            "level": "DEBUG"
        },
        "rules": {
            "appenders": [
                "stdout",
                "rulesStdFilter",
                "rulesErrorsFilter"
            ],
            "level": "DEBUG"
        },
        "identity": {
            "appenders": [
                "stdout",
                "identityStdFilter",
                "identityErrorsFilter"
            ],
            "level": "DEBUG"
        },
        "interface": {
            "appenders": [
                "stdout",
                "interfaceStdFilter",
                "interfaceErrorsFilter"
            ],
            "level": "DEBUG"
        },
        "messaging": {
            "appenders": [
                "stdout",
                "messagingStdFilter",
                "messagingErrorsFilter"
            ],
            "level": "DEBUG"
        },
        "blob": {
            "appenders": [
                "stdout",
                "blobStdFilter",
                "blobErrorsFilter"
            ],
            "level": "DEBUG"
        }
    }
};