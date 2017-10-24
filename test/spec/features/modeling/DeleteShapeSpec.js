import { readFileSync } from 'fs';

import { bootstrapModeler, inject } from 'test/TestHelper';

var modelingModule = require('lib/features/modeling').default,
    coreModule = require('lib/core').default;


describe('features/modeling - #removeShape', function() {

  var diagramXML = readFileSync('test/fixtures/bpmn/sequence-flows.bpmn', 'utf-8');

  var testModules = [ coreModule, modelingModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  describe('shape handling', function() {

    it('should execute', inject(function(elementRegistry, modeling) {

      // given
      var taskShape = elementRegistry.get('Task_1'),
          task = taskShape.businessObject;

      // when
      modeling.removeShape(taskShape);

      // then
      expect(task.$parent).to.be.null;
    }));
  });


  describe('undo support', function() {

    it('should undo', inject(function(elementRegistry, modeling, commandStack) {

      // given
      var taskShape = elementRegistry.get('Task_1'),
          task = taskShape.businessObject,
          parent = task.$parent;

      // when
      modeling.removeShape(taskShape);
      commandStack.undo();

      // then
      expect(task.$parent).to.eql(parent);
    }));
  });


  describe('redo support', function() {

    it('redo', inject(function(elementRegistry, modeling, commandStack) {

      // given
      var taskShape = elementRegistry.get('Task_1'),
          task = taskShape.businessObject;

      // when
      modeling.removeShape(taskShape);
      commandStack.undo();
      commandStack.redo();

      // then
      expect(task.$parent).to.be.null;
    }));
  });

});
