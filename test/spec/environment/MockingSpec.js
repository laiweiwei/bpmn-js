'use strict';

import { readFileSync } from 'fs';

import { bootstrapViewer, inject } from 'test/TestHelper';

var EventBus = require('diagram-js/lib/core/EventBus').default;

var Viewer = require('lib/Viewer').default;


describe('environment - mocking', function() {

  var diagramXML = readFileSync('test/fixtures/bpmn/simple.bpmn', 'utf-8');

  var mockEventBus, bootstrapCalled;

  beforeEach(bootstrapViewer(diagramXML, {
    modules: Viewer.prototype._modules
  }, function() {
    mockEventBus = new EventBus();

    bootstrapCalled = true;

    return {
      eventBus: mockEventBus
    };
  }));

  afterEach(function() {
    bootstrapCalled = false;
  });


  it('should use spy', inject(function(eventBus) {

    expect(eventBus).to.eql(mockEventBus);
    expect(bootstrapCalled).to.be.true;
  }));


  it('should reparse bootstrap code', inject(function(eventBus) {

    expect(bootstrapCalled).to.be.true;
  }));


  it('should inject bpmnjs', inject(function(bpmnjs) {

    expect(bpmnjs).to.exist;
  }));

});
