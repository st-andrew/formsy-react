import React from 'react'
import TestUtils from 'react-dom/test-utils'

import Formsy from './..'
import TestInput from './utils/TestInput'

class TestForm extends React.Component {
  render () {
    return (
      <Formsy.Form>
        <TestInput name='foo' validations='isNumeric' value={this.props.inputValue} />
      </Formsy.Form>
    )
  }
}

export default {

  'should pass with a default value': function (test) {
    const form = TestUtils.renderIntoDocument(<TestForm />)
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput)
    test.equal(inputComponent.isValid(), true)
    test.done()

  },

  'should pass with an empty string': function (test) {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue='' />)
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput)
    test.equal(inputComponent.isValid(), true)
    test.done()

  },

  'should fail with an unempty string': function (test) {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue='foo' />)
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput)
    test.equal(inputComponent.isValid(), false)
    test.done()

  },

  'should pass with a number as string': function (test) {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue='+42' />)
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput)
    test.equal(inputComponent.isValid(), true)
    test.done()

  },

  'should fail with a number as string with not digits': function (test) {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue='42 is an answer' />)
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput)
    test.equal(inputComponent.isValid(), false)
    test.done()

  },

  'should pass with an int': function (test) {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue={42} />)
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput)
    test.equal(inputComponent.isValid(), true)
    test.done()

  },

  'should pass with a float': function (test) {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue={Math.PI} />)
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput)
    test.equal(inputComponent.isValid(), true)
    test.done()

  },

  'should fail with a float in science notation': function (test) {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue='-1e3' />)
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput)
    test.equal(inputComponent.isValid(), false)
    test.done()

  },

  'should pass with an undefined': function (test) {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue={undefined} />)
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput)
    test.equal(inputComponent.isValid(), true)
    test.done()

  },

  'should pass with a null': function (test) {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue={null} />)
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput)
    test.equal(inputComponent.isValid(), true)
    test.done()

  },

  'should pass with a zero': function (test) {
    const form = TestUtils.renderIntoDocument(<TestForm inputValue={0} />)
    const inputComponent = TestUtils.findRenderedComponentWithType(form, TestInput)
    test.equal(inputComponent.isValid(), true)
    test.done()

  }

}
