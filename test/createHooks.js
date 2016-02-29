import {expect} from 'chai';

import {
  createLocalHook,
  createGlobalHook,
  createTransitionHook,
  isLocalHook,
  isGlobalHook,
  isTransitionHook,
  createHookObject
} from '../src/createHooks'

describe('createHooks', () => {

  describe('createLocalHook', () => {

    it('returns localHook', () => {
      const localHook = createLocalHook('abc');
      expect(isLocalHook(localHook)).to.be.ok;
      expect(isGlobalHook(localHook)).to.not.be.ok;
      expect(isTransitionHook(localHook)).to.not.be.ok;
    });

    it('throws if first argument is not a string', () => {
      expect(() => createLocalHook(() => {})).to.throw(Error);
    })

  });

  describe('createGlobalHook', () => {

    it('returns globalHook', () => {
      const localHook = createGlobalHook(() => {});
      expect(isLocalHook(localHook)).to.not.be.ok;
      expect(isGlobalHook(localHook)).to.be.ok;
      expect(isTransitionHook(localHook)).to.not.be.ok;
    });

    it('throws if first argument is not a function', () => {
      expect(() => createGlobalHook('abc')).to.throw(Error);
    })

  });

  describe('createTransitionHook', () => {
    it('returns transitionHook', () => {
      const localHook = createTransitionHook();
      expect(isLocalHook(localHook)).to.not.be.ok;
      expect(isGlobalHook(localHook)).to.not.be.ok;
      expect(isTransitionHook(localHook)).to.be.ok;
    });
  });

  const localHook = createLocalHook('abc');
  const globalHook = createGlobalHook(() => {});
  const transitionHook = createTransitionHook();
  const nothing = {};

  describe('isLocalHook', () => {

    it('successful detect of localHook', () => {
      expect(isLocalHook(localHook)).to.be.ok;
      expect(isLocalHook(globalHook)).to.be.not.ok;
      expect(isLocalHook(transitionHook)).to.not.be.ok;
      expect(isLocalHook(nothing)).to.not.be.ok;
    })

  });

  describe('isGlobalHook', () => {
    it('successful detect of globalHook', () => {
      expect(isGlobalHook(localHook)).to.not.be.ok;
      expect(isGlobalHook(globalHook)).to.be.ok;
      expect(isGlobalHook(transitionHook)).to.not.be.ok;
      expect(isGlobalHook(nothing)).to.not.be.ok;
    })
  });

  describe('isTransitionHook', () => {
    it('successful detect of transitionHook', () => {
      expect(isTransitionHook(localHook)).to.be.not.ok;
      expect(isTransitionHook(globalHook)).to.be.not.ok;
      expect(isTransitionHook(transitionHook)).to.be.ok;
      expect(isTransitionHook(nothing)).to.not.be.ok;
    })
  });

  describe('createHookObject', () => {

    it('creates localHook from string', () => {
      expect(isLocalHook(createHookObject('abc'))).to.be.ok;
    });

    it('creates globalHook from function', () => {
      expect(isGlobalHook(createHookObject(() => {}))).to.be.ok;
    });

    it('return same hook if inserted', () => {
      expect(createHookObject(localHook)).to.equal(localHook);
      expect(createHookObject(globalHook)).to.equal(globalHook);
      expect(createHookObject(transitionHook)).to.equal(transitionHook);
    });

    it('throws if not hook object, string or function inserted', () => {
      expect(() => createHookObject({})).to.throw(Error);
    });

  });

});

