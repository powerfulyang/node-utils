#!/usr/bin/env zx
import {readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const _wasmFilePath = join(__dirname, 'pkg', 'binary_hamming_distance_bg.wasm');
const _wasm = readFileSync(_wasmFilePath);
const _targetFilePath = join(process.cwd(), 'dist/_virtual', 'binary_hamming_distance_bg.wasm');
writeFileSync(_targetFilePath, _wasm);
