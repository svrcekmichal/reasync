import {expect} from 'chai';

import { createGlobalHook, createTransitionHook } from '../src/createHooks';

import { createResolver } from '../src/createResolver'

const asyncTest = (done, test) => {
  try {
    test();
    done();
  } catch (e) {
    done(e);
  }
};

const setTimeoutPromise = (beforeResolve, success = true, time = 2) => () => new Promise((resolve,reject) => setTimeout(() => {
  beforeResolve();
  success ? resolve() : reject('Rejected by user');
},time));

describe('createResolver', () => {

  let startTime;
  let resolver;

  beforeEach(() => {
    startTime = new Date();
    resolver = createResolver();
  });

  it('trigger hooks in sequence', done => {
    let p1Time, p2Time, c2Time;
    const p1 = setTimeoutPromise(() => p1Time = new Date());
    const p2 = setTimeoutPromise(() => p2Time = new Date());
    const c2 = () => c2Time = new Date();

    resolver
      .addHooks(p1)
      .addHooks(p2,c2);

    resolver.triggerHooks([],{}).then(() => {
      asyncTest(done,() => {
        expect(p1Time - startTime).to.be.below(p2Time - startTime);
        // c2 resolve right after, in some cases it can fire in same millisecond as p1 finish
        expect(p1Time - startTime).to.be.most(c2Time - startTime);
      });
    });

  });

  it('trigger hooks almost parallelly', done => {
    let p1Time, p2Time, p3Time, p4Time, c2Time, c3Time;

    const p1 = setTimeoutPromise(() => p1Time = new Date());
    const p2 = setTimeoutPromise(() => p2Time = new Date());
    const p3 = setTimeoutPromise(() => p3Time = new Date());
    const p4 = setTimeoutPromise(() => p4Time = new Date());
    const c2 = () => c2Time = new Date();
    const c3 = () => c3Time = new Date();

    resolver
      .addHooks(p1)
      .addHooks(p2, p3, c2, c3)
      .addHooks(p4);

    resolver.triggerHooks([],{}).then(() => {
      asyncTest(done,() => {
        expect(p1Time - startTime).to.be.below(p2Time - startTime);
        expect(p1Time - startTime).to.be.below(p3Time - startTime);
        expect(p1Time - startTime).to.be.most(c2Time - startTime);
        expect(p4Time - startTime).to.be.least(c3Time - startTime);
        expect(p4Time - startTime).to.be.above(p2Time - startTime);
        expect(p4Time - startTime).to.be.above(p3Time - startTime);
      });
    });

  });

  it('trigger transition function when transition hook triggered', done => {
    let p1Time, p2Time, transitionTime;
    const p1 = setTimeoutPromise(() => p1Time = new Date());
    const transition = () => transitionTime = new Date();
    const p2 = setTimeoutPromise(() => p2Time = new Date());

    resolver
      .addHooks(p1)
      .addHooks(createTransitionHook())
      .addHooks(p2);

    resolver.triggerHooks([],{},transition).then(() => {
      asyncTest(done,() => {
        expect(transitionTime).to.be.ok;
        expect(p1Time - startTime).to.be.most(transitionTime - startTime);
        expect(p2Time - startTime).to.be.least(transitionTime - startTime);
      });
    });
  });

  it('stop on hook layer which rejected promise', done => {
    let p1Time, p2Time, p3Time;
    const p1 = setTimeoutPromise(() => p1Time = new Date());
    const p2 = setTimeoutPromise(() => p2Time = new Date(), false);
    const p3 = setTimeoutPromise(() => p3Time = new Date());

    resolver
      .addHooks(p1)
      .addHooks(createGlobalHook(p2, {stopOnException:true}))
      .addHooks(p3);

    resolver.triggerHooks([],{}).catch(() => {
      asyncTest(done,() => {
        expect(p1Time).to.be.ok;
        expect(p2Time).to.be.ok;
        expect(p3Time).to.not.be.ok;
      });
    });
  });

  it('execute promises which should execute even if previous failed', done => {
    let p1Time, p2Time, p3Time, p4Time;
    const p1 = setTimeoutPromise(() => p1Time = new Date());
    const p2 = setTimeoutPromise(() => p2Time = new Date(), false);
    const p3 = setTimeoutPromise(() => p3Time = new Date());
    const p4 = setTimeoutPromise(() => p4Time = new Date());

    resolver
      .addHooks(p1)
      .addHooks(createGlobalHook(p2, {stopOnException:true}))
      .addHooks(
        p3,
        createGlobalHook(p4, {executeIfPreviousFailed: true})
      );

    resolver.triggerHooks([],{}).catch(() => {
      asyncTest(done,() => {
        expect(p1Time).to.be.ok;
        expect(p2Time).to.be.ok;
        expect(p3Time).to.not.be.ok;
        expect(p4Time).to.be.ok;
      });
    });
  });

  it('triggerHooks return promise which resolve if everything resolved', done => {
    let p1Time, p2Time, successTime, failureTime;
    const p1 = setTimeoutPromise(() => p1Time = new Date());
    const p2 = setTimeoutPromise(() => p2Time = new Date());

    resolver
      .addHooks(p1)
      .addHooks(p2);

    resolver.triggerHooks([],{}).then(
      () => successTime = new Date(),
      () => failureTime = new Date()
    ).then(() => {
      asyncTest(done, () => {
        expect(successTime).to.be.ok;
        expect(p1Time - startTime).to.be.below(successTime - startTime);
        expect(p2Time - startTime).to.be.most(successTime - startTime);
        expect(failureTime).to.not.be.ok;
      })
    })
  });

  it('triggerHooks return promise which reject if stopOnException failed', done => {
    let p1Time, p2Time, successTime, failureTime;
    const p1 = setTimeoutPromise(() => p1Time = new Date());
    const p2 = setTimeoutPromise(() => p2Time = new Date(), false);

    resolver
      .addHooks(p1)
      .addHooks(createGlobalHook(p2,{stopOnException:true}));

    resolver.triggerHooks([],{}).then(
      () => successTime = new Date(),
      () => failureTime = new Date()
    ).then(() => {
      asyncTest(done, () => {
        expect(successTime).to.not.be.ok;
        expect(failureTime).to.be.ok;
        expect(p1Time - startTime).to.be.below(failureTime - startTime);
        expect(p2Time - startTime).to.be.most(failureTime - startTime);
      })
    })
  });

});

