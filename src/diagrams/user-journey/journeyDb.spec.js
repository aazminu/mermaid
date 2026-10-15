/* eslint-env jasmine */
import journeyDb from './journeyDb';

describe('when using the journeyDb', function() {
  beforeEach(function() {
    journeyDb.clear();
  });

  describe('when calling the clear function', function() {
    beforeEach(function() {
      journeyDb.addSection('weekends skip test');
      journeyDb.addTask('test1', '4: id1, id3');
      journeyDb.addTask('test2', '2: id2');
      journeyDb.clear();
    });

    it.each`
      fn               | expected
      ${'getTasks'}    | ${[]}
      ${'getTitle'}    | ${''}
      ${'getSections'} | ${[]}
      ${'getActors'}   | ${[]}
    `('should clear $fn', ({ fn, expected }) => {
      expect(journeyDb[fn]()).toEqual(expected);
    });
  });

  describe('when calling the clear function', function() {
    beforeEach(function() {
      journeyDb.addSection('weekends skip test');
      journeyDb.addTask('test1', '3: id1, id3');
      journeyDb.addTask('test2', '1: id2');
      journeyDb.clear();
    });

    it.each`
      fn               | expected
      ${'getTasks'}    | ${[]}
      ${'getTitle'}    | ${''}
      ${'getSections'} | ${[]}
    `('should clear $fn', ({ fn, expected }) => {
      expect(journeyDb[fn]()).toEqual(expected);
    });
  });

  describe('tasks and actors should be added', function() {
    it('populates title, tasks, sections, and sorted unique actors', function() {
      journeyDb.setTitle('Shopping');
      journeyDb.addSection('Journey to the shops');
      journeyDb.addTask('Get car keys', ':5:Dad');
      journeyDb.addTask('Go to car', ':3:Dad, Mum, Child#1, Child#2');
      journeyDb.addTask('Drive to supermarket', ':4:Dad');
      journeyDb.addSection('Do shopping');
      journeyDb.addTask('Go shopping', ':5:Mum');

      expect(journeyDb.getTitle()).toEqual('Shopping');
      expect(journeyDb.getTasks()).toEqual([
        {
          score: 5,
          people: ['Dad'],
          section: 'Journey to the shops',
          task: 'Get car keys',
          type: 'Journey to the shops'
        },
        {
          score: 3,
          people: ['Dad', 'Mum', 'Child#1', 'Child#2'],
          section: 'Journey to the shops',
          task: 'Go to car',
          type: 'Journey to the shops'
        },
        {
          score: 4,
          people: ['Dad'],
          section: 'Journey to the shops',
          task: 'Drive to supermarket',
          type: 'Journey to the shops'
        },
        {
          score: 5,
          people: ['Mum'],
          section: 'Do shopping',
          task: 'Go shopping',
          type: 'Do shopping'
        }
      ]);
      expect(journeyDb.getActors()).toEqual(['Child#1', 'Child#2', 'Dad', 'Mum']);
      expect(journeyDb.getSections()).toEqual(['Journey to the shops', 'Do shopping']);
    });

    it('is idempotent when getTasks is called multiple times and resolves actors before and after getTasks', function() {
      journeyDb.addSection('Onboarding');
      journeyDb.addTask('Sign up', '10: Alice, Bob, ');
      expect(journeyDb.getActors()).toEqual(['Alice', 'Bob']);
      expect(journeyDb.getTasks()).toHaveLength(1);
      expect(journeyDb.getTasks()).toHaveLength(1);
      expect(journeyDb.getTasks()[0].score).toEqual(10);

      journeyDb.addTask('Verify email', '8: Charlie');
      expect(journeyDb.getActors()).toEqual(['Alice', 'Bob', 'Charlie']);
      expect(journeyDb.getTasks()).toHaveLength(2);
    });
  });
});

