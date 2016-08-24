import { expect } from 'chai';
import { getActionTypes, SUCCESS_SUFFIX, ERROR_SUFFIX } from './../src/getActionTypes';

describe('getActionTypes', () => {

  it('should return default types with `type` key', () => {
    const action = {type:'TYPE'};
    const types = getActionTypes(action);
    expect(types).to.be.array;
    expect(types[0]).to.equal(action.type);
    expect(types[1]).to.equal(`${action.type}${SUCCESS_SUFFIX}`);
    expect(types[2]).to.equal(`${action.type}${ERROR_SUFFIX}`);
  });

  it('should return custom types with `types` key', () => {
    const action = {
      types:[
        'TYPE',
        'TYPE_AWESOME',
        'TYPE_OH_NO'
      ]
    };
    const types = getActionTypes(action);
    expect(types).to.be.array;
    expect(types[0]).to.equal(action.types[0]);
    expect(types[1]).to.equal(`${action.types[1]}`);
    expect(types[2]).to.equal(`${action.types[2]}`);

  });

  it('should throw if not type or types key received', () => {
      const action = {};
      expect(getActionTypes.bind(null,action)).to.throw(Error, /types/, /type/);
  });

  it('should use custom success sufix if defined', () => {
    const action = {type:'TYPE'};
    const types = getActionTypes(action, {successSuffix:'_AWESOME'});
    expect(types).to.be.array;
    expect(types[0]).to.equal(action.type);
    expect(types[1]).to.equal(`${action.type}_AWESOME`);
    expect(types[2]).to.equal(`${action.type}${ERROR_SUFFIX}`);
  });

  it('should use custom error sufix if defined', () => {
    const action = {type:'TYPE'};
    const types = getActionTypes(action, {errorSuffix:'_OH_NO'});
    expect(types).to.be.array;
    expect(types[0]).to.equal(action.type);
    expect(types[1]).to.equal(`${action.type}${SUCCESS_SUFFIX}`);
    expect(types[2]).to.equal(`${action.type}_OH_NO`);
  });

  it('should use custom success and error sufix if defined', () => {
    const action = {type:'TYPE'};
    const types = getActionTypes(action,{
      successSuffix:'_AWESOME',
      errorSuffix:'_OH_NO'
    });
    expect(types).to.be.array;
    expect(types[0]).to.equal(action.type);
    expect(types[1]).to.equal(`${action.type}_AWESOME`);
    expect(types[2]).to.equal(`${action.type}_OH_NO`);
  });

});
