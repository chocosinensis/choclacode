/**
 * The Application Entrypoint
 *
 * Author: Saqib <contact@saqib.ml> (https://saqib.ml)
 * Application: http://choclacode.eu.org
 */

'use strict'

const express = require('express')

const config = require('../config')

module.exports = config(express())
