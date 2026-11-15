import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import ts from 'typescript'
const source = readFileSync(new URL('../src/lib/scenarioModel.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } })
const { chooseIllustrativeEndpoint, exportScenarioSnapshot, parseScenarioSnapshot } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
const endpoints = [
 {id:'eu-primary',region:'EU-WEST',city:'Dublin',role:'Primary',healthy:true},
 {id:'us-standby',region:'US-EAST',city:'N. Virginia',role:'Standby',healthy:true},
]
function snapshot() { return exportScenarioSnapshot({scenarioId:'quiet-night', scenarioTitle:'A quiet night', endpoints, activeEndpointId:'eu-primary'}) }
test('primary, standby and no healthy destination',()=>{
 assert.equal(chooseIllustrativeEndpoint(endpoints).id,'eu-primary')
 assert.equal(chooseIllustrativeEndpoint([{...endpoints[0],healthy:false},endpoints[1]]).id,'us-standby')
 assert.equal(chooseIllustrativeEndpoint(endpoints.map(e=>({...e,healthy:false}))),null)
})
test('snapshot round trip returns isolated endpoint objects',()=>{
 const restored = parseScenarioSnapshot(snapshot(),'quiet-night')
 assert.deepEqual(restored.endpoints,endpoints)
 restored.endpoints[0].healthy=false
 assert.equal(endpoints[0].healthy,true)
})
test('reject incompatible version, mismatched scenario and corrupt endpoint health',()=>{
 assert.throws(()=>parseScenarioSnapshot({...snapshot(),schemaVersion:2},'quiet-night'))
 assert.throws(()=>parseScenarioSnapshot(snapshot(),'dark-regions'))
 assert.throws(()=>parseScenarioSnapshot({...snapshot(),endpoints:[{...endpoints[0],healthy:'false'},endpoints[1]]},'quiet-night'))
 assert.throws(()=>parseScenarioSnapshot({...snapshot(),illustrativeActiveEndpointId:null},'quiet-night'))
})
