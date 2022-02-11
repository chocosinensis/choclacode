/**
 * The Application Entrypoint
 *
 * Author: Saqib <contact@saqib.eu.org> (https://saqib.eu.org)
 * Application: http://choclacode.eu.org
 */

'use strict'

const express = require('express')

const config = require('../config')

module.exports = config(express())
