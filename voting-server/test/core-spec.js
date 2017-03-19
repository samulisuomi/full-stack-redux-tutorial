import { List, Map } from 'immutable';
import { expect } from 'chai';

import { setEntries, next, vote } from '../src/core';

describe('application logic', () => {
    describe('set entries', () => {
        it('adds the entries to the state', () => {
            const state = Map();
            const entries = ['Trainspotting', '28 Days Later'];
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of('Trainspotting', '28 Days Later')
            }));
        });
    });

    describe('next', () => {
        it('takes the next two entries under vote', () => {
            const state = Map({
                entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                entries: List.of('Sunshine'),
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later')
                })
            }));
        });

        it('puts the winner of the current vote back to entries', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 4,
                        '28 Days Later': 2
                    })
                }),
                entries: List.of('Sunshine', 'Millions', '127 Hours')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Sunshine', 'Millions'),
                }),
                entries: List.of('127 Hours', 'Trainspotting')
            }));
        });

        it('marks winner when all entries have been voted on', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 4,
                        '28 Days Later': 2
                    })
                }),
                entries: List()
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                winner: 'Trainspotting'
            }));
        })
    });

    describe('vote', () => {
        it('creates a tally for the voted entry', () => {
            const state = Map({
                entries: List(),
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later')
                })
            });
            const nextState = vote(state, 'Trainspotting');
            expect(nextState).to.equal(Map({
                entries: List(),
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 1
                    })
                })
            }));
        });

        it('adds to existing tally for the voted entry', () => {
            const state = Map({
                entries: List(),
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 3,
                        '28 Days Later': 2
                    })
                })
            });
            const nextState = vote(state, 'Trainspotting');
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 4,
                        '28 Days Later': 2
                    })
                }),
                entries: List()
            }));
        });
    });
});